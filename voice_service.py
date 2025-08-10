#!/usr/bin/env python3
"""
Production-ready Bland AI Voice Service
Handles multiple concurrent voice agents for venue inquiries
"""

import asyncio
import time
import uuid
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
from enum import Enum
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

from voice_agent import BlandVoiceAgent, CallResult

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CallStatus(Enum):
    """Call status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    NO_ANSWER = "no_answer"
    BUSY = "busy"
    TIMEOUT = "timeout"


@dataclass
class VenueInquiryRequest:
    """Structured input for venue inquiry"""
    venue_name: str
    venue_phone: str
    client_name: str
    event_date: str
    guest_count: int
    budget_range: str
    event_type: str = "Corporate Event"
    dietary_restrictions: Optional[List[str]] = None
    special_requests: Optional[str] = None
    preferred_cuisine: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    required_services: Optional[List[str]] = None  # ["AV", "parking", "catering"]
    max_duration: Optional[int] = 300  # Max call duration in seconds


@dataclass
class VenueInquiryResponse:
    """Structured output for venue inquiry"""
    inquiry_id: str
    call_id: str
    status: str
    venue_name: str
    client_name: str
    call_summary: Optional[str] = None
    transcript: Optional[str] = None
    extracted_quotes: Optional[List[Dict]] = None
    dietary_info: Optional[Dict] = None
    next_steps: Optional[List[str]] = None
    call_metadata: Optional[Dict] = None
    error_message: Optional[str] = None
    created_at: Optional[str] = None
    completed_at: Optional[str] = None


class VoiceService:
    """
    Production voice service for managing multiple concurrent venue inquiries
    """
    
    def __init__(self, api_key: str, max_concurrent_calls: int = 10):
        """
        Initialize the voice service
        
        Args:
            api_key: Bland AI API key
            max_concurrent_calls: Maximum number of concurrent calls
        """
        self.api_key = api_key
        self.max_concurrent_calls = max_concurrent_calls
        self.active_inquiries: Dict[str, Dict] = {}
        self.completed_inquiries: Dict[str, VenueInquiryResponse] = {}
        self.lock = threading.Lock()
        self.executor = ThreadPoolExecutor(max_workers=max_concurrent_calls)
        
        # Custom task template for venue inquiries
        self.venue_inquiry_task = """Call {venue_name} to inquire about venue availability and pricing for {client_name}'s event.

Event Details:
- Date: {event_date}
- Guest Count: {guest_count} people
- Event Type: {event_type}
- Budget Range: {budget_range}
- Special Requests: {special_requests}

Required Information to Gather:
1. Venue availability for the specified date
2. Pricing and what's included (tables, chairs, AV, parking)
3. Capacity and space details
4. Restrictions (noise, alcohol, decorations, music)
5. Additional fees and charges
6. Catering options and dietary accommodations
7. Booking process and deposit requirements
8. Contact information for follow-up

Tone: Professional, friendly, and business-focused. Be thorough in gathering all details and pricing information.

