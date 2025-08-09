import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { TimeEntryService } from '@/utils/timeEntryService';
import { UserService } from '@/utils/userService';

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
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    let employeeId = user.id;
    
    // Admin can check status for any employee
    if (user.role === 'admin') {
      const requestedEmployeeId = searchParams.get('employeeId');
      if (requestedEmployeeId) {
        employeeId = requestedEmployeeId;
      }
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Get employee status
    const status = await TimeEntryService.getEmployeeStatus(employeeId, date);
    
    // Get employee's hourly rate
    const hourlyRate = await TimeEntryService.getEmployeeHourlyRate(employeeId);

    return NextResponse.json({
      ...status,
      hourlyRate,
      date
    });
  } catch (error) {
    console.error('Get employee status error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}