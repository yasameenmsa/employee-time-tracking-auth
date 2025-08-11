import { Db, Collection, ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { AttendanceRecord, AttendanceStats, TimeCalculation, EmployeeAttendanceSummary } from '@/types/attendance';

export class AttendanceService {
  private static instance: AttendanceService;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  private async getDatabase(): Promise<Db> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  private getAttendanceCollection(): Promise<Collection<AttendanceRecord>> {
    return this.getDatabase().then(db => db.collection<AttendanceRecord>('attendance'));
  }

  private getUsersCollection(): Promise<Collection> {
    return this.getDatabase().then(db => db.collection('users'));
  }

  /**
   * Calculate work hours between check-in and check-out times
   */
  public calculateWorkHours(checkIn: Date, checkOut: Date): number {
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Format hours into readable string
   */
  public formatHours(hours: number): TimeCalculation {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return {
      hours: wholeHours,
      minutes,
      formatted: `${wholeHours}h ${minutes}m`
    };
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  public getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Check if employee is currently checked in
   */
  public async isEmployeeCheckedIn(employeeId: string): Promise<boolean> {
    const collection = await this.getAttendanceCollection();
    const today = this.getTodayDate();
    
    const record = await collection.findOne({
      employee_id: new ObjectId(employeeId),
      date: today,
      status: 'checked_in'
    });

    return !!record;
  }

  /**
   * Get current attendance record for employee today
   */
  public async getCurrentAttendanceRecord(employeeId: string): Promise<AttendanceRecord | null> {
    const collection = await this.getAttendanceCollection();
    const today = this.getTodayDate();
    
    const record = await collection.findOne({
      employee_id: new ObjectId(employeeId),
      date: today
    });

    return record;
  }

  /**
   * Create check-in record
   */
  public async checkIn(employeeId: string, timestamp?: Date): Promise<AttendanceRecord> {
    const collection = await this.getAttendanceCollection();
    const checkInTime = timestamp || new Date();
    const today = this.getTodayDate();

    // Check if already checked in today
    const existingRecord = await this.getCurrentAttendanceRecord(employeeId);
    if (existingRecord && existingRecord.status === 'checked_in') {
      throw new Error('Employee is already checked in today');
    }

    const attendanceRecord: AttendanceRecord = {
      employee_id: new ObjectId(employeeId),
      date: today,
      check_in_time: checkInTime,
      check_out_time: null,
      total_hours: null,
      status: 'checked_in',
      notes: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await collection.insertOne(attendanceRecord);
    return { ...attendanceRecord, _id: result.insertedId.toString() };
  }

  /**
   * Create check-out record
   */
  public async checkOut(employeeId: string, timestamp?: Date): Promise<AttendanceRecord> {
    const collection = await this.getAttendanceCollection();
    const checkOutTime = timestamp || new Date();
    const today = this.getTodayDate();

    // Find today's check-in record
    const record = await collection.findOne({
      employee_id: new ObjectId(employeeId),
      date: today,
      status: 'checked_in'
    });

    if (!record) {
      throw new Error('No active check-in record found for today');
    }

    const totalHours = this.calculateWorkHours(record.check_in_time, checkOutTime);

    const updatedRecord = await collection.findOneAndUpdate(
      { _id: record._id },
      {
        $set: {
          check_out_time: checkOutTime,
          total_hours: totalHours,
          status: 'checked_out',
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!updatedRecord) {
      console.error('Failed to update attendance record:', {
        recordId: record._id,
        employeeId,
        checkOutTime,
        totalHours,
        originalRecord: record
      });
      throw new Error(`Failed to update attendance record for employee ${employeeId}`);
    }

    return updatedRecord;
  }

  /**
   * Get employee attendance records with optional date filtering
   */
  public async getEmployeeAttendance(
    employeeId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 50
  ): Promise<AttendanceRecord[]> {
    const collection = await this.getAttendanceCollection();
    
    const query: { employee_id: ObjectId; date?: { $gte?: string; $lte?: string } } = { employee_id: new ObjectId(employeeId) };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const records = await collection
      .find(query)
      .sort({ date: -1, check_in_time: -1 })
      .limit(limit)
      .toArray();

    return records;
  }

  /**
   * Calculate attendance statistics for an employee
   */
  public async getEmployeeStats(employeeId: string): Promise<AttendanceStats> {
    const collection = await this.getAttendanceCollection();
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Daily hours (today)
    const todayRecord = await this.getCurrentAttendanceRecord(employeeId);
    const dailyHours = todayRecord?.total_hours || 0;

    // Weekly hours
    const weeklyRecords = await collection
      .find({
        employee_id: new ObjectId(employeeId),
        date: { $gte: startOfWeek.toISOString().split('T')[0] },
        status: 'checked_out'
      })
      .toArray();
    
    const weeklyHours = weeklyRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0);

    // Monthly hours
    const monthlyRecords = await collection
      .find({
        employee_id: new ObjectId(employeeId),
        date: { $gte: startOfMonth.toISOString().split('T')[0] },
        status: 'checked_out'
      })
      .toArray();
    
    const monthlyHours = monthlyRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0);
    const averageDailyHours = monthlyRecords.length > 0 ? monthlyHours / monthlyRecords.length : 0;

    return {
      daily_hours: dailyHours,
      weekly_hours: weeklyHours,
      monthly_hours: monthlyHours,
      average_daily_hours: Math.round(averageDailyHours * 100) / 100,
      total_employees: 0,
      present_today: 0,
      absent_today: 0,
      late_today: 0,
      average_hours: Math.round(averageDailyHours * 100) / 100
    };
  }

  /**
   * Get all employees attendance summary for admin overview
   */
  public async getAdminOverview(date?: string, department?: string): Promise<EmployeeAttendanceSummary[]> {
    const targetDate = date || this.getTodayDate();
    const usersCollection = await this.getUsersCollection();
    const attendanceCollection = await this.getAttendanceCollection();

    // Get all users (filter by department if specified)
    const userQuery: { department?: string } = {};
    if (department) {
      userQuery.department = department;
    }

    const users = await usersCollection.find(userQuery).toArray();
    const summaries: EmployeeAttendanceSummary[] = [];

    for (const user of users) {
      // Get today's attendance
      const todayRecord = await attendanceCollection.findOne({
        employee_id: user._id,
        date: targetDate
      });

      // Get weekly hours
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const weeklyRecords = await attendanceCollection
        .find({
          employee_id: user._id,
          date: { $gte: startOfWeek.toISOString().split('T')[0] },
          status: 'checked_out'
        })
        .toArray();
      
      const weeklyHours = weeklyRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0);

      // Determine more accurate status
      let current_status: 'checked_in' | 'checked_out' = 'checked_out';
      if (todayRecord && (todayRecord.status === 'checked_in' || todayRecord.status === 'checked_out')) {
        current_status = todayRecord.status;
      }

      summaries.push({
        employee_id: user._id.toString(),
        employee_name: user.name || user.email,
        employee_email: user.email,
        department: user.department,
        current_status,
        today_hours: todayRecord?.total_hours || 0,
        weekly_hours: weeklyHours,
        check_in_time: todayRecord?.check_in_time?.toISOString(),
        check_out_time: todayRecord?.check_out_time?.toISOString()
      });
    }

    return summaries;
  }

  /**
   * Get attendance summary statistics
   */
  public async getAttendanceSummary(date?: string) {
    const targetDate = date || this.getTodayDate();
    const collection = await this.getAttendanceCollection();

    const records = await collection
      .find({ date: targetDate })
      .toArray();

    const checkedInCount = records.filter(r => r.status === 'checked_in').length;
    const checkedOutCount = records.filter(r => r.status === 'checked_out').length;
    const totalHoursToday = records
      .filter(r => r.total_hours)
      .reduce((sum, r) => sum + (r.total_hours || 0), 0);
    
    const averageHoursToday = checkedOutCount > 0 ? totalHoursToday / checkedOutCount : 0;

    return {
      total_employees: records.length,
      checked_in_count: checkedInCount,
      checked_out_count: checkedOutCount,
      average_hours_today: Math.round(averageHoursToday * 100) / 100,
      total_hours_today: Math.round(totalHoursToday * 100) / 100
    };
  }
}

export const attendanceService = AttendanceService.getInstance();