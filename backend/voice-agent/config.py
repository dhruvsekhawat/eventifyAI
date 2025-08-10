# Configuration file for Bland AI Voice Agent
# Replace the placeholder values with your actual credentials

# Your Bland AI API key
# Get this from your Bland AI dashboard
API_KEY = "your_bland_ai_api_key_here"

# Your pathway ID for restaurant catering inquiries (optional)
# Get this from your Bland AI pathways dashboard
# If not provided, the system will use task-based calls instead
PATHWAY_ID = "your_pathway_id_here"

# Alternative: Use task-based calls instead of pathways
# Set to True to use task-based calls, False to use pathways
USE_TASK_BASED_CALLS = True

# Custom task prompt (only used if USE_TASK_BASED_CALLS is True)
# Leave empty to use auto-generated tasks from requirements
CUSTOM_TASK = """Call potential event venues to inquire about availability, pricing, and capacity for a specific date and time. Ask about included services (tables, chairs, AV, parking), restrictions (noise, alcohol, decor), and any additional fees. Confirm dietary accommodation options with in-house catering (if applicable). Collect all details, send them back in a structured format, and, if the venue meets budget and requirements, proceed to tentatively reserve the date pending client approval.

Tone & Personality: Friendly, professional, confident, and concise. Polite and clear in questions, with a warm but business-focused demeanor.

Example phrases:
Greeting: "Hi, this is [Agent Name] calling on behalf of [Client Name] to check venue availability for an upcoming event."
Info request: "Could you confirm if your venue is available on [date] for around [guest count] guests?"
Follow-up: "What's the total rental cost, and does that include tables, chairs, and AV equipment?"
Clarification: "Are there any restrictions on catering, decorations, or music volume?"
Closing: "Thanks so much for your time. Could you please email me the full quote and any additional details? I'll review this with my client and get back to you."

Key information to gather:
- Venue availability for the specified date and time
- Pricing and what's included (tables, chairs, AV, parking)
- Capacity and space details
- Restrictions (noise, alcohol, decorations, music)
- Additional fees and charges
- Catering options and dietary accommodations
- Booking process and deposit requirements
- Contact information for follow-up

Be thorough in your questions and take detailed notes. If the venue meets requirements, express interest in proceeding with a tentative reservation pending client approval."""

# API base URL (usually doesn't need to change)
BASE_URL = "https://api.bland.ai/v1"

# Call timeout settings (in seconds)
CALL_TIMEOUT = 300  # 5 minutes
CHECK_INTERVAL = 10  # Check status every 10 seconds

# Phone number format preferences
# Set to True to enforce E.164 format validation
ENFORCE_E164_FORMAT = True

# Logging configuration
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
LOG_TO_FILE = False
LOG_FILE_PATH = "voice_agent.log"

API_KEY = "org_984e2aaad1993874b7806883c0d68e46ad3b717df99f90ede19b4f52b32bafbf03f6fae42cf12c024df569"