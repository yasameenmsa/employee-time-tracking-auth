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

    // Only admin can view all employee settings
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get all employee settings
    const settings = await TimeEntryService.getAllEmployeeSettings();

    return NextResponse.json({
      settings
    });
  } catch (error) {
    console.error('Get employee settings error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Only admin can update employee settings
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse request body
    const { employeeId, hourlyRate } = await request.json();

    if (!employeeId || typeof hourlyRate !== 'number') {
      return NextResponse.json(
        { error: 'Employee ID and hourly rate are required' },
        { status: 400 }
      );
    }

    if (hourlyRate <= 0) {
      return NextResponse.json(
        { error: 'Hourly rate must be a positive number' },
        { status: 400 }
      );
    }

    // Verify employee exists
    const employee = await UserService.getUserById(employeeId);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Set employee hourly rate
    const settings = await TimeEntryService.setEmployeeHourlyRate(employeeId, hourlyRate);

    return NextResponse.json({
      message: 'Employee hourly rate updated successfully',
      settings
    });
  } catch (error) {
    console.error('Set employee hourly rate error:', error);
    
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