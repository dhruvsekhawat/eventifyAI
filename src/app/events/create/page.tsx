'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/forms/EventForm';

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real app, we would send this data to an API endpoint
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();
      
      // Redirect to the event details page or dashboard
      router.push(`/events/${result.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Create a New Event</h1>
      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
