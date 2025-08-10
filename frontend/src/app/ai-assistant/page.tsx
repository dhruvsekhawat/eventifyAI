'use client';

import { useState } from 'react';
import AIChat from '@/components/ui/AIChat';

export default function AIAssistantPage() {
  const [eventContext, setEventContext] = useState({
    eventType: '',
    budget: '',
    attendees: '',
    location: '',
  });

  const handleContextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventContext((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildInitialContext = () => {
    if (!eventContext.eventType && !eventContext.budget && !eventContext.attendees && !eventContext.location) {
      return undefined;
    }

    let context = "I'll help you plan your event. Based on what you've shared:";
    
    if (eventContext.eventType) {
      context += `\n- Event type: ${eventContext.eventType}`;
    }
    
    if (eventContext.budget) {
      context += `\n- Budget: $${eventContext.budget}`;
    }
    
    if (eventContext.attendees) {
      context += `\n- Expected attendees: ${eventContext.attendees}`;
    }
    
    if (eventContext.location) {
      context += `\n- Location preference: ${eventContext.location}`;
    }
    
    context += "\n\nWhat specific aspect of event planning would you like help with?";
    
    return context;
  };

  const eventTypes = [
    'Corporate Conference',
    'Wedding',
    'Birthday Party',
    'Product Launch',
    'Networking Event',
    'Gala Dinner',
    'Workshop',
    'Team Building',
    'Exhibition',
    'Other',
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Event Planning Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Event Context</h2>
            <p className="text-gray-600 mb-6">
              Provide some details about your event to get more personalized assistance from our AI.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={eventContext.eventType}
                  onChange={handleContextChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (USD)
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={eventContext.budget}
                  onChange={handleContextChange}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Attendees
                </label>
                <input
                  type="text"
                  id="attendees"
                  name="attendees"
                  value={eventContext.attendees}
                  onChange={handleContextChange}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventContext.location}
                  onChange={handleContextChange}
                  placeholder="e.g. Downtown San Francisco"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-2">AI Assistant Can Help With:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Budget allocation recommendations</li>
                <li>Venue selection advice</li>
                <li>Vendor suggestions and negotiation tips</li>
                <li>Timeline planning</li>
                <li>Guest experience optimization</li>
                <li>Risk management</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <AIChat initialContext={buildInitialContext()} />
        </div>
      </div>
    </div>
  );
}
