// Report-related TypeScript interfaces

export interface AttendanceReportFilter {
  employeeId?: string;
  startDate: Date;
  endDate: Date;
  department?: string;
  status?: 'present' | 'absent' | 'late' | 'early_departure';
}

export interface DailyAttendanceSummary {
  date: string; // YYYY-MM-DD format
  employeeId: string;
  employeeName: string;
  department: string;
  clockIn?: Date;
  clockOut?: Date;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  overtimeHours: number;
  breakDuration: number;
}

export interface WeeklyAttendanceSummary {
  weekStartDate: string; // YYYY-MM-DD format
  weekEndDate: string;
  employeeId: string;
  employeeName: string;
  department: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  totalHours: number;
  totalOvertimeHours: number;
  averageHoursPerDay: number;
}

export interface MonthlyAttendanceSummary {
  month: string; // YYYY-MM format
  employeeId: string;
  employeeName: string;
  department: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  totalHours: number;
  totalOvertimeHours: number;
  averageHoursPerDay: number;
  attendanceRate: number; // percentage
}

export interface AttendanceReport {
  reportType: 'daily' | 'weekly' | 'monthly';
  generatedAt: Date;
  filter: AttendanceReportFilter;
  summary: {
    totalEmployees: number;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    averageAttendanceRate: number;
  };
  data: DailyAttendanceSummary[] | WeeklyAttendanceSummary[] | MonthlyAttendanceSummary[];
}

export interface ReportMetadata {
  reportId: string;
  reportType: 'attendance' | 'payroll' | 'performance';
  generatedBy: string; // user ID
  generatedAt: Date;
  parameters: Record<string, any>;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
}

export interface AttendanceAnalytics {
  period: string;
  totalEmployees: number;
  averageAttendanceRate: number;
  punctualityRate: number;
  absenteeismRate: number;
  overtimeHours: number;
  departmentBreakdown: {
    department: string;
    attendanceRate: number;
    employeeCount: number;
  }[];
  trends: {
    date: string;
    attendanceRate: number;
    presentCount: number;
    absentCount: number;
  }[];
}