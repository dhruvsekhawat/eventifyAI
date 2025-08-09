'use client';

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';

// Mock events data for UI development
const mockEvents = [
  {
    id: '1',
    title: 'Annual Company Retreat',
    start: new Date(2025, 7, 15, 9, 0), // Aug 15, 2025, 9:00 AM
    end: new Date(2025, 7, 18, 17, 0), // Aug 18, 2025, 5:00 PM
    color: 'bg-green-100 text-green-800',
    description: 'Team building activities and strategic planning sessions',
    location: 'Mountain View Resort',
  },
  {
    id: '2',
    title: 'Product Launch Event',
    start: new Date(2025, 7, 5, 13, 0), // Aug 5, 2025, 1:00 PM
    end: new Date(2025, 7, 5, 16, 0), // Aug 5, 2025, 4:00 PM
    color: 'bg-blue-100 text-blue-800',
    description: 'Launch of our new AI-powered features',
    location: 'San Francisco Convention Center',
  },
  {
    id: '3',
    title: 'Client Meeting',
    start: new Date(2025, 7, 10, 10, 0), // Aug 10, 2025, 10:00 AM
    end: new Date(2025, 7, 10, 11, 30), // Aug 10, 2025, 11:30 AM
    color: 'bg-purple-100 text-purple-800',
    description: 'Discussion about upcoming event requirements',
    location: 'Virtual Meeting',
  },
  {
    id: '4',
    title: 'Team Building Workshop',
    start: new Date(2025, 7, 22, 9, 0), // Aug 22, 2025, 9:00 AM
    end: new Date(2025, 7, 22, 17, 0), // Aug 22, 2025, 5:00 PM
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Full-day workshop focused on team collaboration',
    location: 'Downtown Office',
  },
  {
    id: '5',
    title: 'Vendor Meeting',
    start: new Date(2025, 7, 8, 14, 0), // Aug 8, 2025, 2:00 PM
    end: new Date(2025, 7, 8, 15, 0), // Aug 8, 2025, 3:00 PM
    color: 'bg-pink-100 text-pink-800',
    description: 'Meeting with catering vendors for upcoming events',
    location: 'Office Conference Room',
  },
];

interface EventModalProps {
  event: any;
  onClose: () => void;
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Time</span>
            <p className="mt-1">
              {formatDate(event.start)} - {formatDate(event.end)}
            </p>
          </div>
          {event.location && (
            <div>
              <span className="text-sm font-medium text-gray-500">Location</span>
              <p className="mt-1">{event.location}</p>
            </div>
          )}
          {event.description && (
            <div>
              <span className="text-sm font-medium text-gray-500">Description</span>
              <p className="mt-1">{event.description}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Edit Event
          </button>
        </div>
      </div>
    </div>
  );
};

interface DateModalProps {
  date: Date;
  onClose: () => void;
  onCreateEvent: (event: any) => void;
}

const DateModal = ({ date, onClose, onCreateEvent }: DateModalProps) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '09:00',
    endTime: '10:00',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(date);
    const [startHours, startMinutes] = eventData.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes);
    
    const endDate = new Date(date);
    const [endHours, endMinutes] = eventData.endTime.split(':').map(Number);
    endDate.setHours(endHours, endMinutes);
    
    const newEvent = {
      id: Date.now().toString(),
      title: eventData.title,
      start: startDate,
      end: endDate,
      description: eventData.description,
      location: eventData.location,
      color: 'bg-blue-100 text-blue-800',
    };
    
    onCreateEvent(newEvent);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{formatDate(date)}</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={eventData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CalendarPage() {
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = (newEvent: any) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Event Calendar</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Event
          </button>
        </div>

        <Calendar
          events={events}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        {selectedDate && (
          <DateModal
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
            onCreateEvent={handleCreateEvent}
          />
        )}
      </div>
    </div>
  );
}
