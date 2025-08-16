'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { AttendanceRecord, EmployeeAttendanceResponse } from '@/types/attendance';

interface AttendanceWidgetProps {
  employeeId: string;
  className?: string;
}

interface AttendanceState {
  isCheckedIn: boolean;
  currentRecord: AttendanceRecord | null;
  recentRecords: AttendanceRecord[];
  totalHoursToday: number;
  totalHoursWeek: number;
  loading: boolean;
  error: string | null;
}

export default function AttendanceWidget({ employeeId, className = '' }: AttendanceWidgetProps) {
  const themeStyles = useThemeStyles();
  
  const [state, setState] = useState<AttendanceState>({
    isCheckedIn: false,
    currentRecord: null,
    recentRecords: [],
    totalHoursToday: 0,
    totalHoursWeek: 0,
    loading: true,
    error: null
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get recent attendance records (last 7 days)
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(`/api/attendance/employee/${employeeId}?start_date=${startDate}&end_date=${endDate}&limit=10`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الحضور');
      }

      const data: EmployeeAttendanceResponse = await response.json();
      
      // Calculate today's hours
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = data.attendance_records.find(record => 
        new Date(record.check_in_time).toISOString().startsWith(today)
      );
      
      // Calculate week's hours
      const weekHours = data.attendance_records
        .filter(record => record.total_hours !== null)
        .reduce((sum, record) => sum + (record.total_hours || 0), 0);

      setState({
        isCheckedIn: data.current_status === 'checked_in',
        currentRecord: todayRecord || null,
        recentRecords: data.attendance_records.slice(0, 5),
        totalHoursToday: todayRecord?.total_hours || 0,
        totalHoursWeek: weekHours,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'فشل في تحميل بيانات الحضور'
      }));
    }
  }, [employeeId]);

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_id: employeeId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تسجيل الدخول');
      }

      // const data: CheckInResponse = await response.json();
      
      // Refresh attendance data
      await fetchAttendanceData();
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'فشل في تسجيل الدخول'
      }));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      
      const response = await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_id: employeeId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تسجيل الخروج');
      }

      // const data: CheckOutResponse = await response.json();
      
      // Refresh attendance data
      await fetchAttendanceData();
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'فشل في تسجيل الخروج'
      }));
    } finally {
      setActionLoading(false);
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format hours
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}س ${m}د`;
  };

  // Load data on component mount
  useEffect(() => {
    fetchAttendanceData();
  }, [employeeId, fetchAttendanceData]);

  if (state.loading) {
    return (
      <div className={`rounded-lg p-6 ${className}`} style={{ backgroundColor: themeStyles.colors.cardBg }}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeStyles.colors.primaryAccent }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-6 shadow-sm ${className}`} style={{ backgroundColor: themeStyles.colors.cardBg }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeStyles.colors.textPrimary }}>
          <Clock className="h-5 w-5" style={{ color: themeStyles.colors.primaryAccent }} />
          الحضور
        </h3>
        <div className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: themeStyles.colors.errorLight, borderColor: themeStyles.colors.error, border: '1px solid' }}>
          <p className="text-sm" style={{ color: themeStyles.colors.error }}>{state.error}</p>
        </div>
      )}

      {/* Check-in/Check-out Button */}
      <div className="mb-6">
        {state.isCheckedIn ? (
          <button
            onClick={handleCheckOut}
            disabled={actionLoading}
            className="w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: actionLoading ? themeStyles.colors.errorLight : themeStyles.colors.error,
              color: 'white',
              opacity: actionLoading ? 0.6 : 1
            }}
          >
            {actionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            تسجيل الانصراف
          </button>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={actionLoading}
            className="w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: actionLoading ? themeStyles.colors.successLight : themeStyles.colors.success,
              color: 'white',
              opacity: actionLoading ? 0.6 : 1
            }}
          >
            {actionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
           تسجيل الحضور
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-6">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: state.isCheckedIn ? themeStyles.colors.successLight : themeStyles.colors.cardBg,
            color: state.isCheckedIn ? themeStyles.colors.success : themeStyles.colors.textSecondary,
            border: `1px solid ${state.isCheckedIn ? themeStyles.colors.success : themeStyles.colors.textSecondary}`
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: state.isCheckedIn ? themeStyles.colors.success : themeStyles.colors.textSecondary
            }}
          ></div>
          {state.isCheckedIn ? 'مسجل الحضور' : 'مسجل الانصراف'}
        </div>
      </div>

      {/* Hours Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: themeStyles.colors.primaryAccent }}>
            {formatHours(state.totalHoursToday)}
          </div>
          <div className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>اليوم</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: themeStyles.colors.success }}>
            {formatHours(state.totalHoursWeek)}
          </div>
          <div className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>هذا الأسبوع</div>
        </div>
      </div>

      {/* Recent Records */}
      {state.recentRecords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: themeStyles.colors.textPrimary }}>
            <Calendar className="h-4 w-4" style={{ color: themeStyles.colors.primaryAccent }} />
            النشاط الأخير
          </h4>
          <div className="space-y-2">
            {state.recentRecords.slice(0, 3).map((record, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div style={{ color: themeStyles.colors.textSecondary }}>
                  {new Date(record.check_in_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {record.total_hours && (
                    <span className="font-medium" style={{ color: themeStyles.colors.textPrimary }}>
                      {formatHours(record.total_hours)}
                    </span>
                  )}
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: record.status === 'checked_in' ? themeStyles.colors.success : themeStyles.colors.textSecondary
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}