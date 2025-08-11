import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/jwt';
import { attendanceService } from '@/utils/attendanceService';
import { CheckInRequest, CheckInResponse, AttendanceError } from '@/types/attendance';

export async function POST(request: NextRequest) {
  try {
    // Parse and verify JWT token
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as AttendanceError,
        { status: 401 }
      );
    }

    const { userId, role } = authResult.payload;

    // Parse request body
    const body: CheckInRequest = await request.json();
    const { employee_id, timestamp } = body;

    // Validate employee_id is provided
    if (!employee_id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' } as AttendanceError,
        { status: 400 }
      );
    }

    // Check if user is authorized to check in for this employee
    // Employees can only check in for themselves, admins/HR can check in for others
    if (role === 'employee' && employee_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'You can only check in for yourself' } as AttendanceError,
        { status: 403 }
      );
    }

    // Parse timestamp if provided
    let checkInTime: Date | undefined;
    if (timestamp) {
      checkInTime = new Date(timestamp);
      if (isNaN(checkInTime.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid timestamp format' } as AttendanceError,
          { status: 400 }
        );
      }
    }

    // Check if employee is already checked in
    const isCheckedIn = await attendanceService.isEmployeeCheckedIn(employee_id);
    if (isCheckedIn) {
      return NextResponse.json(
        { success: false, error: 'Employee is already checked in today' } as AttendanceError,
        { status: 409 }
      );
    }

    // Create check-in record
    const attendanceRecord = await attendanceService.checkIn(employee_id, checkInTime);

    const response: CheckInResponse = {
      success: true,
      attendance_id: attendanceRecord._id!,
      check_in_time: attendanceRecord.check_in_time.toISOString(),
      message: 'Successfully checked in'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Check-in error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      employeeId: body?.employee_id,
      timestamp: body?.timestamp,
      userId,
      role
    });
    
    // Handle specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message } as AttendanceError,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' } as AttendanceError,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' } as AttendanceError,
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' } as AttendanceError,
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' } as AttendanceError,
    { status: 405 }
  );
}