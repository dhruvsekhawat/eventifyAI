import requests
import json
import time
from typing import Dict, Optional, List
from dataclasses import dataclass
from enum import Enum


class CallStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    NO_ANSWER = "no_answer"
    BUSY = "busy"


@dataclass
class CateringRequirements:
    event_type: str
    date: str
    guest_count: int
    dietary_restrictions: List[str]
    cuisine_preferences: List[str]
    budget_range: str
    special_requests: Optional[str] = None


@dataclass
class CallResult:
    call_id: str
    status: str
    transcript: Optional[str] = None
    summary: Optional[str] = None
    quotes: Optional[List[Dict]] = None
    dietary_info: Optional[Dict] = None
    next_steps: Optional[List[str]] = None


class BlandVoiceAgent:
    """
    Modular voice agent for making calls using Bland AI's pathway system.
    Designed for event management tasks like restaurant catering inquiries.
    """
    
    def __init__(self, api_key: str, base_url: str = "https://api.bland.ai/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "authorization": api_key
        }
    
    def make_call_with_pathway(self, phone_number: str, pathway_id: str) -> Dict:
        """
        Initiate a call using Bland AI's pathway system.
        
        Args:
            phone_number: Target phone number (E.164 format recommended)
            pathway_id: ID of the conversational pathway to follow
            
        Returns:
            API response with call_id and status
        """
        endpoint = f"{self.base_url}/calls"
        payload = {
            "phone_number": phone_number,
            "pathway_id": pathway_id
        }
        
        try:
            response = requests.post(endpoint, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to initiate call with pathway: {str(e)}")
    
    def make_call_with_task(self, phone_number: str, task: str) -> Dict:
        """
        Initiate a call using Bland AI's task system.
        
        Args:
            phone_number: Target phone number (E.164 format recommended)
            task: Text prompt describing what the AI should do
            
        Returns:
            API response with call_id and status
        """
        endpoint = f"{self.base_url}/calls"
        payload = {
            "phone_number": phone_number,
            "task": task
        }
        
        try:
            response = requests.post(endpoint, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to initiate call with task: {str(e)}")
    
    def make_call(self, phone_number: str, pathway_id: str = None, task: str = None) -> Dict:
        """
        Initiate a call using either pathway or task (pathway takes precedence).
        
        Args:
            phone_number: Target phone number (E.164 format recommended)
            pathway_id: ID of the conversational pathway to follow (optional)
            task: Text prompt describing what the AI should do (optional)
            
        Returns:
            API response with call_id and status
        """
        if pathway_id:
            return self.make_call_with_pathway(phone_number, pathway_id)
        elif task:
            return self.make_call_with_task(phone_number, task)
        else:
            raise ValueError("Either pathway_id or task must be provided")
    
    def get_call_details(self, call_id: str) -> Dict:
        """
        Retrieve details about a specific call.
        
        Args:
            call_id: Unique identifier for the call
            
        Returns:
            Call details including status, transcript, etc.
        """
        endpoint = f"{self.base_url}/calls/{call_id}"
        
        try:
            response = requests.get(endpoint, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to get call details: {str(e)}")
    
    def stop_call(self, call_id: str) -> Dict:
        """
        Stop an active call.
        
        Args:
            call_id: Unique identifier for the call
            
        Returns:
            API response confirming the call was stopped
        """
        endpoint = f"{self.base_url}/calls/{call_id}/stop"
        
        try:
            response = requests.post(endpoint, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to stop call: {str(e)}")
    
    def wait_for_call_completion(self, call_id: str, timeout: int = 300, check_interval: int = 10) -> CallResult:
        """
        Wait for a call to complete and return the results.
        
        Args:
            call_id: Unique identifier for the call
            timeout: Maximum time to wait in seconds (default: 5 minutes)
            check_interval: How often to check call status in seconds
            
        Returns:
            CallResult object with call outcomes
        """
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                call_details = self.get_call_details(call_id)
                status = call_details.get("status", "unknown")
                
                print(f"Call {call_id} status: {status}")
                
                if status in ["completed", "failed", "no_answer", "busy"]:
                    print(f"Call {call_id} completed with status: {status}")
                    print(f"Call details keys: {list(call_details.keys())}")
                    if "concatenated_transcript" in call_details:
                        transcript_length = len(call_details.get("concatenated_transcript", ""))
                        print(f"Transcript length: {transcript_length} characters")
                    if "summary" in call_details:
                        summary_length = len(call_details.get("summary", ""))
                        print(f"Summary length: {summary_length} characters")
                    
                    return self._parse_call_result(call_details)
                
                time.sleep(check_interval)
                
            except Exception as e:
                print(f"Error checking call status: {e}")
                time.sleep(check_interval)
        
        raise TimeoutError(f"Call {call_id} did not complete within {timeout} seconds")
    
    def _parse_call_result(self, call_details: Dict) -> CallResult:
        """
        Parse call details into a structured CallResult object.
        
        Args:
            call_details: Raw call details from Bland AI API
            
        Returns:
            Structured CallResult object
        """
        # Extract basic information - API returns 'call_id' not 'id'
        call_id = call_details.get("call_id", call_details.get("id", ""))
        status = call_details.get("status", "")
        
        # Get transcript - API returns 'concatenated_transcript' for the full text
        transcript = call_details.get("concatenated_transcript", "")
        if not transcript:
            # Fallback to 'transcript' field if concatenated_transcript is not available
            transcript = call_details.get("transcript", "")
        
        # Get summary - API returns 'summary' field
        summary = call_details.get("summary", "")
        
        # Parse quotes if available (this would depend on your pathway setup)
        quotes = self._extract_quotes(transcript, summary)
        
        # Parse dietary information
        dietary_info = self._extract_dietary_info(transcript, summary)
        
        # Extract next steps
        next_steps = self._extract_next_steps(transcript, summary)
        
        # Debug logging
        print(f"Parsed call result:")
        print(f"  - Call ID: {call_id}")
        print(f"  - Status: {status}")
        print(f"  - Transcript length: {len(transcript) if transcript else 0}")
        print(f"  - Summary length: {len(summary) if summary else 0}")
        print(f"  - Quotes: {quotes}")
        print(f"  - Dietary info: {dietary_info}")
        print(f"  - Next steps: {next_steps}")
        
        return CallResult(
            call_id=call_id,
            status=status,
            transcript=transcript,
            summary=summary,
            quotes=quotes,
            dietary_info=dietary_info,
            next_steps=next_steps
        )
    
    def _extract_quotes(self, transcript: str, summary: str) -> Optional[List[Dict]]:
        """Extract pricing quotes from call transcript/summary."""
        # This is a placeholder - you'd implement based on your pathway's output format
        quotes = []
        
        # Look for price patterns in transcript
        import re
        price_patterns = re.findall(r'\$[\d,]+(?:\.\d{2})?', transcript)
        
        for price in price_patterns:
            quotes.append({
                "price": price,
                "description": "Quote from call",
                "source": "transcript"
            })
        
        return quotes if quotes else None
    
    def _extract_dietary_info(self, transcript: str, summary: str) -> Optional[Dict]:
        """Extract dietary restriction information from call transcript/summary."""
        dietary_info = {}
        
        # Common dietary restrictions to look for
        restrictions = [
            "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free",
            "halal", "kosher", "pescatarian", "keto", "paleo"
        ]
        
        for restriction in restrictions:
            if restriction.lower() in transcript.lower():
                dietary_info[restriction] = True
        
        return dietary_info if dietary_info else None
    
    def _extract_next_steps(self, transcript: str, summary: str) -> Optional[List[str]]:
        """Extract next steps or action items from call transcript/summary."""
        next_steps = []
        
        # Look for action-oriented phrases
        action_phrases = [
            "will call back", "send email", "follow up", "get back to you",
            "check availability", "confirm details", "provide quote"
        ]
        
        for phrase in action_phrases:
            if phrase.lower() in transcript.lower():
                next_steps.append(phrase)
        
        return next_steps if next_steps else None


class EventManagerAgent:
    """
    High-level event manager that coordinates multiple voice agent calls
    for restaurant catering inquiries.
    """
    
    def __init__(self, api_key: str, pathway_id: str = None, task: str = None):
        self.voice_agent = BlandVoiceAgent(api_key)
        self.pathway_id = pathway_id
        self.task = task
        self.active_calls = {}
        self.completed_calls = {}
        
        if not pathway_id and not task:
            raise ValueError("Either pathway_id or task must be provided")
    
    def initiate_catering_inquiry(self, restaurant_phone: str, requirements: CateringRequirements) -> str:
        """
        Start a catering inquiry call with a restaurant.
        
        Args:
            restaurant_phone: Restaurant's phone number
            requirements: Catering requirements for the event
            
        Returns:
            Call ID for tracking
        """
        try:
            # Make the call using either pathway or task
            if self.pathway_id:
                call_response = self.voice_agent.make_call_with_pathway(restaurant_phone, self.pathway_id)
            else:
                # Use the task provided in constructor, or generate from requirements if none provided
                if self.task:
                    task = self.task
                else:
                    task = self._generate_task_from_requirements(requirements)
                call_response = self.voice_agent.make_call_with_task(restaurant_phone, task)
            
            if call_response.get("status") == "success":
                call_id = call_response.get("call_id")
                self.active_calls[call_id] = {
                    "restaurant_phone": restaurant_phone,
                    "requirements": requirements,
                    "start_time": time.time()
                }
                print(f"Call initiated successfully. Call ID: {call_id}")
                return call_id
            else:
                raise Exception(f"Failed to initiate call: {call_response}")
                
        except Exception as e:
            print(f"Error initiating catering inquiry: {e}")
            raise
    
    def _generate_task_from_requirements(self, requirements: CateringRequirements) -> str:
        """
        Generate a task prompt from catering requirements.
        
        Args:
            requirements: Catering requirements for the event
            
        Returns:
            Formatted task string for Bland AI
        """
        task = f"""You are an event manager calling restaurants for catering quotes. Your goal is to get pricing, check availability, and understand their services.

Event Details:
- Event Type: {requirements.event_type}
- Date: {requirements.date}
- Guest Count: {requirements.guest_count}
- Dietary Restrictions: {', '.join(requirements.dietary_restrictions)}
- Cuisine Preferences: {', '.join(requirements.cuisine_preferences)}
- Budget Range: {requirements.budget_range}
{f"- Special Requests: {requirements.special_requests}" if requirements.special_requests else ""}

Key information to gather:
- Pricing quotes for {requirements.guest_count} people
- Dietary restriction accommodations
- Delivery and setup services
- Available dates around {requirements.date}
- Payment terms and deposits

Be professional, ask specific questions, and take notes on their responses. If they can't accommodate the date or requirements, politely thank them and end the call."""
        
        return task
    
    def wait_for_inquiry_completion(self, call_id: str) -> CallResult:
        """
        Wait for a catering inquiry call to complete.
        
        Args:
            call_id: ID of the call to monitor
            
        Returns:
            CallResult with inquiry outcomes
        """
        try:
            result = self.voice_agent.wait_for_call_completion(call_id)
            
            # Move from active to completed calls
            if call_id in self.active_calls:
                self.completed_calls[call_id] = {
                    **self.active_calls[call_id],
                    "result": result,
                    "completion_time": time.time()
                }
                del self.active_calls[call_id]
            
            return result
            
        except Exception as e:
            print(f"Error waiting for call completion: {e}")
            raise
    
    def get_inquiry_summary(self, call_id: str) -> Dict:
        """
        Get a summary of a completed catering inquiry.
        
        Args:
            call_id: ID of the completed call
            
        Returns:
            Summary of the inquiry including requirements and results
        """
        if call_id not in self.completed_calls:
            raise ValueError(f"Call {call_id} not found in completed calls")
        
        call_data = self.completed_calls[call_id]
        requirements = call_data["requirements"]
        result = call_data["result"]
        
        return {
            "call_id": call_id,
            "restaurant_phone": call_data["restaurant_phone"],
            "event_details": {
                "type": requirements.event_type,
                "date": requirements.date,
                "guest_count": requirements.guest_count,
                "dietary_restrictions": requirements.dietary_restrictions,
                "cuisine_preferences": requirements.cuisine_preferences,
                "budget_range": requirements.budget_range
            },
            "call_outcome": {
                "status": result.status,
                "quotes": result.quotes,
                "dietary_info": result.dietary_info,
                "next_steps": result.next_steps
            },
            "duration": call_data["completion_time"] - call_data["start_time"]
        }
    
    def stop_all_calls(self):
        """Stop all active calls."""
        for call_id in list(self.active_calls.keys()):
            try:
                self.voice_agent.stop_call(call_id)
                print(f"Stopped call {call_id}")
            except Exception as e:
                print(f"Error stopping call {call_id}: {e}")


# Example usage and testing
def main():
    """
    Example usage of the voice agent system.
    Replace with your actual API key and pathway ID.
    """
    # Configuration - replace with your actual values
    API_KEY = "your_bland_ai_api_key_here"
    PATHWAY_ID = "your_pathway_id_here"
    
    # Create the event manager agent
    event_manager = EventManagerAgent(API_KEY, PATHWAY_ID)
    
    # Example catering requirements
    requirements = CateringRequirements(
        event_type="Corporate Lunch",
        date="2024-02-15",
        guest_count=50,
        dietary_restrictions=["vegetarian", "gluten-free"],
        cuisine_preferences=["Italian", "Mediterranean"],
        budget_range="$15-25 per person",
        special_requests="Need delivery to office building"
    )
    
    # Example restaurant phone number (replace with actual number)
    restaurant_phone = "+15551234567"
    
    try:
        # Initiate the call
        call_id = event_manager.initiate_catering_inquiry(restaurant_phone, requirements)
        
        # Wait for completion
        result = event_manager.wait_for_inquiry_completion(call_id)
        
        # Get summary
        summary = event_manager.get_inquiry_summary(call_id)
        
        print("Catering inquiry completed!")
        print(f"Call ID: {summary['call_id']}")
        print(f"Status: {summary['call_outcome']['status']}")
        print(f"Quotes received: {summary['call_outcome']['quotes']}")
        print(f"Dietary info: {summary['call_outcome']['dietary_info']}")
        print(f"Next steps: {summary['call_outcome']['next_steps']}")
        
    except Exception as e:
        print(f"Error in catering inquiry: {e}")
    
    finally:
        # Clean up any active calls
        event_manager.stop_all_calls()


if __name__ == "__main__":
    main() 