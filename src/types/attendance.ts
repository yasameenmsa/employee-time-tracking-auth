import { ObjectId } from 'mongodb';

export interface AttendanceRecord {
  _id?: string;
  employee_id: string | ObjectId;
  date: string; // Date in YYYY-MM-DD format
  check_in_time: Date;
  check_out_time?: Date | null;
  total_hours?: number | null;
  status: 'checked_in' | 'checked_out' | 'incomplete';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CheckInRequest {
  employee_id: string;
  timestamp?: string; // ISO timestamp (optional, defaults to server time)
}

export interface CheckInResponse {
  success: boolean;
  attendance_id: string;
  check_in_time: string;
  message?: string;
}

export interface CheckOutRequest {
  employee_id: string;
  timestamp?: string; // ISO timestamp (optional, defaults to server time)
}

export interface CheckOutResponse {
  success: boolean;
  attendance_id: string;
  check_out_time: string;
  total_hours: number;
  message?: string;
}

export interface EmployeeAttendanceQuery {
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface EmployeeAttendanceResponse {
  attendance_records: AttendanceRecord[];
  total_hours_period: number;
  current_status: 'checked_in' | 'checked_out';
}

export interface AdminOverviewQuery {
  date?: string; // Specific date (ISO format, defaults to today)
  department?: string;
}

export interface EmployeeAttendanceSummary {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  username?: string;
  department?: string;
  current_status: 'checked_in' | 'checked_out';
  today_hours: number;
  weekly_hours: number;
  check_in_time?: string;
  check_out_time?: string;
}

export interface AdminOverviewResponse {
  employees: EmployeeAttendanceSummary[];
  summary: {
    total_employees: number;
    checked_in_count: number;
    checked_out_count: number;
    average_hours_today: number;
    total_hours_today: number;
  };
}

export interface AttendanceStats {
  daily_hours: number;
  weekly_hours: number;
  monthly_hours: number;
  average_daily_hours: number;
  total_employees: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  average_hours: number;
}

export interface TimeCalculation {
  hours: number;
  minutes: number;
  formatted: string; // e.g., "8h 30m"
}

// Utility type for attendance status
export type AttendanceStatus = 'checked_in' | 'checked_out' | 'incomplete';

// Error response type
export interface AttendanceError {
  success: false;
  error: string;
  code?: string;
}