If the venue meets requirements, express interest in proceeding with a tentative reservation pending client approval."""

    def _generate_task_from_request(self, request: VenueInquiryRequest) -> str:
        """Generate custom task from venue inquiry request"""
        return self.venue_inquiry_task.format(
            venue_name=request.venue_name,
            client_name=request.client_name,
            event_date=request.event_date,
            guest_count=request.guest_count,
            event_type=request.event_type,
            budget_range=request.budget_range,
            special_requests=request.special_requests or "None specified"
        )

    def initiate_venue_inquiry(self, request: VenueInquiryRequest) -> VenueInquiryResponse:
        """
        Initiate a venue inquiry call
        
        Args:
            request: Venue inquiry request details
            
        Returns:
            VenueInquiryResponse with inquiry_id and call_id
        """
        try:
            # Generate unique inquiry ID
            inquiry_id = str(uuid.uuid4())
            
            # Create voice agent
            voice_agent = BlandVoiceAgent(self.api_key)
            
            # Generate task
            task = self._generate_task_from_request(request)
            
            # Make the call
            call_response = voice_agent.make_call_with_task(request.venue_phone, task)
            
            if call_response.get("status") == "success":
                call_id = call_response.get("call_id")
                
                # Create response
                response = VenueInquiryResponse(
                    inquiry_id=inquiry_id,
                    call_id=call_id,
                    status=CallStatus.PENDING.value,
                    venue_name=request.venue_name,
                    client_name=request.client_name,
                    created_at=time.strftime("%Y-%m-%d %H:%M:%S")
                )
                
                # Store active inquiry
                with self.lock:
                    self.active_inquiries[inquiry_id] = {
                        "request": request,
                        "response": response,
                        "voice_agent": voice_agent,
                        "start_time": time.time()
                    }
                
                logger.info(f"Inquiry {inquiry_id} initiated for {request.venue_name}")
                return response
                
            else:
                raise Exception(f"Failed to initiate call: {call_response}")
                
        except Exception as e:
            logger.error(f"Error initiating venue inquiry: {e}")
            return VenueInquiryResponse(
                inquiry_id=str(uuid.uuid4()),
                call_id="",
                status=CallStatus.FAILED.value,
                venue_name=request.venue_name,
                client_name=request.client_name,
                error_message=str(e),
                created_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )

    def get_inquiry_status(self, inquiry_id: str) -> Optional[VenueInquiryResponse]:
        """
        Get the current status of an inquiry
        
        Args:
            inquiry_id: Unique inquiry identifier
            
        Returns:
            VenueInquiryResponse or None if not found
        """
        # Check completed inquiries first
        if inquiry_id in self.completed_inquiries:
            return self.completed_inquiries[inquiry_id]
        
        # Check active inquiries
        with self.lock:
            if inquiry_id in self.active_inquiries:
                return self.active_inquiries[inquiry_id]["response"]
        
        return None

    def wait_for_inquiry_completion(self, inquiry_id: str, timeout: int = 300) -> Optional[VenueInquiryResponse]:
        """
        Wait for an inquiry to complete
        
        Args:
            inquiry_id: Unique inquiry identifier
            timeout: Maximum time to wait in seconds
            
        Returns:
            Completed VenueInquiryResponse or None if timeout
        """
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            # Check if completed
            if inquiry_id in self.completed_inquiries:
                return self.completed_inquiries[inquiry_id]
            
            # Check active inquiries
            with self.lock:
                if inquiry_id not in self.active_inquiries:
                    break
                
                inquiry_data = self.active_inquiries[inquiry_id]
                voice_agent = inquiry_data["voice_agent"]
                call_id = inquiry_data["response"].call_id
                
                try:
                    # Check call status
                    call_details = voice_agent.get_call_details(call_id)
                    status = call_details.get("status", "unknown")
                    
                    if status in ["completed", "failed", "no_answer", "busy"]:
                        # Parse call result
                        call_result = voice_agent._parse_call_result(call_details)
                        
                        # Update response
                        response = inquiry_data["response"]
                        response.status = status
                        response.call_summary = call_result.summary
                        response.transcript = call_result.transcript
                        response.extracted_quotes = call_result.quotes
                        response.dietary_info = call_result.dietary_info
                        response.next_steps = call_result.next_steps
                        response.completed_at = time.strftime("%Y-%m-%d %H:%M:%S")
                        
                        # Add call metadata
                        response.call_metadata = {
                            "duration": call_details.get("corrected_duration"),
                            "cost": call_details.get("price"),
                            "answered_by": call_details.get("answered_by"),
                            "call_ended_by": call_details.get("call_ended_by"),
                            "started_at": call_details.get("started_at"),
                            "ended_at": call_details.get("end_at")
                        }
                        
                        # Move to completed
                        self.completed_inquiries[inquiry_id] = response
                        del self.active_inquiries[inquiry_id]
                        
                        logger.info(f"Inquiry {inquiry_id} completed for {response.venue_name}")
                        return response
                        
                except Exception as e:
                    logger.error(f"Error checking inquiry {inquiry_id} status: {e}")
            
            time.sleep(5)  # Wait 5 seconds before checking again
        
        # Timeout
        logger.warning(f"Inquiry {inquiry_id} timed out after {timeout} seconds")
        return None

    def get_all_inquiries(self) -> Dict[str, Any]:
        """
        Get status of all inquiries
        
        Returns:
            Dictionary with active and completed inquiries
        """
        with self.lock:
            active = {
                inquiry_id: {
                    "status": data["response"].status,
                    "venue_name": data["response"].venue_name,
                    "client_name": data["response"].client_name,
                    "created_at": data["response"].created_at,
                    "call_id": data["response"].call_id
                }
                for inquiry_id, data in self.active_inquiries.items()
            }
            
            completed = {
                inquiry_id: asdict(response)
                for inquiry_id, response in self.completed_inquiries.items()
            }
        
        return {
            "active_inquiries": active,
            "completed_inquiries": completed,
            "total_active": len(active),
            "total_completed": len(completed)
        }

    def stop_inquiry(self, inquiry_id: str) -> bool:
        """
        Stop an active inquiry
        
        Args:
            inquiry_id: Unique inquiry identifier
            
        Returns:
            True if stopped successfully, False otherwise
        """
        with self.lock:
            if inquiry_id in self.active_inquiries:
                inquiry_data = self.active_inquiries[inquiry_id]
                voice_agent = inquiry_data["voice_agent"]
                call_id = inquiry_data["response"].call_id
                
                try:
                    voice_agent.stop_call(call_id)
                    
                    # Update status
                    response = inquiry_data["response"]
                    response.status = CallStatus.FAILED.value
                    response.error_message = "Stopped by user"
                    response.completed_at = time.strftime("%Y-%m-%d %H:%M:%S")
                    
                    # Move to completed
                    self.completed_inquiries[inquiry_id] = response
                    del self.active_inquiries[inquiry_id]
                    
                    logger.info(f"Inquiry {inquiry_id} stopped for {response.venue_name}")
                    return True
                    
                except Exception as e:
                    logger.error(f"Error stopping inquiry {inquiry_id}: {e}")
                    return False
        
        return False

    def stop_all_inquiries(self) -> int:
        """
        Stop all active inquiries
        
        Returns:
            Number of inquiries stopped
        """
        stopped_count = 0
        
        with self.lock:
            inquiry_ids = list(self.active_inquiries.keys())
        
        for inquiry_id in inquiry_ids:
            if self.stop_inquiry(inquiry_id):
                stopped_count += 1
        
        return stopped_count

    def cleanup_old_inquiries(self, max_age_hours: int = 24) -> int:
        """
        Clean up old completed inquiries
        
        Args:
            max_age_hours: Maximum age in hours to keep inquiries
            
        Returns:
            Number of inquiries cleaned up
        """
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        cleaned_count = 0
        
        with self.lock:
            inquiry_ids = list(self.completed_inquiries.keys())
        
        for inquiry_id in inquiry_ids:
            inquiry = self.completed_inquiries[inquiry_id]
            if inquiry.created_at:
                try:
                    created_timestamp = time.mktime(time.strptime(inquiry.created_at, "%Y-%m-%d %H:%M:%S"))
                    if current_time - created_timestamp > max_age_seconds:
                        del self.completed_inquiries[inquiry_id]
                        cleaned_count += 1
                except:
                    pass
        
        if cleaned_count > 0:
            logger.info(f"Cleaned up {cleaned_count} old inquiries")
        
        return cleaned_count

    def __del__(self):
        """Cleanup on destruction"""
        self.executor.shutdown(wait=True)
        self.stop_all_inquiries()


# Convenience function for backend integration
def create_venue_inquiry(
    api_key: str,
    venue_name: str,
    venue_phone: str,
    client_name: str,
    event_date: str,
    guest_count: int,
    budget_range: str,
    **kwargs
) -> VenueInquiryResponse:
    """
    Convenience function to create a venue inquiry
    
    Args:
        api_key: Bland AI API key
        venue_name: Name of the venue
        venue_phone: Venue phone number
        client_name: Name of the client
        event_date: Event date (YYYY-MM-DD)
        guest_count: Number of guests
        budget_range: Budget range (e.g., "$2000-4000")
        **kwargs: Additional VenueInquiryRequest parameters
        
    Returns:
        VenueInquiryResponse with inquiry_id and call_id
    """
    service = VoiceService(api_key)
    
    request = VenueInquiryRequest(
        venue_name=venue_name,
        venue_phone=venue_phone,
        client_name=client_name,
        event_date=event_date,
        guest_count=guest_count,
        budget_range=budget_range,
        **kwargs
    )
    
    return service.initiate_venue_inquiry(request) 