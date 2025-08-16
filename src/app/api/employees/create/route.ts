import { NextRequest, NextResponse } from 'next/server';
import { createEmployee } from '@/utils/employeeService';
import { CreateEmployeeRequest } from '@/types/employee';
import { authenticateRequest } from '@/utils/jwt';
import { UserService } from '@/utils/userService';
import { validateCreateEmployee, sanitizeEmployeeData } from '@/utils/employeeValidation';

export async function POST(request: NextRequest) {
  try {
    // Parse and verify authentication
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.payload) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = authResult.payload;

    // Get user details to check permissions
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to create employees (admin or HR only)
    if (user.role !== 'admin' && user.role !== 'HR') {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admin and HR can create employees.' },
        { status: 403 }
      );
    }

    // Parse and sanitize request body
    const body = await request.json();
    const sanitizedData = sanitizeEmployeeData(body);

    // Validate employee data with Zod
    const validation = validateCreateEmployee(sanitizedData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data!; // Safe because validation.success is true
    const employeeData = {
      ...validatedData,
      startDate: validatedData.startDate instanceof Date 
        ? validatedData.startDate.toISOString().split('T')[0] 
        : validatedData.startDate
    } as CreateEmployeeRequest;

    // Additional role-based validation
    if (user.role === 'HR' && employeeData.role === 'admin') {
      return NextResponse.json(
        { error: 'HR users cannot create admin accounts' },
        { status: 403 }
      );
    }

    // Additional business logic validations (Zod handles basic validation)
    // Note: startDate and hourlyRate validation is now handled by Zod schema

    // Create the employee
    const newEmployee = await createEmployee(employeeData);

    // Return success response (exclude sensitive data if any)
    const responseEmployee = {
      _id: newEmployee._id,
      employeeId: newEmployee.employeeId,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      hourlyRate: newEmployee.hourlyRate,
      startDate: newEmployee.startDate,
      isActive: newEmployee.isActive,
      phone: newEmployee.phone,
      position: newEmployee.position,
      manager: newEmployee.manager,
      createdAt: newEmployee.createdAt,
      updatedAt: newEmployee.updatedAt
    };

    return NextResponse.json(
      {
        message: 'Employee created successfully',
        employee: responseEmployee
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Error creating employee:', error);

    // Handle specific MongoDB errors
    if (error instanceof Error && error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.message?.includes('Validation')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create employees.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create employees.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create employees.' },
    { status: 405 }
  );
}