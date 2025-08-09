import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { TimeEntryService } from '@/utils/timeEntryService';
import { UserService } from '@/utils/userService';
import { TimeEntryFilters } from '@/types/timeEntry';

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters: TimeEntryFilters = {};

    // If user is not admin, only show their own entries
    if (user.role !== 'admin') {
      filters.employeeId = user.id;
    } else {
      // Admin can filter by employee
      const employeeId = searchParams.get('employeeId');
      if (employeeId) {
        filters.employeeId = employeeId;
      }
    }

    // Common filters
    const employeeName = searchParams.get('employeeName');
    if (employeeName) {
      filters.employeeName = employeeName;
    }

    const startDate = searchParams.get('startDate');
    if (startDate) {
      filters.startDate = startDate;
    }

    const endDate = searchParams.get('endDate');
    if (endDate) {
      filters.endDate = endDate;
    }

    const page = searchParams.get('page');
    if (page) {
      filters.page = parseInt(page, 10);
    }

    const limit = searchParams.get('limit');
    if (limit) {
      filters.limit = parseInt(limit, 10);
    }

    // Get time entries
    const result = await TimeEntryService.getTimeEntries(filters);

    return NextResponse.json({
      entries: result.entries,
      total: result.total,
      page: filters.page || 1,
      limit: filters.limit || 50,
      totalPages: Math.ceil(result.total / (filters.limit || 50))
    });
  } catch (error) {
    console.error('Get time entries error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Only admin can update time entries
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse request body
    const { entryId, updates } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Validate time formats if provided
    if (updates.clockIn) {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(updates.clockIn)) {
        return NextResponse.json(
          { error: 'Invalid clock-in time format. Use HH:MM' },
          { status: 400 }
        );
      }
    }

    if (updates.clockOut) {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(updates.clockOut)) {
        return NextResponse.json(
          { error: 'Invalid clock-out time format. Use HH:MM' },
          { status: 400 }
        );
      }
    }

    if (updates.hourlyRate && (typeof updates.hourlyRate !== 'number' || updates.hourlyRate <= 0)) {
      return NextResponse.json(
        { error: 'Hourly rate must be a positive number' },
        { status: 400 }
      );
    }

    // Update time entry
    const updatedEntry = await TimeEntryService.updateTimeEntry(entryId, updates);

    if (!updatedEntry) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Time entry updated successfully',
      timeEntry: updatedEntry
    });
  } catch (error) {
    console.error('Update time entry error:', error);
    
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

export async function DELETE(request: NextRequest) {
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

    // Only admin can delete time entries
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse request body
    const { entryId } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Delete time entry
    const deleted = await TimeEntryService.deleteTimeEntry(entryId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Time entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete time entry error:', error);
    
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