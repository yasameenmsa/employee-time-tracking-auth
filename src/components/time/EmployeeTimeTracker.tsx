'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, DollarSign, Play, Square, RefreshCw } from 'lucide-react';
import { TimeEntryResponse } from '@/types/timeEntry';

interface EmployeeTimeTrackerProps {
  userId: string;
  userName: string;
}

interface EmployeeStatus {
  status: 'clocked-in' | 'clocked-out';
  entry?: TimeEntryResponse;
  hourlyRate: number;
  date: string;
}

export default function EmployeeTimeTracker({ userId, userName }: EmployeeTimeTrackerProps) {
  const [status, setStatus] = useState<EmployeeStatus | null>(null);
  const [entries, setEntries] = useState<TimeEntryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadEmployeeStatus = async () => {
    try {
      const response = await fetch(`/api/time/status?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load status');
      }
    } catch (err) {
      setError('Failed to load employee status');
    }
  };

  const loadTimeEntries = async () => {
    try {
      const response = await fetch('/api/time/entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load entries');
      }
    } catch (err) {
      setError('Failed to load time entries');
    }
  };

  // Load employee status and entries
  useEffect(() => {
    loadEmployeeStatus();
    loadTimeEntries();
  }, [selectedDate, loadEmployeeStatus, loadTimeEntries]);

  const handleClockIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const clockInTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      const response = await fetch('/api/time/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          clockIn: clockInTime
        })
      });

      if (response.ok) {
        await loadEmployeeStatus();
        await loadTimeEntries();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to clock in');
      }
    } catch (err) {
      setError('Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const clockOutTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      const response = await fetch('/api/time/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          clockOut: clockOutTime
        })
      });

      if (response.ok) {
        await loadEmployeeStatus();
        await loadTimeEntries();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to clock out');
      }
    } catch (err) {
      setError('Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              مرحباً، {userName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              نظام تتبع الوقت للموظفين
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono text-blue-600 dark:text-blue-400">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentTime.toLocaleDateString('ar-SA')}
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => {
              loadEmployeeStatus();
              loadTimeEntries();
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Status and Actions */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Status */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">
                  الحالة الحالية
                </span>
              </div>
              <div className={`text-lg font-semibold ${
                status.status === 'clocked-in' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {status.status === 'clocked-in' ? 'مسجل الدخول' : 'مسجل الخروج'}
              </div>
              {status.entry && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  بدء العمل: {status.entry.clockIn}
                </div>
              )}
            </div>

            {/* Hourly Rate */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900 dark:text-white">
                  الأجر بالساعة
                </span>
              </div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(status.hourlyRate)}
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {status.status === 'clocked-in' ? (
                  <Square className="w-5 h-5 text-red-600" />
                ) : (
                  <Play className="w-5 h-5 text-green-600" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  إجراء
                </span>
              </div>
              <button
                onClick={status.status === 'clocked-in' ? handleClockOut : handleClockIn}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  status.status === 'clocked-in'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  status.status === 'clocked-in' ? 'تسجيل الانصراف' : 'تسجيل الحضور'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Time Entries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            سجل الحضور والانصراف
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  تسجيل الدخول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  تسجيل الخروج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ساعات العمل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الأجر اليومي
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    لا توجد سجلات حضور
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(entry.date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.clockOut || (
                        <span className="text-yellow-600 dark:text-yellow-400">جاري العمل</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.totalHours ? `${entry.totalHours} ساعة` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.dailyWage ? formatCurrency(entry.dailyWage) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}