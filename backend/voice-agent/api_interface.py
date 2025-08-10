#!/usr/bin/env python3
"""
Production API Interface for Bland AI Voice Service
Clean interface for backend integration
"""

import json
import time
from typing import Dict, List, Optional, Any, Union
from dataclasses import asdict

from voice_service import VoiceService, VenueInquiryRequest, VenueInquiryResponse
from config import API_KEY, VOICE_SETTINGS


class VoiceServiceAPI:
    """
    Clean API interface for the voice service
    Designed for backend integration
    """
    
    def __init__(self, api_key: str = None, max_concurrent_calls: int = None):
        """
        Initialize the API interface
        
        Args:
            api_key: Bland AI API key (uses config if not provided)
            max_concurrent_calls: Max concurrent calls (uses config if not provided)
        """
        if api_key is None:
            api_key = API_KEY
        
        if max_concurrent_calls is None:
            max_concurrent_calls = 10  # Default value
        
        self.service = VoiceService(api_key, max_concurrent_calls)
    
    def create_venue_inquiry(
        self,
        venue_name: str,
        venue_phone: str,
        client_name: str,
        event_date: str,
        guest_count: int,
        budget_range: str,
        event_type: str = "Corporate Event",
        dietary_restrictions: Optional[List[str]] = None,
        special_requests: Optional[str] = None,
        preferred_cuisine: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        required_services: Optional[List[str]] = None,
        max_duration: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Create a new venue inquiry
        
        Args:
            venue_name: Name of the venue
            venue_phone: Venue phone number (E.164 format)
            client_name: Name of the client
            event_date: Event date (YYYY-MM-DD)
            guest_count: Number of guests
            budget_range: Budget range (e.g., "$2000-4000")
            event_type: Type of event
            dietary_restrictions: List of dietary restrictions
            special_requests: Special requirements
            preferred_cuisine: Preferred cuisine type
            start_time: Event start time (HH:MM)
            end_time: Event end time (HH:MM)
            required_services: List of required services
            max_duration: Maximum call duration in seconds
            
        Returns:
            Dictionary with inquiry_id, call_id, and status
        """
        try:
            # Create request
            request = VenueInquiryRequest(
                venue_name=venue_name,
                venue_phone=venue_phone,
                client_name=client_name,
                event_date=event_date,
                guest_count=guest_count,
                budget_range=budget_range,
                event_type=event_type,
                dietary_restrictions=dietary_restrictions,
                special_requests=special_requests,
                preferred_cuisine=preferred_cuisine,
                start_time=start_time,
                end_time=end_time,
                required_services=required_services,
                max_duration=max_duration
            )
            
            # Initiate inquiry
            response = self.service.initiate_venue_inquiry(request)
            
            # Return clean response
            return {
                "success": True,
                "inquiry_id": response.inquiry_id,
                "call_id": response.call_id,
                "status": response.status,
                "venue_name": response.venue_name,
                "client_name": response.client_name,
                "created_at": response.created_at,
                "message": "Venue inquiry initiated successfully"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to create venue inquiry"
            }
    
    def get_inquiry_status(self, inquiry_id: str) -> Dict[str, Any]:
        """
        Get the current status of an inquiry
        
        Args:
            inquiry_id: Unique inquiry identifier
            
        Returns:
            Dictionary with inquiry status and details
        """
        try:
            response = self.service.get_inquiry_status(inquiry_id)
            
            if response is None:
                return {
                    "success": False,
                    "error": "Inquiry not found",
                    "message": f"No inquiry found with ID: {inquiry_id}"
                }
            
            # Convert to dictionary
            result = asdict(response)
            result["success"] = True
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to get inquiry status"
            }
    
    def wait_for_inquiry_completion(
        self, 
        inquiry_id: str, 
        timeout: int = None
    ) -> Dict[str, Any]:
        """
        Wait for an inquiry to complete
        
        Args:
            inquiry_id: Unique inquiry identifier
            timeout: Maximum time to wait in seconds
            
        Returns:
            Dictionary with completed inquiry details
        """
        try:
            if timeout is None:
                config = get_config()
                timeout = config.CALL_TIMEOUT_SECONDS
            
            response = self.service.wait_for_inquiry_completion(inquiry_id, timeout)
            
            if response is None:
                return {
                    "success": False,
                    "error": "Inquiry timed out",
                    "message": f"Inquiry {inquiry_id} did not complete within {timeout} seconds"
                }
            
            # Convert to dictionary
            result = asdict(response)
            result["success"] = True
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to wait for inquiry completion"
            }
    
    def get_all_inquiries(self) -> Dict[str, Any]:
        """
        Get status of all inquiries
        
        Returns:
            Dictionary with all inquiry statuses
        """
        try:
            inquiries = self.service.get_all_inquiries()
            inquiries["success"] = True
            
            return inquiries
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to get inquiry statuses"
            }
    
    def stop_inquiry(self, inquiry_id: str) -> Dict[str, Any]:
        """
        Stop an active inquiry
        
        Args:
            inquiry_id: Unique inquiry identifier
            
        Returns:
            Dictionary with stop operation result
        """
        try:
            success = self.service.stop_inquiry(inquiry_id)
            
            if success:
                return {
                    "success": True,
                    "message": f"Inquiry {inquiry_id} stopped successfully"
                }
            else:
                return {
                    "success": False,
                    "error": "Failed to stop inquiry",
                    "message": f"Could not stop inquiry {inquiry_id}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to stop inquiry"
            }
    
    def stop_all_inquiries(self) -> Dict[str, Any]:
        """
        Stop all active inquiries
        
        Returns:
            Dictionary with stop operation result
        """
        try:
            stopped_count = self.service.stop_all_inquiries()
            
            return {
                "success": True,
                "stopped_count": stopped_count,
                "message": f"Stopped {stopped_count} active inquiries"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to stop all inquiries"
            }
    
    def cleanup_old_inquiries(self, max_age_hours: int = None) -> Dict[str, Any]:
        """
        Clean up old completed inquiries
        
        Args:
            max_age_hours: Maximum age in hours to keep inquiries
            
        Returns:
            Dictionary with cleanup operation result
        """
        try:
            if max_age_hours is None:
                config = get_config()
                max_age_hours = config.INQUIRY_CLEANUP_HOURS
            
            cleaned_count = self.service.cleanup_old_inquiries(max_age_hours)
            
            return {
                "success": True,
                "cleaned_count": cleaned_count,
                "message": f"Cleaned up {cleaned_count} old inquiries"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to cleanup old inquiries"
            }


# Convenience functions for direct backend calls
def create_venue_inquiry_api(
    api_key: str,
    venue_name: str,
    venue_phone: str,
    client_name: str,
    event_date: str,
    guest_count: int,
    budget_range: str,
    **kwargs
) -> Dict[str, Any]:
    """
    Convenience function to create a venue inquiry via API
    
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
        Dictionary with inquiry result
    """
    api = VoiceServiceAPI(api_key)
    return api.create_venue_inquiry(
        venue_name=venue_name,
        venue_phone=venue_phone,
        client_name=client_name,
        event_date=event_date,
        guest_count=guest_count,
        budget_range=budget_range,
        **kwargs
    )


def get_inquiry_status_api(api_key: str, inquiry_id: str) -> Dict[str, Any]:
    """
    Convenience function to get inquiry status via API
    
    Args:
        api_key: Bland AI API key
        inquiry_id: Unique inquiry identifier
        
    Returns:
        Dictionary with inquiry status
    """
    api = VoiceServiceAPI(api_key)
    return api.get_inquiry_status(inquiry_id)


def wait_for_inquiry_completion_api(
    api_key: str, 
    inquiry_id: str, 
    timeout: int = None
) -> Dict[str, Any]:
    """
    Convenience function to wait for inquiry completion via API
    
    Args:
        api_key: Bland AI API key
        inquiry_id: Unique inquiry identifier
        timeout: Maximum time to wait in seconds
        
    Returns:
        Dictionary with completed inquiry details
    """
    api = VoiceServiceAPI(api_key)
    return api.wait_for_inquiry_completion(inquiry_id, timeout) 