#!/usr/bin/env python3
"""
Test script to simulate backend integration with the voice agent
This shows how a backend would call the voice service API
"""

from api_interface import VoiceServiceAPI
import time

def test_backend_integration():
    """Test the voice agent as if called from a backend"""
    
    print("🚀 Testing Backend Integration with Voice Agent")
    print("=" * 60)
    
    # Initialize the voice service API (like a backend would)
    try:
        from config import API_KEY
        voice_api = VoiceServiceAPI(api_key=API_KEY)
        print("✅ Voice Service API initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize Voice Service API: {e}")
        return
    
    # Test venue inquiry (like a backend endpoint would receive)
    print("\n📞 Creating venue inquiry via backend API...")
    
    try:
        result = voice_api.create_venue_inquiry(
            venue_name="Test Restaurant",
            venue_phone="+13107094109",  # Your test number (E.164 format)
            client_name="Clara Johnson",
            event_date="2024-03-15",
            guest_count=150,
            budget_range="$4000-$6000",
            event_type="Corporate Event",
            dietary_restrictions=["vegetarian", "gluten-free"],
            preferred_cuisine="American/Italian"
        )
        
        if result.get("success"):
            inquiry_id = result.get("data", {}).get("inquiry_id")
            call_id = result.get("data", {}).get("call_id")
            status = result.get("data", {}).get("status")
            
            print(f"✅ Inquiry created successfully!")
            print(f"   Inquiry ID: {inquiry_id}")
            print(f"   Call ID: {call_id}")
            print(f"   Status: {status}")
            
            # Simulate backend waiting for completion
            print(f"\n⏳ Backend waiting for call completion...")
            print(f"   (This simulates a backend endpoint waiting)")
            print(f"   Note: The call needs to actually reach your phone and complete")
            
            # Check status periodically (like a backend would)
            max_checks = 30  # Increase max checks for longer wait
            check_count = 0
            wait_time = 15  # Wait 15 seconds between checks
            
            while check_count < max_checks:
                check_count += 1
                print(f"\n🔍 Status check #{check_count} (waiting {wait_time}s between checks)...")
                
                try:
                    # Check status via the API interface
                    status_result = voice_api.get_inquiry_status(inquiry_id)
                    if status_result.get("success"):
                        current_status = status_result.get("status")
                        print(f"   Current Status: {current_status}")
                        
                        # If completed, get full details
                        if current_status == "completed":
                            print(f"\n🎉 Call completed! Getting full details...")
                            
                            print(f"\n📋 Call Results:")
                            print(f"   Summary: {status_result.get('call_summary', 'N/A')}")
                            print(f"   Transcript Length: {len(status_result.get('transcript', '') or '')} characters")
                            print(f"   Extracted Quotes: {status_result.get('extracted_quotes', 'N/A')}")
                            print(f"   Dietary Info: {status_result.get('dietary_info', 'N/A')}")
                            print(f"   Next Steps: {status_result.get('next_steps', 'N/A')}")
                            
                            # This is what the backend would return to the client
                            print(f"\n📤 Backend Response to Client:")
                            print(f"   Status: {current_status}")
                            print(f"   Venue: Test Restaurant")
                            if status_result.get('call_summary'):
                                print(f"   Call Summary: {status_result.get('call_summary')[:100]}...")
                            else:
                                print(f"   Call Summary: Not available yet")
                            
                            break
                        
                        elif current_status in ["failed", "no_answer", "busy", "timeout"]:
                            print(f"   ❌ Call ended with status: {current_status}")
                            break
                        
                        else:
                            print(f"   ⏳ Still in progress... waiting {wait_time} seconds")
                            print(f"   💡 The call should be ringing your phone now...")
                            time.sleep(wait_time)
                    else:
                        print(f"   ❌ Failed to check status: {status_result.get('error')}")
                        print(f"   💡 This might be normal if the call is still being set up")
                        time.sleep(wait_time)
                        
                except Exception as e:
                    print(f"   ❌ Failed to check call status: {e}")
                    print(f"   💡 This might be normal if the call is still being set up")
                    time.sleep(wait_time)
            
            if check_count >= max_checks:
                print(f"\n⏰ Reached maximum status checks ({max_checks}). Call may still be in progress.")
                print(f"   💡 Backend would typically implement a webhook or polling mechanism.")
                print(f"   💡 You can manually check the status later using the inquiry ID: {inquiry_id}")
            
        else:
            print(f"❌ Failed to create inquiry: {result.get('error')}")
            
    except Exception as e:
        print(f"❌ Error during backend integration test: {e}")

def show_current_config():
    """Display current configuration"""
    
    print("\n⚙️ Current Configuration")
    print("=" * 40)
    
    try:
        from config import API_KEY, VOICE_SETTINGS, CUSTOM_TASK
        
        print(f"API Key: {API_KEY[:20]}...")
        print(f"Voice ID: {VOICE_SETTINGS['voice_id']}")
        print(f"Voice Stability: {VOICE_SETTINGS['stability']}")
        print(f"Voice Style: {VOICE_SETTINGS['style']}")
        print(f"Task Type: {'Custom Task' if CUSTOM_TASK else 'Pathway-based'}")
        
        if CUSTOM_TASK:
            print(f"Custom Task Preview: {CUSTOM_TASK[:100]}...")
        
    except Exception as e:
        print(f"❌ Could not load config: {e}")

def main():
    """Main test function"""
    
    print("🔧 Backend Integration Test - Voice Agent")
    print("=" * 60)
    
    # Show current configuration
    show_current_config()
    
    # Test the backend integration
    test_backend_integration()
    
    print("\n✨ Backend integration test completed!")
    print("\n💡 This simulates how a real backend would:")
    print("   1. Initialize the VoiceServiceAPI")
    print("   2. Create venue inquiries")
    print("   3. Monitor call status")
    print("   4. Retrieve completed call results")
    print("   5. Return structured data to clients")

if __name__ == "__main__":
    main() 