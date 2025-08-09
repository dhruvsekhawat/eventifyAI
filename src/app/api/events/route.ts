import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real application, you would validate the user is authenticated
    // and get their userId from the session
    const userId = 'temp-user-id'; // This would come from authentication
    
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        eventType: body.eventType,
        budget: body.budget,
        attendeeCount: body.attendeeCount,
        location: body.location,
        district: body.district,
        startDate: body.startDate,
        endDate: body.endDate,
        specialRequests: body.specialRequests,
        userId: userId,
      },
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // In a real application, you would filter by the authenticated user
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
