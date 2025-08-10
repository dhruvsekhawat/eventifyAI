#!/usr/bin/env python3
"""
Production Example: How to use the Voice Service in a backend
"""

import os
import time
from typing import Dict, Any

from api_interface import VoiceServiceAPI, create_venue_inquiry_api


def example_backend_integration():
    """
    Example of how a backend would integrate with the voice service
    """
    
    # Set your API key (in production, this would come from environment variables)
    os.environ["BLAND_AI_API_KEY"] = "your_actual_api_key_here"
    
    # Initialize the API interface
    voice_api = VoiceServiceAPI()
    
    print("🚀 Voice Service API Initialized")
    print("=" * 50)
    
    # Example 1: Create a venue inquiry
    print("\n📞 Creating Venue Inquiry...")
    
    inquiry_result = voice_api.create_venue_inquiry(
        venue_name="Grand Plaza Hotel",
        venue_phone="+13107094109",
        client_name="TechCorp Inc.",
        event_date="2024-04-15",
        guest_count=75,
        budget_range="$5000-8000",
        event_type="Corporate Conference",
        dietary_restrictions=["vegetarian", "gluten-free"],
        special_requests="Need AV equipment, parking, and catering options",
        required_services=["AV", "parking", "catering"]
    )
    
    if inquiry_result["success"]:
        inquiry_id = inquiry_result["inquiry_id"]
        call_id = inquiry_result["call_id"]
        
        print(f"✅ Inquiry created successfully!")
        print(f"   Inquiry ID: {inquiry_id}")
        print(f"   Call ID: {call_id}")
        print(f"   Status: {inquiry_result['status']}")
        
        # Example 2: Check inquiry status
        print(f"\n📊 Checking status for inquiry {inquiry_id}...")
        
        status_result = voice_api.get_inquiry_status(inquiry_id)
        if status_result["success"]:
            print(f"   Current Status: {status_result['status']}")
            print(f"   Venue: {status_result['venue_name']}")
            print(f"   Client: {status_result['client_name']}")
        
        # Example 3: Wait for completion (in production, this would be async)
        print(f"\n⏳ Waiting for inquiry completion...")
        print("   (In production, this would be handled asynchronously)")
        
        # For demo purposes, let's wait a bit
        time.sleep(2)
        
        # Check final status
        final_status = voice_api.get_inquiry_status(inquiry_id)
        if final_status["success"]:
            print(f"   Final Status: {final_status['status']}")
            
            if final_status.get("call_summary"):
                print(f"   Call Summary: {final_status['call_summary'][:100]}...")
            
            if final_status.get("extracted_quotes"):
                quotes = final_status["extracted_quotes"]
                print(f"   Quotes Found: {len(quotes)}")
                for quote in quotes:
                    print(f"     - {quote.get('price', 'N/A')}: {quote.get('description', 'N/A')}")
        
        # Example 4: Get all inquiries
        print(f"\n📋 Getting all inquiries...")
        all_inquiries = voice_api.get_all_inquiries()
        if all_inquiries["success"]:
            print(f"   Active: {all_inquiries['total_active']}")
            print(f"   Completed: {all_inquiries['total_completed']}")
        
    else:
        print(f"❌ Failed to create inquiry: {inquiry_result['error']}")


def example_direct_function_calls():
    """
    Example using the convenience functions directly
    """
    
    print("\n" + "=" * 50)
    print("🔧 Direct Function Calls Example")
    print("=" * 50)
    
    # Set API key
    api_key = "your_actual_api_key_here"
    
    # Create inquiry using convenience function
    result = create_venue_inquiry_api(
        api_key=api_key,
        venue_name="Downtown Convention Center",
        venue_phone="+13107094109",
        client_name="EventPro Solutions",
        event_date="2024-05-20",
        guest_count=150,
        budget_range="$10000-15000",
        event_type="Trade Show",
        special_requests="Large exhibition space, loading dock access"
    )
    
    if result["success"]:
        print(f"✅ Direct inquiry created: {result['inquiry_id']}")
        print(f"   Call ID: {result['call_id']}")
        print(f"   Status: {result['status']}")
    else:
        print(f"❌ Direct inquiry failed: {result['error']}")


