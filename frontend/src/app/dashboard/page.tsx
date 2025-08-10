'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for UI development
const mockEvents = [
  {
    id: '1',
    title: 'Annual Tech Conference',
    eventType: 'Corporate Conference',
    budget: 50000,
    attendeeCount: 500,
    status: 'PLANNING',
    startDate: new Date('2025-10-15'),
  },
  {
    id: '2',
    title: 'Product Launch Party',
    eventType: 'Product Launch',
    budget: 25000,
    attendeeCount: 200,
    status: 'VENDOR_SELECTION',
    startDate: new Date('2025-09-20'),
  },
  {
    id: '3',
    title: 'Team Building Retreat',
    eventType: 'Team Building',
    budget: 15000,
    attendeeCount: 50,
    status: 'CONFIRMED',
    startDate: new Date('2025-11-05'),
  },
];

export default function DashboardPage() {
  const [events, setEvents] = useState(mockEvents);
  const [isLoading, setIsLoading] = useState(false);

  // This would fetch real data in a production app
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch('/api/events');
  //       if (!response.ok) throw new Error('Failed to fetch events');
  //       const data = await response.json();
  //       setEvents(data);
  //     } catch (error) {
  //       console.error('Error fetching events:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchEvents();
  // }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800';
      case 'VENDOR_SELECTION':
        return 'bg-purple-100 text-purple-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Events</h1>
        <Link
          href="/events/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create New Event
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">No events found</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any events yet. Get started by creating your first event!
          </p>
          <Link
            href="/events/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold line-clamp-2">{event.title}</h2>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Type:</span> {event.eventType}
                    </p>
                    <p>
                      <span className="font-medium">Budget:</span> {formatCurrency(event.budget)}
                    </p>
                    <p>
                      <span className="font-medium">Attendees:</span> {event.attendeeCount}
                    </p>
                    {event.startDate && (
                      <p>
                        <span className="font-medium">Date:</span> {formatDate(event.startDate)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm text-blue-600 font-medium">View Details →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
