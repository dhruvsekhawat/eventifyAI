# 🏢 Bland AI Voice Service - Production Guide

A production-ready Python service for automating venue inquiries using Bland AI's voice agents. Designed for backend integration with support for multiple concurrent calls.

## 🚀 Features

- **Multiple Concurrent Agents**: Handle multiple venue inquiries simultaneously
- **Production-Ready**: Clean API interface, error handling, and resource management
- **Structured Data**: Comprehensive input/output models for venue inquiries
- **Async Support**: Non-blocking call monitoring and completion handling
- **Environment Config**: Flexible configuration for different deployment environments
- **Resource Management**: Automatic cleanup and monitoring of active calls

## 📋 Requirements

- Python 3.8+
- Bland AI API key
- `requests` library

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Backend API   │───▶│  VoiceServiceAPI │───▶│  VoiceService   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ BlandVoiceAgent  │    │ Bland AI API    │
                       └──────────────────┘    └─────────────────┘
```

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo>
cd odyssey
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set environment variables**
```bash
export BLAND_AI_API_KEY="your_actual_api_key_here"
export ENVIRONMENT="production"  # or "development", "staging"
export MAX_CONCURRENT_CALLS="20"
export CALL_TIMEOUT_SECONDS="600"
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BLAND_AI_API_KEY` | Bland AI API key | - | ✅ |
| `ENVIRONMENT` | Environment (dev/staging/prod) | `development` | ❌ |
| `MAX_CONCURRENT_CALLS` | Max concurrent calls | `10` | ❌ |
| `CALL_TIMEOUT_SECONDS` | Call timeout in seconds | `300` | ❌ |
| `LOG_LEVEL` | Logging level | `INFO` | ❌ |

### Environment-Specific Configs

- **Development**: 5 concurrent calls, 3 min timeout, DEBUG logging
- **Staging**: 8 concurrent calls, 5 min timeout, INFO logging  
- **Production**: 20 concurrent calls, 10 min timeout, WARNING logging

## 🎯 Usage

### Basic Integration

```python
from api_interface import VoiceServiceAPI

# Initialize the service
voice_api = VoiceServiceAPI()

# Create a venue inquiry
result = voice_api.create_venue_inquiry(
    venue_name="Grand Plaza Hotel",
    venue_phone="+13107094109",
    client_name="TechCorp Inc.",
    event_date="2024-04-15",
    guest_count=75,
    budget_range="$5000-8000",
    event_type="Corporate Conference",
    dietary_restrictions=["vegetarian", "gluten-free"],
    special_requests="Need AV equipment and parking"
)

if result["success"]:
    inquiry_id = result["inquiry_id"]
    call_id = result["call_id"]
    print(f"Inquiry created: {inquiry_id}")
else:
    print(f"Error: {result['error']}")
```

### Direct Function Calls

```python
from api_interface import create_venue_inquiry_api

result = create_venue_inquiry_api(
    api_key="your_api_key",
    venue_name="Downtown Convention Center",
    venue_phone="+13107094109",
    client_name="EventPro Solutions",
    event_date="2024-05-20",
    guest_count=150,
    budget_range="$10000-15000"
)
```

### Monitoring and Completion

```python
# Check status
status = voice_api.get_inquiry_status(inquiry_id)

# Wait for completion (async in production)
completed = voice_api.wait_for_inquiry_completion(inquiry_id)

# Get all inquiries
all_inquiries = voice_api.get_all_inquiries()
```

## 📊 Data Models

### VenueInquiryRequest

```python
@dataclass
class VenueInquiryRequest:
    venue_name: str              # Venue name
    venue_phone: str             # Phone number (E.164 format)
    client_name: str             # Client name
    event_date: str              # Event date (YYYY-MM-DD)
    guest_count: int             # Number of guests
    budget_range: str            # Budget range (e.g., "$2000-4000")
    event_type: str              # Type of event
    dietary_restrictions: List[str]  # Dietary requirements
    special_requests: str        # Special requirements
    required_services: List[str] # Required services (AV, parking, etc.)
    max_duration: int            # Max call duration in seconds
```

### VenueInquiryResponse

```python
@dataclass
class VenueInquiryResponse:
    inquiry_id: str              # Unique inquiry identifier
    call_id: str                 # Bland AI call identifier
    status: str                  # Current status
    venue_name: str              # Venue name
    client_name: str             # Client name
    call_summary: str            # AI-generated call summary
    transcript: str              # Full call transcript
    extracted_quotes: List[Dict] # Pricing information found
    dietary_info: Dict           # Dietary accommodation details
    next_steps: List[str]        # Action items from call
    call_metadata: Dict          # Call duration, cost, timing
    error_message: str           # Error details if failed
    created_at: str              # Creation timestamp
    completed_at: str            # Completion timestamp
```

## 🔄 Backend Integration Patterns

### 1. Async Processing

```python
import asyncio
from api_interface import VoiceServiceAPI

