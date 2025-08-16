export interface Employee {
  _id?: string;
  employeeId: string; // Unique employee identifier
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  department: string;
  hourlyRate: number;
  startDate: Date;
  endDate?: Date; // Optional for terminated employees
  isActive: boolean;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  position?: string; // Job title
  manager?: string; // Manager's employee ID
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  department: string;
  hourlyRate: number;
  startDate: string; // ISO date string
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  position?: string;
  manager?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'hr' | 'employee';
  department?: string;
  hourlyRate?: number;
  startDate?: string;
  endDate?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  position?: string;
  manager?: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  role?: 'admin' | 'hr' | 'employee';
  isActive?: boolean;
  manager?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'department' | 'startDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentBreakdown: {
    department: string;
    count: number;
  }[];
  roleBreakdown: {
    role: string;
    count: number;
  }[];
}

// Validation schemas for employee data
export const EMPLOYEE_ROLES = ['admin', 'hr', 'employee'] as const;
export type EmployeeRole = typeof EMPLOYEE_ROLES[number];

// Common departments (can be customized per company)
export const DEFAULT_DEPARTMENTS = [
  'Human Resources',
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Customer Support',
  'Legal',
  'IT',
  'Administration'
] as const;