def example_batch_processing():
    """
    Example of processing multiple venue inquiries
    """
    
    print("\n" + "=" * 50)
    print("📦 Batch Processing Example")
    print("=" * 50)
    
    # Initialize API
    voice_api = VoiceServiceAPI()
    
    # List of venues to contact
    venues = [
        {
            "name": "Riverside Gardens",
            "phone": "+13107094109",
            "client": "Green Events Co.",
            "date": "2024-06-10",
            "guests": 50,
            "budget": "$3000-5000"
        },
        {
            "name": "Skyline Tower",
            "phone": "+13107094109",
            "client": "Urban Productions",
            "date": "2024-06-15",
            "guests": 100,
            "budget": "$8000-12000"
        }
    ]
    
    inquiry_ids = []
    
    # Create inquiries for all venues
    for venue in venues:
        result = voice_api.create_venue_inquiry(
            venue_name=venue["name"],
            venue_phone=venue["phone"],
            client_name=venue["client"],
            event_date=venue["date"],
            guest_count=venue["guests"],
            budget_range=venue["budget"]
        )
        
        if result["success"]:
            inquiry_ids.append(result["inquiry_id"])
            print(f"✅ Created inquiry for {venue['name']}: {result['inquiry_id']}")
        else:
            print(f"❌ Failed to create inquiry for {venue['name']}: {result['error']}")
    
    print(f"\n📊 Created {len(inquiry_ids)} inquiries")
    
    # In production, you would:
    # 1. Store these inquiry IDs in your database
    # 2. Set up webhooks or polling to monitor completion
    # 3. Process results asynchronously
    # 4. Update your application state when calls complete


def example_error_handling():
    """
    Example of proper error handling
    """
    
    print("\n" + "=" * 50)
    print("⚠️  Error Handling Example")
    print("=" * 50)
    
    # Initialize API with invalid key
    try:
        voice_api = VoiceServiceAPI("invalid_key")
        
        result = voice_api.create_venue_inquiry(
            venue_name="Test Venue",
            venue_phone="+13107094109",
            client_name="Test Client",
            event_date="2024-01-01",
            guest_count=10,
            budget_range="$1000"
        )
        
        if not result["success"]:
            print(f"❌ Expected error: {result['error']}")
            print(f"   Message: {result['message']}")
        
    except Exception as e:
        print(f"❌ Exception caught: {e}")
    
    # Test with invalid phone number
    try:
        voice_api = VoiceServiceAPI()
        
        result = voice_api.create_venue_inquiry(
            venue_name="Test Venue",
            venue_phone="invalid_phone",
            client_name="Test Client",
            event_date="2024-01-01",
            guest_count=10,
            budget_range="$1000"
        )
        
        if not result["success"]:
            print(f"❌ Phone validation error: {result['error']}")
        
    except Exception as e:
        print(f"❌ Exception caught: {e}")


def main():
    """Main function demonstrating production usage"""
    
    print("🏢 Bland AI Voice Service - Production Integration Examples")
    print("=" * 70)
    
    # Note: These examples require a valid API key
    print("⚠️  Note: Set your actual Bland AI API key to run these examples")
    print()
    
    # Run examples
    example_backend_integration()
    example_direct_function_calls()
    example_batch_processing()
    example_error_handling()
    
    print("\n" + "=" * 70)
    print("🎯 Production Integration Complete!")
    print("💡 Key takeaways:")
    print("   • Use VoiceServiceAPI class for clean integration")
    print("   • Handle errors gracefully with success/error responses")
    print("   • Store inquiry IDs for tracking")
    print("   • Process results asynchronously in production")
    print("   • Use environment variables for configuration")
    print("=" * 70)


if __name__ == "__main__":
    main() 