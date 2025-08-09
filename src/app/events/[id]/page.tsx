'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Mock data for UI development
const mockEvent = {
  id: '1',
  title: 'Annual Tech Conference',
  description: 'A gathering of tech professionals to discuss the latest trends and innovations in the industry.',
  eventType: 'Corporate Conference',
  budget: 50000,
  attendeeCount: 500,
  location: 'San Francisco Convention Center',
  district: 'Downtown',
  startDate: new Date('2025-10-15'),
  endDate: new Date('2025-10-17'),
  specialRequests: 'Need vegetarian and vegan food options. Require accessibility accommodations.',
  status: 'PLANNING',
  createdAt: new Date('2025-05-10'),
  updatedAt: new Date('2025-05-15'),
};

// Mock vendor data
const mockVendors = [
  {
    id: '1',
    name: 'Elite Catering',
    serviceType: 'Catering',
    proposedPrice: 12500,
    status: 'NEGOTIATING',
  },
  {
    id: '2',
    name: 'Sound & Vision AV',
    serviceType: 'Audio/Visual',
    proposedPrice: 8000,
    status: 'CONFIRMED',
  },
  {
    id: '3',
    name: 'Elegant Decor',
    serviceType: 'Decoration',
    proposedPrice: 5500,
    status: 'PENDING',
  },
];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(mockEvent);
  const [vendors, setVendors] = useState(mockVendors);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // In a real app, we would fetch the event data from an API
  // useEffect(() => {
  //   const fetchEventData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`/api/events/${params.id}`);
  //       if (!response.ok) throw new Error('Failed to fetch event');
  //       const data = await response.json();
  //       setEvent(data);
  //     } catch (error) {
  //       console.error('Error fetching event:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchEventData();
  // }, [params.id]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
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
      case 'NEGOTIATING':
        return 'bg-orange-100 text-orange-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center">
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status.replace('_', ' ')}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600">{event.eventType}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
                Edit Event
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Cancel Event
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Event Details
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'vendors'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('vendors')}
            >
              Vendors
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'ai'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('ai')}
            >
              AI Assistant
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{event.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                      <p className="mt-1 font-semibold">{formatCurrency(event.budget)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Attendees</h3>
                      <p className="mt-1 font-semibold">{event.attendeeCount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                      <p className="mt-1">{formatDate(event.startDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                      <p className="mt-1">{formatDate(event.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Location & Requirements</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{event.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">District/Area</h3>
                    <p className="mt-1">{event.district}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Special Requests</h3>
                    <p className="mt-1">{event.specialRequests}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Vendors</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Add Vendor
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vendor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Service Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Proposed Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{vendor.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{vendor.serviceType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(vendor.proposedPrice)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              vendor.status
                            )}`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            View
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Negotiate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">AI Event Assistant</h2>
                <p className="text-gray-600 mb-6">
                  Our AI assistant can help you optimize your event planning, suggest vendors, and
                  negotiate the best deals based on your budget and requirements.
                </p>

                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white mr-4">
                      AI
                    </div>
                    <div>
                      <p className="text-gray-800">
                        Based on your budget of {formatCurrency(event.budget)} and attendee count of{' '}
                        {event.attendeeCount}, I recommend allocating:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                        <li>
                          <strong>Venue:</strong> {formatCurrency(event.budget * 0.4)} (40% of budget)
                        </li>
                        <li>
                          <strong>Catering:</strong> {formatCurrency(event.budget * 0.25)} (25% of
                          budget)
                        </li>
                        <li>
                          <strong>AV Equipment:</strong> {formatCurrency(event.budget * 0.15)} (15% of
                          budget)
                        </li>
                        <li>
                          <strong>Decor:</strong> {formatCurrency(event.budget * 0.1)} (10% of budget)
                        </li>
                        <li>
                          <strong>Miscellaneous:</strong> {formatCurrency(event.budget * 0.1)} (10% of
                          budget)
                        </li>
                      </ul>
                      <p className="mt-4 text-gray-800">
                        Would you like me to suggest vendors in each category based on your location
                        and budget?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <input
                    type="text"
                    placeholder="Ask the AI assistant a question..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
