import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/jwt';
import { attendanceService } from '@/utils/attendanceService';
import { AdminOverviewResponse, AttendanceError } from '@/types/attendance';

export async function GET(request: NextRequest) {
  try {
    // Parse and verify JWT token
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as AttendanceError,
        { status: 401 }
      );
    }

    const { role } = authResult.payload;

    // Check if user has admin or HR privileges
    if (role !== 'admin' && role !== 'HR') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin or HR privileges required' } as AttendanceError,
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    const department = searchParams.get('department') || undefined;

    // Validate date parameter
    if (date && isNaN(Date.parse(date))) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' } as AttendanceError,
        { status: 400 }
      );
    }

    // Get employee attendance summaries
    const employees = await attendanceService.getAdminOverview(date, department);

    // Get attendance summary statistics
    const summary = await attendanceService.getAttendanceSummary(date);

    const response: AdminOverviewResponse = {
      employees,
      summary
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Admin overview error:', error);
    
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