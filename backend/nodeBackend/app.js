// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---- Env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY; // sb_secret_... (server-only)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
  process.exit(1);
}
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize Supabase using **secret** key (server-only)
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- helpers
const PHONE_REGEX =
  /(?:\+?1[\s.-]?)?(?:\((\d{3})\)|(\d{3}))[\s.-]?(\d{3})[\s.-]?(\d{4})/;

function formatUsPhoneMatch(m) {
  return `(${m[1] || m[2]}) ${m[3]}-${m[4]}`;
}

function fallbackExtract(prompt) {
  // phone
  const m = prompt.match(PHONE_REGEX);
  const venue_phone = m ? formatUsPhoneMatch(m) : null;

  // venue name heuristic: text after " at " until punctuation/end
  let venue_name = null;
  const atIdx = prompt.toLowerCase().indexOf(' at ');
  if (atIdx !== -1) {
    const rest = prompt.slice(atIdx + 4);
    const stop = rest.search(/[,\.\n]/);
    venue_name = (stop === -1 ? rest : rest.slice(0, stop)).trim();
    venue_name = venue_name.replace(/^the\s+/i, '').trim();
    if (!venue_name) venue_name = null;
  }
  return { venue_name, venue_phone };
}

function coerceJsonFromModel(text) {
  // Strip fences and pull first {...}
  const cleaned = text.replace(/```json/gi, '```').replace(/```/g, '').trim();
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s !== -1 && e !== -1 && e > s) {
    try {
      return JSON.parse(cleaned.slice(s, e + 1));
    } catch {}
  }
  // last resort
  return JSON.parse(cleaned);
}

async function extractVenueInfo(prompt) {
  try {
    // NOTE: avoid responseMimeType/responseSchema since your SDK is hitting v1
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const extractionPrompt = `
Return ONLY valid JSON. Extract:
- venue_name
- venue_phone

Format:
{
  "venue_name": string|null,
  "venue_phone": string|null
}

If unknown, use null. Do not add any extra fields or text.

User text:
${prompt}
    `.trim();

    const result = await model.generateContent(extractionPrompt);
    const text = result.response.text();
    let json;
    try {
      json = coerceJsonFromModel(text);
    } catch {
      // If model didn't comply, fallback
      return fallbackExtract(prompt);
    }

    const safe = {
      venue_name:
        (json && typeof json.venue_name === 'string' && json.venue_name.trim()) ||
        null,
      venue_phone:
        (json && typeof json.venue_phone === 'string' && json.venue_phone.trim()) ||
        null,
    };

    if (!safe.venue_name || !safe.venue_phone) {
      const fb = fallbackExtract(prompt);
      return {
        venue_name: safe.venue_name ?? fb.venue_name ?? null,
        venue_phone: safe.venue_phone ?? fb.venue_phone ?? null,
      };
    }
    return safe;
  } catch (err) {
    console.warn('LLM extraction failed, using fallback:', err?.message);
    return fallbackExtract(prompt);
  }
}

// Try cuisine filter with lowercase first, then TitleCase "Cuisine"
async function getRestaurantsByCuisine(cuisine) {
  // attempt 1: lowercase column name
  let q = supabase.from('Restaurants').select('*').ilike('cuisine', `%${cuisine}%`).limit(5);
  let { data, error } = await q;

  // if the problem is "column does not exist", retry with "Cuisine"
  if (error && error.code === '42703') {
    console.log('Retrying cuisine filter using "Cuisine" column casing...');
    console.log(cuisine);
    const q2 = supabase.from('Restaurants').select('*').ilike('Cuisine', `%${cuisine}%`).limit(5);
    const r2 = await q2;
    data = r2.data;
    error = r2.error;
  }

  // if table casing is actually "Restaurants", retry
  if ((error && /relation .* does not exist/i.test(error.message)) || (error && /missing from-clause/i.test(error.message))) {
    console.log('Retrying with capitalized table name "Restaurants"...');
    const r3 = await supabase.from('Restaurants').select('*').ilike('Cuisine', `%${cuisine}%`).limit(5);
    return r3.error ? [] : (r3.data ?? []);
  }

  if (error) {
    console.error('Supabase query error:', error);
    throw new Error('Failed to query restaurants');
  }
  return data ?? [];
}

