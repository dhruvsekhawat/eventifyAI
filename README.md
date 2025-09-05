# Eventify.ai - AI-Powered Event Planning Platform

Eventify.ai eliminates the time-consuming hassle of event organization by automating vendor outreach, negotiation, and quote collection. Users simply provide basic event details, and our AI handles the rest.

## What We Built

**Automated Event Planning Pipeline**
- Users enter event details (date, location, guest count, budget, dietary restrictions)
- AI voice agents automatically call restaurants, venues, and decorators
- Real-time negotiation with vendors to secure competitive pricing
- Automated quote collection via phone calls and email scraping
- Presentable quote comparison dashboard for easy decision making

**Core Technology Stack**
- React frontend with TypeScript and Tailwind CSS
- Node.js backend with Express
- Python voice agents using Bland AI for automated vendor calls
- Supabase for authentication and data storage
- Google Gemini AI for text processing and summarization
- Real-time dashboard with live voice agent status monitoring

## Key Features

- **Automated Vendor Outreach**: AI makes calls to restaurants, venues, and decorators based on event requirements
- **Real-time Negotiation**: Voice agents negotiate pricing and gather detailed quotes
- **Quote Aggregation**: Collects and compares quotes from multiple vendors
- **User Dashboard**: Clean interface to review quotes and approve selections
- **Dietary Accommodation**: Handles special dietary requirements and restrictions

## Quick Start

### Prerequisites
- Node.js 18.17.0+
- Python 3.8+
- Supabase account
- Bland AI API key
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dhruvsekhawat/odyssey.git
cd odyssey
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend/nodeBackend
npm install
```

4. **Install Python dependencies**
```bash
cd ../voice-agent
pip install -r requirements.txt
```

### Environment Setup

1. **Backend environment variables** (create `backend/nodeBackend/.env`)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

2. **Voice agent configuration** (update `backend/voice-agent/config.py`)
```
API_KEY=your_bland_ai_api_key
```

### Running the Application

1. **Start the backend server**
```bash
cd backend/nodeBackend
npm start
```

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
odyssey/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/            # Utilities and configurations
├── backend/
│   ├── nodeBackend/        # Express.js API server
│   └── voice-agent/        # Python voice agent service
└── requirements.txt        # Python dependencies
```

## API Endpoints

- `POST /api/process-prompt` - Process event data and initiate voice agent calls
- `POST /api/events/update-summary` - Update event with voice agent results
- `POST /api/check-inquiry-status` - Check status of ongoing voice agent calls
- `GET /api/health` - Health check endpoint

## Voice Agent Integration

The Python voice agent service handles:
- Automated phone calls to vendors using Bland AI
- Real-time conversation and negotiation
- Quote extraction and summarization
- Email scraping for additional quotes
- Status monitoring and completion tracking

## Database Schema

The application uses Supabase with the following main tables:
- `events` - Event details and summaries
- `guests` - Guest lists and RSVPs
- `user_profiles` - User authentication and preferences
- `voice_agent_queue` - Voice agent task queue

## Deployment

The application is designed for deployment on:
- Frontend: Vercel (recommended)
- Backend: Render or Railway
- Database: Supabase (hosted)

## License

MIT License
