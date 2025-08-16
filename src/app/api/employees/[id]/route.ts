import { NextRequest, NextResponse } from 'next/server';
import { 
  getEmployeeById, 
  updateEmployee, 
  deactivateEmployee, 
  reactivateEmployee,
  deleteEmployeePermanently
} from '@/utils/employeeService';
import { validateUpdateEmployee, sanitizeEmployeeData } from '@/utils/employeeValidation';
import { UpdateEmployeeRequest } from '@/types/employee';
import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { UserService } from '@/utils/userService';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Retrieve a specific employee
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Parse and verify authentication
    const cookieHeader = request.headers.get('cookie');
    const token = parseAuthCookie(cookieHeader);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user details to check permissions
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check permissions - admin/HR can view any employee, employees can only view themselves
    const { id } = await params;
    if (user.role === 'employees' && user.id !== id) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Employees can only view their own profile.' },
        { status: 403 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID format' },
        { status: 400 }
      );
    }

    // Get employee
    const employee = await getEmployeeById(id);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Return employee data (exclude sensitive information if needed)
    const responseEmployee = {
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      hourlyRate: employee.hourlyRate,
      startDate: employee.startDate,
      isActive: employee.isActive,
      phone: employee.phone,
      address: employee.address,
      emergencyContact: employee.emergencyContact,
      position: employee.position,
      manager: employee.manager,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };

    return NextResponse.json(
      {
        success: true,
        employee: responseEmployee
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an employee
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Parse and verify authentication
    const cookieHeader = request.headers.get('cookie');
    const token = parseAuthCookie(cookieHeader);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user details to check permissions
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID format' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await getEmployeeById(id);
    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'employees' && user.id !== id) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Employees can only update their own profile.' },
        { status: 403 }
      );
    }

    // Parse and sanitize request body
    const body = await request.json();
    const sanitizedData = sanitizeEmployeeData(body);

    // Validate update data with Zod
    const validation = validateUpdateEmployee(sanitizedData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const updateData = validation.data as UpdateEmployeeRequest;

    // Additional role-based restrictions
    if (user.role === 'HR') {
      // HR cannot change admin roles or create admin accounts
      if (updateData.role === 'admin' || existingEmployee.role === 'admin') {
        return NextResponse.json(
          { error: 'HR users cannot modify admin accounts' },
          { status: 403 }
        );
      }
    }

    if (user.role === 'employees') {
      // Employees can only update limited fields
      const allowedFields = ['phone', 'address', 'emergencyContact'];
      const updateFields = Object.keys(updateData);
      const restrictedFields = updateFields.filter(field => !allowedFields.includes(field));
      
      if (restrictedFields.length > 0) {
        return NextResponse.json(
          { error: `Employees can only update: ${allowedFields.join(', ')}` },
          { status: 403 }
        );
      }
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    // Update employee
    const updatedEmployee = await updateEmployee(id, updateData);
    if (!updatedEmployee) {
      return NextResponse.json(
        { error: 'Failed to update employee' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Employee updated successfully',
        employee: updatedEmployee
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Error updating employee:', error);

    if (error instanceof Error && error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate or permanently delete an employee
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Parse and verify authentication
    const cookieHeader = request.headers.get('cookie');
    const token = parseAuthCookie(cookieHeader);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user details to check permissions
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only admin and HR can delete employees
    if (user.role !== 'admin' && user.role !== 'HR') {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admin and HR can delete employees.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID format' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await getEmployeeById(id);
    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // HR cannot delete admin accounts
    if (user.role === 'HR' && existingEmployee.role === 'admin') {
      return NextResponse.json(
        { error: 'HR users cannot delete admin accounts' },
        { status: 403 }
      );
    }

    // Check query parameter for permanent deletion
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    let result;
    if (permanent) {
      // Only admin can permanently delete
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only admin can permanently delete employees' },
          { status: 403 }
        );
      }
      result = await deleteEmployeePermanently(id);
    } else {
      // Soft delete (deactivate)
      result = await deactivateEmployee(id);
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete employee' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: permanent 
          ? 'Employee permanently deleted successfully'
          : 'Employee deactivated successfully'
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}