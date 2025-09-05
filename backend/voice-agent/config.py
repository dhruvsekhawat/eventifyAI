# Configuration file for Bland AI Voice Agent
# Replace the placeholder values with your actual credentials

# Your Bland AI API key
# Get this from your Bland AI dashboard
API_KEY = "org_984e2aaad1993874b7806883c0d68e46ad3b717df99f90ede19b4f52b32bafbf03f6fae42cf12c024df569"

# Your pathway ID for restaurant reservations (optional)
# Get this from your Bland AI pathways dashboard
# If not provided, the system will use task-based calls instead

# Alternative: Use task-based calls instead of pathways
# Set to True to use task-based calls, False to use pathways
USE_TASK_BASED_CALLS = True

# Custom task prompt (only used if USE_TASK_BASED_CALLS is True)
# Leave empty to use auto-generated tasks from requirements
CUSTOM_TASK = """Call restaurants to make dinner reservations for a specific date, time, and party size. Inquire about table availability, reservation policies, and any special requests. Ask about dress code, parking options, and any special accommodations needed. Collect all reservation details and confirm the booking.

Tone & Personality: Friendly, polite, and professional. Be courteous and clear about reservation requirements, with a warm and appreciative demeanor.

Example phrases:
Greeting: "Hi, I'd like to make a dinner reservation for [date] at [time]."
Info request: "Do you have availability for a party of [guest count] on [date] at [time]?"
Follow-up: "What's your reservation policy? Do you require a credit card to hold the table?"
Clarification: "Is there a dress code, and do you have parking available?"
Special requests: "We have some dietary restrictions - do you offer vegetarian and gluten-free options?"
Closing: "Perfect! Could you confirm the reservation details? I have [client name] for [date] at [time] for [guest count] people."

Key information to gather:
- Table availability for the specified date and time
- Party size accommodation
- Reservation confirmation details
- Dress code requirements
- Parking and accessibility options
- Special dietary accommodations
- Cancellation policy and deposit requirements
- Contact information for changes or questions

Be thorough in confirming all details and ensure the reservation is properly booked. If the restaurant cannot accommodate the request, ask about alternative times or dates."""

# API base URL (usually doesn't need to change)
BASE_URL = "https://api.bland.ai/v1"

# Call timeout settings (in seconds)
CALL_TIMEOUT = 300  # 5 minutes
CHECK_INTERVAL = 10  # Check status every 10 seconds

# Phone number format preferences
# Set to True to enforce E.164 format validation
ENFORCE_E164_FORMAT = True

# Voice Configuration
# Bland AI voice options - choose one that sounds most natural
# Valid voice IDs: "maya" (Young American Female), "tina" (Gentle American Female), "adriana" (Professional American Female)
VOICE_ID = "maya"  # Young American Female - soft, professional, natural
VOICE_SETTINGS = {
    "voice_id": "maya",   # Young American Female - soft, professional, natural
    "stability": 0.6,     # Slightly higher stability for consistency (0.0 to 1.0)
    "similarity_boost": 0.8,   # Natural similarity for human-like sound (0.0 to 1.0)
    "style": 0.2,         # Lower style for less robotic, more natural speech (0.0 to 1.0)
    "use_speaker_boost": True  # Enhance voice clarity
}

# Logging configuration
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
LOG_TO_FILE = False
LOG_FILE_PATH = "voice_agent.log"