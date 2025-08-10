#!/usr/bin/env python3
"""
Voice Agent Runner - Called from Node.js backend
Processes venue data and initiates voice calls
"""

import sys
import json
import traceback
from typing import Dict, Any

# Import the voice service
try:
    from voice_service import VoiceService
    from config import API_KEY
    VOICE_SERVICE_AVAILABLE = True
except ImportError as e:
    print(f"Import error: {e}", file=sys.stderr)
    VOICE_SERVICE_AVAILABLE = False


def run_voice_agent(venue_data: Dict[str, Any], client_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run the voice agent with the provided data
    
    Args:
        venue_data: Dictionary with venue_name and venue_phone
        client_info: Dictionary with client details
        
    Returns:
        Dictionary with the result of the voice agent call
    """
    
    # Check if voice service is available
    if not VOICE_SERVICE_AVAILABLE:
        # Fallback mode for testing
        print("⚠️  Voice service not available, running in test mode", file=sys.stderr)
        return {
            "success": True,
            "inquiry_id": "test-inquiry-123",
            "call_id": "test-call-456",
            "status": "test_mode",
            "venue_name": venue_data.get('venue_name'),
            "venue_phone": venue_data.get('venue_phone'),
            "message": "Running in test mode - voice service not available"
        }
    
    try:
        # Use the imported API key directly
        api_key = API_KEY
        
        # Initialize voice service
        voice_service = VoiceService(api_key)
        
        # Create venue inquiry request
        from voice_service import VenueInquiryRequest
        
        request = VenueInquiryRequest(
            venue_name=venue_data['venue_name'],
            venue_phone=venue_data['venue_phone'],
            client_name=client_info.get('client_name', 'Client'),
            event_date=client_info.get('event_date', '2024-03-15'),
            guest_count=client_info.get('guest_count', 2),
            budget_range=client_info.get('budget_range', '$50-$100'),
            event_type=client_info.get('event_type', 'Dinner Reservation'),
            dietary_restrictions=client_info.get('dietary_restrictions', []),
            special_requests=client_info.get('special_requests'),
            preferred_cuisine=client_info.get('preferred_cuisine'),
            start_time=client_info.get('start_time'),
            end_time=client_info.get('end_time'),
            required_services=client_info.get('required_services'),
        )
        
        # All debug output goes to stderr, not stdout
        print(f"🎯 Initiating voice call to {request.venue_name} at {request.venue_phone}", file=sys.stderr)
        
        # Initiate the venue inquiry
        response = voice_service.initiate_venue_inquiry(request)
        
        if response.status == 'pending':
            print(f"✅ Call initiated successfully! Inquiry ID: {response.inquiry_id}", file=sys.stderr)
            
            # Wait for a short time to see if call completes quickly
            print("⏳ Waiting for call completion (30 second timeout)...", file=sys.stderr)
            completion_result = voice_service.wait_for_inquiry_completion(
                response.inquiry_id, 
                timeout=300
            )
            
            if completion_result:
                print("🎉 Call completed!", file=sys.stderr)
                return {
                    "success": True,
                    "inquiry_id": response.inquiry_id,
                    "call_id": response.call_id,
                    "status": completion_result.status,
                    "venue_name": request.venue_name,
                    "venue_phone": request.venue_phone,
                    "call_summary": completion_result.call_summary,
                    "extracted_quotes": completion_result.extracted_quotes,
                    "dietary_info": completion_result.dietary_info,
                    "next_steps": completion_result.next_steps,
                    "transcript": completion_result.transcript,
                    "message": "Call completed successfully"
                }
            else:
                print("⏰ Call still in progress (timeout reached)", file=sys.stderr)
                return {
                    "success": True,
                    "inquiry_id": response.inquiry_id,
                    "call_id": response.call_id,
                    "status": "in_progress",
                    "venue_name": request.venue_name,
                    "venue_phone": request.venue_phone,
                    "message": "Call initiated and is in progress"
                }
        else:
            print(f"❌ Failed to initiate call: {response.status}", file=sys.stderr)
            return {
                "success": False,
                "error": f"Failed to initiate call: {response.status}",
                "venue_name": request.venue_name,
                "venue_phone": request.venue_phone
            }
            
    except Exception as e:
        print(f"❌ Error in voice agent: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return {
            "success": False,
            "error": str(e),
            "venue_name": venue_data.get('venue_name'),
            "venue_phone": venue_data.get('venue_phone')
        }


def main():
    """Main function - called from Node.js"""
    try:
        # Check if data was passed as command line argument
        if len(sys.argv) < 2:
            print(json.dumps({
                "success": False,
                "error": "No data provided"
            }))
            sys.exit(1)
        
        # Parse the JSON data from command line
        data_json = sys.argv[1]
        data = json.loads(data_json)
        
        # Debug info to stderr only
        print(f"Processing data for venue: {data.get('venue_name')}", file=sys.stderr)
        
                # Extract venue data and client info
        venue_data = {
            "venue_name": data.get("venue_name"),
            "venue_phone": "6193104433"
        }
        
        client_info = {
            "client_name": data.get("client_name"),
            "event_date": data.get("event_date"),
            "guest_count": data.get("guest_count"),
            "budget_range": data.get("budget_range"),
            "event_type": data.get("event_type"),
            "dietary_restrictions": data.get("dietary_restrictions"),
            "special_requests": data.get("special_requests"),
            "preferred_cuisine": data.get("preferred_cuisine"),
            "start_time": data.get("start_time"),
            "end_time": data.get("end_time"),
            "required_services": data.get("required_services"),
        }
        
        # Validate required fields
        if not venue_data["venue_name"] or not venue_data["venue_phone"]:
            print(json.dumps({
                "success": False,
                "error": "venue_name and venue_phone are required"
            }))
            sys.exit(1)
        
        # Run the voice agent
        result = run_voice_agent(venue_data, client_info)
        
        # Ensure we only output clean JSON to stdout (Node.js will capture this)
        # All debug/logging should go to stderr
        print(result)
        return result
        # Exit with success code
        sys.exit(0)
        
    except json.JSONDecodeError as e:
        print(json.dumps({
            "success": False,
            "error": f"Invalid JSON: {str(e)}"
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }))
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