async def process_venue_inquiries(venues):
    voice_api = VoiceServiceAPI()
    inquiry_ids = []
    
    # Create all inquiries
    for venue in venues:
        result = voice_api.create_venue_inquiry(**venue)
        if result["success"]:
            inquiry_ids.append(result["inquiry_id"])
    
    # Monitor completion asynchronously
    tasks = [
        voice_api.wait_for_inquiry_completion(inquiry_id)
        for inquiry_id in inquiry_ids
    ]
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return results
```

### 2. Webhook Integration

```python
from flask import Flask, request
from api_interface import VoiceServiceAPI

app = Flask(__name__)
voice_api = VoiceServiceAPI()

@app.route('/venue-inquiry', methods=['POST'])
def create_inquiry():
    data = request.json
    
    result = voice_api.create_venue_inquiry(
        venue_name=data['venue_name'],
        venue_phone=data['venue_phone'],
        client_name=data['client_name'],
        event_date=data['event_date'],
        guest_count=data['guest_count'],
        budget_range=data['budget_range']
    )
    
    return result

@app.route('/inquiry-status/<inquiry_id>')
def get_status(inquiry_id):
    return voice_api.get_inquiry_status(inquiry_id)
```

### 3. Database Integration

```python
import sqlite3
from api_interface import VoiceServiceAPI

class VenueInquiryDB:
    def __init__(self):
        self.voice_api = VoiceServiceAPI()
        self.db = sqlite3.connect('inquiries.db')
        self.setup_tables()
    
    def create_inquiry(self, venue_data):
        # Create voice inquiry
        result = self.voice_api.create_venue_inquiry(**venue_data)
        
        if result["success"]:
            # Store in database
            cursor = self.db.cursor()
            cursor.execute("""
                INSERT INTO inquiries (inquiry_id, call_id, venue_name, status)
                VALUES (?, ?, ?, ?)
            """, (result["inquiry_id"], result["call_id"], 
                  venue_data["venue_name"], result["status"]))
            self.db.commit()
        
        return result
    
    def update_completed_inquiry(self, inquiry_id):
        # Get completed inquiry
        result = self.voice_api.get_inquiry_status(inquiry_id)
        
        if result["success"] and result["status"] == "completed":
            # Update database
            cursor = self.db.cursor()
            cursor.execute("""
                UPDATE inquiries 
                SET status = ?, summary = ?, completed_at = ?
                WHERE inquiry_id = ?
            """, (result["status"], result["call_summary"], 
                  result["completed_at"], inquiry_id))
            self.db.commit()
```

## 🚨 Error Handling

### Response Format

All API methods return a consistent response format:

```python
{
    "success": True/False,
    "inquiry_id": "uuid-string",      # Only on success
    "call_id": "bland-ai-call-id",    # Only on success
    "status": "status-string",         # Only on success
    "error": "error-message",          # Only on failure
    "message": "human-readable-msg"    # Always present
}
```

### Common Errors

- **API Key Invalid**: Check `BLAND_AI_API_KEY` environment variable
- **Phone Number Invalid**: Ensure E.164 format (+1234567890)
- **Call Timeout**: Increase `CALL_TIMEOUT_SECONDS` if needed
- **Rate Limiting**: Reduce `MAX_CONCURRENT_CALLS` if hitting limits

## 📈 Monitoring and Maintenance

### Health Checks

```python
def health_check():
    voice_api = VoiceServiceAPI()
    
    # Check service status
    all_inquiries = voice_api.get_all_inquiries()
    
    return {
        "status": "healthy",
        "active_inquiries": all_inquiries["total_active"],
        "completed_inquiries": all_inquiries["total_completed"],
        "max_concurrent": voice_api.service.max_concurrent_calls
    }
```

### Cleanup Operations

```python
# Clean up old inquiries (run periodically)
cleaned = voice_api.cleanup_old_inquiries(max_age_hours=24)

# Stop all active inquiries (emergency shutdown)
stopped = voice_api.stop_all_inquiries()
```

### Logging

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Service logs all operations
logger = logging.getLogger(__name__)
logger.info("Voice service initialized")
```

## 🔒 Security Considerations

1. **API Key Management**: Store API keys in environment variables, never in code
2. **Input Validation**: Validate all input parameters before processing
3. **Rate Limiting**: Monitor call volumes and implement rate limiting if needed
4. **Error Logging**: Avoid logging sensitive information in error messages
5. **Access Control**: Implement proper authentication for your backend endpoints

## 🚀 Deployment

### Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
ENV ENVIRONMENT=production

CMD ["python", "your_backend_app.py"]
```

### Environment Setup

```bash
# Production
export ENVIRONMENT=production
export BLAND_AI_API_KEY="your_production_key"
export MAX_CONCURRENT_CALLS="20"
export CALL_TIMEOUT_SECONDS="600"
export LOG_LEVEL="WARNING"

# Development
export ENVIRONMENT=development
export BLAND_AI_API_KEY="your_dev_key"
export MAX_CONCURRENT_CALLS="5"
export CALL_TIMEOUT_SECONDS="180"
export LOG_LEVEL="DEBUG"
```

## 📚 Examples

See `production_example.py` for comprehensive usage examples including:
- Basic integration
- Direct function calls
- Batch processing
- Error handling
- Async patterns

## 🤝 Support

For issues or questions:
1. Check the [Bland AI API documentation](https://docs.bland.ai/)
2. Review error logs and response messages
3. Verify configuration and environment variables
4. Test with minimal parameters first

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 