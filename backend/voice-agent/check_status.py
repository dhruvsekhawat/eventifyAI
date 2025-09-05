#!/usr/bin/env python3
"""
Check Inquiry Status - Called from Node.js to get full results for a completed call
"""

import sys
import json
import traceback
from typing import Dict, Any

# Import the voice service
try:
    from voice_service import VoiceService
    from production_config import get_config
    VOICE_SERVICE_AVAILABLE = True
except ImportError as e:
    print(f"Import error: {e}", file=sys.stderr)
    VOICE_SERVICE_AVAILABLE = False

def check_inquiry_status(inquiry_id: str) -> Dict[str, Any]:
    """
    Check the status of an inquiry and return full results if available
    
    Args:
        inquiry_id: The ID of the inquiry to check
        
    Returns:
        Dictionary with the inquiry status and results
    """
    
    # Check if voice service is available
    if not VOICE_SERVICE_AVAILABLE:
        return {
            "success": False,
            "error": "Voice service not available - import failed",
            "inquiry_id": inquiry_id
        }
    
    try:
        # Get configuration
        config = get_config()
        api_key = config.get_api_key()
        
        # Initialize voice service
        voice_service = VoiceService(api_key)
        
        print(f"🔍 Checking status for inquiry: {inquiry_id}", file=sys.stderr)
        
        # Get the current inquiry status
        inquiry_status = voice_service.get_inquiry_status(inquiry_id)
        
        if inquiry_status:
            print(f"✅ Inquiry status retrieved successfully", file=sys.stderr)
            print(f"📊 Status: {inquiry_status.status}", file=sys.stderr)
            
            # Check if we have call results
            if hasattr(inquiry_status, 'call_summary') and inquiry_status.call_summary:
                print(f"📝 Call Summary: {inquiry_status.call_summary}", file=sys.stderr)
                print(f"💰 Extracted Quotes: {inquiry_status.extracted_quotes}", file=sys.stderr)
                print(f"🥗 Dietary Info: {inquiry_status.dietary_info}", file=sys.stderr)
                print(f"📋 Next Steps: {inquiry_status.next_steps}", file=sys.stderr)
                
                return {
                    "success": True,
                    "inquiry_id": inquiry_id,
                    "call_id": getattr(inquiry_status, 'call_id', None),
                    "status": inquiry_status.status,
                    "venue_name": getattr(inquiry_status, 'venue_name', None),
                    "venue_phone": getattr(inquiry_status, 'venue_phone', None),
                    "call_summary": inquiry_status.call_summary,
                    "extracted_quotes": getattr(inquiry_status, 'extracted_quotes', None),
                    "dietary_info": getattr(inquiry_status, 'dietary_info', None),
                    "next_steps": getattr(inquiry_status, 'next_steps', None),
                    "message": "Inquiry status retrieved with full results"
                }
            else:
                print(f"⏳ Call still in progress or no results yet", file=sys.stderr)
                return {
                    "success": True,
                    "inquiry_id": inquiry_id,
                    "call_id": getattr(inquiry_status, 'call_id', None),
                    "status": inquiry_status.status,
                    "venue_name": getattr(inquiry_status, 'venue_name', None),
                    "venue_phone": getattr(inquiry_status, 'venue_phone', None),
                    "message": "Inquiry status retrieved but call still in progress"
                }
        else:
            print(f"❌ Could not retrieve inquiry status", file=sys.stderr)
            return {
                "success": False,
                "error": "Could not retrieve inquiry status",
                "inquiry_id": inquiry_id
            }
            
    except Exception as e:
        print(f"❌ Error checking inquiry status: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return {
            "success": False,
            "error": f"Error checking inquiry status: {str(e)}",
            "inquiry_id": inquiry_id
        }

def main():
    """Main function - called from Node.js"""
    try:
        # Check if data was passed as command line argument
        if len(sys.argv) < 2:
            print(json.dumps({
                "success": False,
                "error": "No inquiry ID provided"
            }))
            sys.exit(1)
        
        # Parse the JSON data from command line
        data_json = sys.argv[1]
        data = json.loads(data_json)
        
        # Extract inquiry ID
        inquiry_id = data.get('inquiry_id')
        if not inquiry_id:
            print(json.dumps({
                "success": False,
                "error": "inquiry_id is required"
            }))
            sys.exit(1)
        
        # Debug info to stderr only
        print(f"Processing inquiry status check for: {inquiry_id}", file=sys.stderr)
        
        # Check the inquiry status
        result = check_inquiry_status(inquiry_id)
        
        # Ensure we only output clean JSON to stdout (Node.js will capture this)
        # All debug/logging should go to stderr
        json_output = json.dumps(result, ensure_ascii=False)
        
        # Final safety check - ensure stdout only contains our JSON
        print(json_output)
        
        # Exit with success code
        sys.exit(0)
        
    except Exception as e:
        # Output error as JSON
        error_result = {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
