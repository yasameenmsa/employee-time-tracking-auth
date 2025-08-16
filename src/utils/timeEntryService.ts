import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { TimeEntry, TimeEntryResponse, TimeEntryFilters, EmployeeSettingsResponse } from '@/types/timeEntry';

export class TimeEntryService {
  static async getTimeEntriesCollection() {
    const db = await getDatabase();
    return db.collection('timeEntries');
  }

  static async getEmployeeSettingsCollection() {
    const db = await getDatabase();
    return db.collection('employeeSettings');
  }

  // Calculate total hours between clock-in and clock-out
  static calculateTotalHours(clockIn: string, clockOut: string): number {
    const [inHour, inMinute] = clockIn.split(':').map(Number);
    const [outHour, outMinute] = clockOut.split(':').map(Number);
    
    const inTime = inHour * 60 + inMinute;
    const outTime = outHour * 60 + outMinute;
    
    let totalMinutes = outTime - inTime;
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Handle overnight shifts
    }
    
    return Math.round((totalMinutes / 60) * 100) / 100; // Round to 2 decimal places
  }

  // Calculate daily wage
  static calculateDailyWage(totalHours: number, hourlyRate: number): number {
    return Math.round(totalHours * hourlyRate * 100) / 100;
  }

  // Clock in for an employee
  static async clockIn(employeeId: string, employeeName: string, date: string, clockIn: string): Promise<TimeEntryResponse> {
    const collection = await this.getTimeEntriesCollection();
    
    // Check if employee already clocked in today
    const existingEntry = await collection.findOne({
      employeeId,
      date,
      clockOut: { $exists: false }
    });
    
    if (existingEntry) {
      throw new Error('Employee already clocked in today');
    }

    // Get employee's hourly rate
    const hourlyRate = await this.getEmployeeHourlyRate(employeeId);
    
    const newEntry: Omit<TimeEntry, '_id'> = {
      employeeId,
      employeeName,
      date,
      clockIn,
      hourlyRate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newEntry);
    
    return {
      id: result.insertedId.toString(),
      employeeId,
      employeeName,
      date,
      clockIn,
      hourlyRate,
      createdAt: newEntry.createdAt,
      updatedAt: newEntry.updatedAt
    };
  }

  // Clock out for an employee
  static async clockOut(employeeId: string, date: string, clockOut: string): Promise<TimeEntryResponse | null> {
    const collection = await this.getTimeEntriesCollection();
    
    // Find the active clock-in entry
    const entry = await collection.findOne({
      employeeId,
      date,
      clockOut: { $exists: false }
    });
    
    if (!entry) {
      throw new Error('No active clock-in found for today');
    }

    const totalHours = this.calculateTotalHours(entry.clockIn, clockOut);
    const dailyWage = this.calculateDailyWage(totalHours, entry.hourlyRate);
    
    const result = await collection.updateOne(
      { _id: entry._id },
      {
        $set: {
          clockOut,
          totalHours,
          dailyWage,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    const updatedEntry = await collection.findOne({ _id: entry._id });
    if (!updatedEntry) return null;

    return {
      id: updatedEntry._id.toString(),
      employeeId: updatedEntry.employeeId,
      employeeName: updatedEntry.employeeName,
      date: updatedEntry.date,
      clockIn: updatedEntry.clockIn,
      clockOut: updatedEntry.clockOut,
      totalHours: updatedEntry.totalHours,
      hourlyRate: updatedEntry.hourlyRate,
      dailyWage: updatedEntry.dailyWage,
      createdAt: updatedEntry.createdAt,
      updatedAt: updatedEntry.updatedAt
    };
  }

  // Get time entries with filters
  static async getTimeEntries(filters: TimeEntryFilters = {}): Promise<{ entries: TimeEntryResponse[], total: number }> {
    const collection = await this.getTimeEntriesCollection();
    
    const query: Record<string, string | { $regex: string, $options: string } | { $gte?: string, $lte?: string }> = {};
    
    if (filters.employeeId) {
      query.employeeId = filters.employeeId;
    }
    
    if (filters.employeeName) {
      query.employeeName = { $regex: filters.employeeName, $options: 'i' };
    }
    
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      collection.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    return {
      entries: entries.map(entry => ({
        id: entry._id.toString(),
        employeeId: entry.employeeId,
        employeeName: entry.employeeName,
        date: entry.date,
        clockIn: entry.clockIn,
        clockOut: entry.clockOut,
        totalHours: entry.totalHours,
        hourlyRate: entry.hourlyRate,
        dailyWage: entry.dailyWage,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      })),
      total
    };
  }

  // Get employee's current status (clocked in or out)
  static async getEmployeeStatus(employeeId: string, date: string): Promise<{ status: 'clocked-in' | 'clocked-out', entry?: TimeEntryResponse }> {
    const collection = await this.getTimeEntriesCollection();
    
    const activeEntry = await collection.findOne({
      employeeId,
      date,
      clockOut: { $exists: false }
    });

    if (activeEntry) {
      return {
        status: 'clocked-in',
        entry: {
          id: activeEntry._id.toString(),
          employeeId: activeEntry.employeeId,
          employeeName: activeEntry.employeeName,
          date: activeEntry.date,
          clockIn: activeEntry.clockIn,
          hourlyRate: activeEntry.hourlyRate,
          createdAt: activeEntry.createdAt,
          updatedAt: activeEntry.updatedAt
        }
      };
    }

    return { status: 'clocked-out' };
  }

  // Employee Settings Management
  static async setEmployeeHourlyRate(employeeId: string, hourlyRate: number): Promise<EmployeeSettingsResponse> {
    const collection = await this.getEmployeeSettingsCollection();
    
    await collection.updateOne(
      { employeeId },
      {
        $set: {
          hourlyRate,
          updatedAt: new Date()
        },
        $setOnInsert: {
          employeeId,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    const settings = await collection.findOne({ employeeId });
    if (!settings) {
      throw new Error('Failed to create/update employee settings');
    }

    return {
      id: settings._id.toString(),
      employeeId: settings.employeeId,
      hourlyRate: settings.hourlyRate,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt
    };
  }

  static async getEmployeeHourlyRate(employeeId: string): Promise<number> {
    const collection = await this.getEmployeeSettingsCollection();
    
    const settings = await collection.findOne({ employeeId });
    return settings?.hourlyRate || 10; // Default $10/hour
  }

  static async getAllEmployeeSettings(): Promise<EmployeeSettingsResponse[]> {
    const collection = await this.getEmployeeSettingsCollection();
    
    const settings = await collection.find({}).toArray();
    
    return settings.map(setting => ({
      id: setting._id.toString(),
      employeeId: setting.employeeId,
      hourlyRate: setting.hourlyRate,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt
    }));
  }

  // Update existing time entry (admin only)
  static async updateTimeEntry(entryId: string, updates: Partial<Pick<TimeEntry, 'clockIn' | 'clockOut' | 'hourlyRate'>>): Promise<TimeEntryResponse | null> {
    const collection = await this.getTimeEntriesCollection();
    
    const entry = await collection.findOne({ _id: new ObjectId(entryId) });
    if (!entry) {
      throw new Error('Time entry not found');
    }

    const updateData: Record<string, number | string | Date> = {
      ...updates,
      updatedAt: new Date()
    };

    // Recalculate if clock times or hourly rate changed
    if (updates.clockIn || updates.clockOut || updates.hourlyRate) {
      const clockIn = updates.clockIn || entry.clockIn;
      const clockOut = updates.clockOut || entry.clockOut;
      const hourlyRate = updates.hourlyRate || entry.hourlyRate;
      
      if (clockOut) {
        updateData.totalHours = this.calculateTotalHours(clockIn, clockOut);
        updateData.dailyWage = this.calculateDailyWage(updateData.totalHours, hourlyRate);
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(entryId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    const updatedEntry = await collection.findOne({ _id: new ObjectId(entryId) });
    if (!updatedEntry) return null;

    return {
      id: updatedEntry._id.toString(),
      employeeId: updatedEntry.employeeId,
      employeeName: updatedEntry.employeeName,
      date: updatedEntry.date,
      clockIn: updatedEntry.clockIn,
      clockOut: updatedEntry.clockOut,
      totalHours: updatedEntry.totalHours,
      hourlyRate: updatedEntry.hourlyRate,
      dailyWage: updatedEntry.dailyWage,
      createdAt: updatedEntry.createdAt,
      updatedAt: updatedEntry.updatedAt
    };
  }

  // Delete time entry (admin only)
  static async deleteTimeEntry(entryId: string): Promise<boolean> {
    const collection = await this.getTimeEntriesCollection();
    
    const result = await collection.deleteOne({ _id: new ObjectId(entryId) });
    return result.deletedCount > 0;
  }
}