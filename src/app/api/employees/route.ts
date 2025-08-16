import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, getEmployeeStats } from '@/utils/employeeService';
import { EmployeeFilters, Employee } from '@/types/employee';
import { authenticateRequest } from '@/utils/jwt';
import { UserService } from '@/utils/userService';
import { validateEmployeeFilters } from '@/utils/employeeValidation';

export async function GET(request: NextRequest) {
  try {
    // Parse and verify authentication
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user details from payload
    const user = await UserService.getUserById(authResult.payload!.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to view employees
    if (user.role !== 'admin' && user.role !== 'HR') {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admin and HR can view employee lists.' },
        { status: 403 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      search: searchParams.get('search') || undefined,
      department: searchParams.get('department') || undefined,
      role: searchParams.get('role') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      manager: searchParams.get('manager') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined
    };

    // Validate filters with Zod
    const validation = validateEmployeeFilters(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const filters = validation.data as EmployeeFilters;

    // Check if requesting stats
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get employees and optionally stats
    const [employeeData, stats] = await Promise.all([
      getEmployees(filters),
      includeStats ? getEmployeeStats() : Promise.resolve(null)
    ]);

    const response: {
      success: boolean;
      data: Employee[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      stats?: any;
    } = {
      success: true,
      data: employeeData.employees,
      total: employeeData.total,
      page: employeeData.page,
      limit: employeeData.limit,
      totalPages: employeeData.totalPages
    };

    if (stats) {
      response.stats = stats;
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching employees:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/employees/create to create employees.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/employees/[id] to update employees.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/employees/[id] to delete employees.' },
    { status: 405 }
  );
}