function extractPhoneNumbers(rows) {
  return rows.map((r) => {
    // Support both snake/lowercase and TitleCase columns
    const venue_name = r.name || r.venue_name || r.Name || r.VenueName || r['Venue Name'] || null;
    const venue_phone = r.phone || r.venue_phone || r.Phone || r['Venue Phone'] || null;
    return { venue_name, venue_phone };
  });
}

// Function to call Python voice agent
async function callPythonVoiceAgent(venueData, clientInfo) {
  return new Promise((resolve, reject) => {
    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, '..', 'voice-agent', 'voiceAgentRunner.py');
    
    // Prepare the data for Python
    const pythonData = {
      venue_name: venueData.venue_name,
      venue_phone: venueData.venue_phone,
      client_name: clientInfo.client_name || 'Client',
      event_date: clientInfo.event_date || new Date().toISOString().split('T')[0],
      guest_count: clientInfo.guest_count || 2,
      budget_range: clientInfo.budget_range || '$50-$100',
      event_type: clientInfo.event_type || 'Dinner Reservation',
      dietary_restrictions: clientInfo.dietary_restrictions || [],
      special_requests: clientInfo.special_requests || null,
      preferred_cuisine: clientInfo.preferred_cuisine || null
    };
    
    console.log('Calling Python voice agent with data:', pythonData);
    
    // Spawn Python process
    const pythonProcess = spawn('python3', [pythonScriptPath, JSON.stringify(pythonData)]);
    let outputData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = outputData
          resolve(result);
        } catch (parseError) {
          console.error('Error parsing Python output:', parseError);
          reject(new Error('Failed to parse Python output'));
        }
      } else {
        console.error('Python process exited with code:', code);
        console.error('Python stderr:', errorData);
        reject(new Error(`Python process failed with code ${code}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(error);
    });
  });
}

// Function to check inquiry status later (for calls that are still in progress)
async function checkInquiryStatus(inquiryId) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '..', 'voice-agent', 'check_status.py');
    const pythonData = { inquiry_id: inquiryId };
    
    const pythonProcess = spawn('python3', [pythonScriptPath, JSON.stringify(pythonData)]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error.message}`));
        }
      } else {
        reject(new Error(`Python process exited with code ${code}. Stderr: ${stderr}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

// Routes
 app.post('/api/process-prompt', async (req, res) => {
   try {
     const { prompt, cuisine: cuisineFromClient, clientInfo } = req.body;
     if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

     const extracted = await extractVenueInfo(prompt);
     const cuisine = (cuisineFromClient || 'italian').trim();
     const restaurants = await getRestaurantsByCuisine(cuisine);
     const phones = extractPhoneNumbers(restaurants);

     // Call Python voice agent with the extracted venue data
     let voiceAgentResult = null;
     if (extracted.venue_name && extracted.venue_phone) {
       try {
         console.log('Calling Python voice agent...');
         voiceAgentResult = await callPythonVoiceAgent(extracted, clientInfo || {});
         console.log('Voice agent result:', voiceAgentResult);
       } catch (voiceError) {
         console.error('Voice agent error:', voiceError);
         voiceAgentResult = { error: voiceError.message };
       }
     }

     res.json({
       success: true,
       extracted_venue: extracted,
       matching_restaurants: restaurants,
       phone_numbers: phones,
       voice_agent_result: voiceAgentResult,
       message: 'Prompt processed successfully',
     });
   } catch (err) {
     console.error('Error processing prompt:', err);
     res.status(500).json({ error: 'Failed to process prompt', details: err.message });
   }
 });

// New endpoint to check inquiry status later
app.post('/api/check-inquiry-status', async (req, res) => {
  try {
    const { inquiry_id } = req.body;
    if (!inquiry_id) {
      return res.status(400).json({ error: 'inquiry_id is required' });
    }

    console.log(`Checking status for inquiry: ${inquiry_id}`);
    const statusResult = await checkInquiryStatus(inquiry_id);
    
    res.json({
      success: true,
      inquiry_status: statusResult,
      message: 'Inquiry status retrieved successfully'
    });
  } catch (err) {
    console.error('Error checking inquiry status:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', message: 'Backend is running' })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health:  http://localhost:${PORT}/api/health`);
  console.log(`Process: http://localhost:${PORT}/api/process-prompt`);
});

module.exports = app;
