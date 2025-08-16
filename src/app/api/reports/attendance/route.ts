import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reportService } from '../../../../utils/reportService';
import { AttendanceReportFilter } from '../../../../types/report';

// Validation schema for report request
const reportRequestSchema = z.object({
  reportType: z.enum(['daily', 'weekly', 'monthly']),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['present', 'absent', 'late']).optional()
});

const analyticsRequestSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  employeeId: z.string().optional(),
  department: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'generate':
        return await handleGenerateReport(searchParams);
      case 'analytics':
        return await handleGenerateAnalytics(searchParams);
      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action. Supported actions: generate, analytics'
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Attendance report API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Handle report generation request
 * GET /api/reports/attendance?action=generate&reportType=daily&startDate=2024-01-01&endDate=2024-01-31
 */
async function handleGenerateReport(searchParams: URLSearchParams) {
  try {
    // Convert URLSearchParams to object for validation
    const queryObject = {
      reportType: searchParams.get('reportType'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      employeeId: searchParams.get('employeeId') || undefined,
      department: searchParams.get('department') || undefined,
      status: searchParams.get('status') || undefined
    };

    // Validate request parameters
    const validationResult = reportRequestSchema.safeParse(queryObject);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request parameters',
          errors: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { reportType, startDate, endDate, employeeId, department, status } = validationResult.data;

    // Validate date range
    if (startDate > endDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Start date must be before or equal to end date'
        },
        { status: 400 }
      );
    }

    // Check if date range is not too large (max 1 year)
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 365) {
      return NextResponse.json(
        {
          success: false,
          message: 'Date range cannot exceed 365 days'
        },
        { status: 400 }
      );
    }

    // Create filter object
    const filter: AttendanceReportFilter = {
      startDate,
      endDate,
      ...(employeeId && { employeeId }),
      ...(department && { department }),
      ...(status && { status })
    };

    // Generate report
    const report = await reportService.generateAttendanceReport(reportType, filter);

    return NextResponse.json(
      {
        success: true,
        message: 'Report generated successfully',
        data: report
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate report',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Handle analytics generation request
 * GET /api/reports/attendance?action=analytics&startDate=2024-01-01&endDate=2024-01-31
 */
async function handleGenerateAnalytics(searchParams: URLSearchParams) {
  try {
    // Convert URLSearchParams to object for validation
    const queryObject = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      employeeId: searchParams.get('employeeId') || undefined,
      department: searchParams.get('department') || undefined
    };

    // Validate request parameters
    const validationResult = analyticsRequestSchema.safeParse(queryObject);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request parameters',
          errors: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { startDate, endDate, employeeId, department } = validationResult.data;

    // Validate date range
    if (startDate > endDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Start date must be before or equal to end date'
        },
        { status: 400 }
      );
    }

    // Check if date range is not too large (max 1 year)
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 365) {
      return NextResponse.json(
        {
          success: false,
          message: 'Date range cannot exceed 365 days'
        },
        { status: 400 }
      );
    }

    // Create filter object
    const filter: AttendanceReportFilter = {
      startDate,
      endDate,
      ...(employeeId && { employeeId }),
      ...(department && { department })
    };

    // Generate analytics
    const analytics = await reportService.generateAttendanceAnalytics(filter);

    return NextResponse.json(
      {
        success: true,
        message: 'Analytics generated successfully',
        data: analytics
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate analytics',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}