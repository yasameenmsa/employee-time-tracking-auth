import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { TimeEntryService } from '@/utils/timeEntryService';
import { UserService } from '@/utils/userService';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieHeader = request.headers.get('cookie');
    const token = parseAuthCookie(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user data
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const { date, clockIn } = await request.json();

    if (!date || !clockIn) {
      return NextResponse.json(
        { error: 'Date and clock-in time are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(clockIn)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM' },
        { status: 400 }
      );
    }

    // Clock in the employee
    const timeEntry = await TimeEntryService.clockIn(
      user.id,
      user.username,
      date,
      clockIn
    );

    return NextResponse.json({
      message: 'Clocked in successfully',
      timeEntry
    });
  } catch (error) {
    console.error('Clock-in error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}