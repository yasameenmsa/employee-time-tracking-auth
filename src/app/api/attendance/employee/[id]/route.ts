import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/jwt';
import { attendanceService } from '@/utils/attendanceService';
import { EmployeeAttendanceResponse, AttendanceError } from '@/types/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const resolvedParams = await params;
    const employeeId = resolvedParams.id;

    // Check if user is authorized to view this employee's attendance
    // Employees can only view their own attendance, admins/HR can view all
    if (role === 'employee' && employeeId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You can only view your own attendance records' } as AttendanceError,
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // Validate limit parameter
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return NextResponse.json(
        { success: false, error: 'Invalid limit parameter. Must be between 1 and 1000' } as AttendanceError,
        { status: 400 }
      );
    }

    // Validate date parameters
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { success: false, error: 'Invalid start_date format. Use YYYY-MM-DD' } as AttendanceError,
        { status: 400 }
      );
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        { success: false, error: 'Invalid end_date format. Use YYYY-MM-DD' } as AttendanceError,
        { status: 400 }
      );
    }

    // Get attendance records
    const attendanceRecords = await attendanceService.getEmployeeAttendance(
      employeeId,
      startDate,
      endDate,
      limit
    );

    // Calculate total hours for the period
    const totalHoursPeriod = attendanceRecords
      .filter(record => record.total_hours !== null)
      .reduce((sum, record) => sum + (record.total_hours || 0), 0);

    // Get current status
    const isCheckedIn = await attendanceService.isEmployeeCheckedIn(employeeId);
    const currentStatus = isCheckedIn ? 'checked_in' : 'checked_out';

    const response: EmployeeAttendanceResponse = {
      attendance_records: attendanceRecords.map(record => ({
        ...record,
        _id: record._id?.toString(),
        employee_id: record.employee_id.toString()
      })),
      total_hours_period: Math.round(totalHoursPeriod * 100) / 100,
      current_status: currentStatus as 'checked_in' | 'checked_out'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Get employee attendance error:', error);
    
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
export async function POST() {
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