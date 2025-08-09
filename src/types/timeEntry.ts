import { ObjectId } from 'mongodb';

export interface TimeEntry {
  _id?: ObjectId;
  id?: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD format
  clockIn: string; // HH:MM format
  clockOut?: string; // HH:MM format
  totalHours?: number;
  hourlyRate: number;
  dailyWage?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeEntryResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  hourlyRate: number;
  dailyWage?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeEntryFilters {
  employeeId?: string;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeSettings {
  _id?: ObjectId;
  id?: string;
  employeeId: string;
  hourlyRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeSettingsResponse {
  id: string;
  employeeId: string;
  hourlyRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}