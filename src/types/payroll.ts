// Payroll-related TypeScript interfaces and types

// Base employee payroll information
export interface EmployeePayrollInfo {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  hourlyRate: number;
  salaryType: 'hourly' | 'salary' | 'contract';
  overtimeRate?: number; // Default to 1.5x hourly rate if not specified
}

// Time tracking data for payroll calculation
export interface PayrollTimeData {
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  regularHours: number;
  overtimeHours: number;
  sickLeaveHours?: number;
  vacationHours?: number;
  holidayHours?: number;
}

// Deduction types and amounts
export interface PayrollDeductions {
  employeeId: string;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  healthInsurance?: number;
  retirement401k?: number;
  otherDeductions?: {
    name: string;
    amount: number;
  }[];
}

// Payroll calculation result
export interface PayrollCalculation {
  employeeId: string;
  employeeName: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  deductionsBreakdown: PayrollDeductions;
  calculatedAt: Date;
}

// Payroll period configuration
export interface PayrollPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payroll summary for reporting
export interface PayrollSummary {
  payrollPeriodId: string;
  totalEmployees: number;
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  departmentBreakdown: {
    department: string;
    employeeCount: number;
    totalGrossPay: number;
    totalNetPay: number;
  }[];
}

// API request/response types
export interface CreatePayrollRequest {
  payPeriodStart: string; // ISO date string
  payPeriodEnd: string; // ISO date string
  employeeIds?: string[]; // Optional: specific employees, or all if not provided
}

export interface PayrollCalculationRequest {
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  overrideHours?: {
    regularHours?: number;
    overtimeHours?: number;
  };
}

export interface PayrollResponse {
  success: boolean;
  data?: PayrollCalculation | PayrollCalculation[] | PayrollSummary;
  error?: string;
  message?: string;
}

// Payroll configuration settings
export interface PayrollSettings {
  companyId: string;
  defaultOvertimeRate: number; // e.g., 1.5 for time and a half
  payFrequency: 'weekly' | 'biweekly' | 'monthly' | 'semimonthly';
  overtimeThreshold: number; // Hours per week before overtime kicks in
  taxSettings: {
    federalTaxRate: number;
    stateTaxRate: number;
    socialSecurityRate: number;
    medicareRate: number;
  };
  defaultDeductions: {
    healthInsurance: number;
    retirement401k: number;
  };
}

// Database model for payroll records
export interface PayrollRecord {
  _id?: string;
  employeeId: string;
  payrollPeriodId: string;
  calculation: PayrollCalculation;
  status: 'draft' | 'approved' | 'paid';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}