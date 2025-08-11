import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/jwt';
import { attendanceService } from '@/utils/attendanceService';
import { CheckOutRequest, CheckOutResponse, AttendanceError } from '@/types/attendance';

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
    const body: CheckOutRequest = await request.json();
    const { employee_id, timestamp } = body;

    // Validate employee_id is provided
    if (!employee_id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' } as AttendanceError,
        { status: 400 }
      );
    }

    // Check if user is authorized to check out for this employee
    // Employees can only check out for themselves, admins/HR can check out for others
    if (role === 'employee' && employee_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'You can only check out for yourself' } as AttendanceError,
        { status: 403 }
      );
    }

    // Parse timestamp if provided
    let checkOutTime: Date | undefined;
    if (timestamp) {
      checkOutTime = new Date(timestamp);
      if (isNaN(checkOutTime.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid timestamp format' } as AttendanceError,
          { status: 400 }
        );
      }
    }

    // Check if employee is currently checked in
    const isCheckedIn = await attendanceService.isEmployeeCheckedIn(employee_id);
    if (!isCheckedIn) {
      return NextResponse.json(
        { success: false, error: 'Employee is not checked in today' } as AttendanceError,
        { status: 409 }
      );
    }

    // Create check-out record
    console.log('Attempting check-out for employee:', employee_id, 'at time:', checkOutTime);
    const attendanceRecord = await attendanceService.checkOut(employee_id, checkOutTime);
    console.log('Check-out successful for employee:', employee_id, 'record ID:', attendanceRecord._id);

    const response: CheckOutResponse = {
      success: true,
      attendance_id: attendanceRecord._id!,
      check_out_time: attendanceRecord.check_out_time!.toISOString(),
      total_hours: attendanceRecord.total_hours!,
      message: `Successfully checked out. Total work time: ${attendanceService.formatHours(attendanceRecord.total_hours!).formatted}`
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Check-out error:', error);
    
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