'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, DollarSign, Users, Calendar, RefreshCw, Settings } from 'lucide-react';
import { TimeEntryResponse, EmployeeSettingsResponse } from '@/types/timeEntry';

interface AdminTimeManagerProps {
  userId: string;
  userName: string;
}

interface TimeEntriesData {
  entries: TimeEntryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminTimeManager({ userId, userName }: AdminTimeManagerProps) {
  const [entries, setEntries] = useState<TimeEntriesData | null>(null);
  const [employeeSettings, setEmployeeSettings] = useState<EmployeeSettingsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntryResponse | null>(null);
  const [newHourlyRate, setNewHourlyRate] = useState('');
  const [selectedEmployeeForRate, setSelectedEmployeeForRate] = useState('');

  useEffect(() => {
    loadTimeEntries();
    loadEmployeeSettings();
  }, [currentPage, searchTerm, startDate, endDate, selectedEmployeeId]);

  const loadTimeEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (searchTerm) params.append('employeeName', searchTerm);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (selectedEmployeeId) params.append('employeeId', selectedEmployeeId);

      const response = await fetch(`/api/time/entries?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load entries');
      }
    } catch (err) {
      setError('Failed to load time entries');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeSettings = async () => {
    try {
      const response = await fetch('/api/time/settings');
      if (response.ok) {
        const data = await response.json();
        setEmployeeSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load employee settings:', err);
    }
  };

  const handleUpdateEntry = async (entryId: string, updates: any) => {
    try {
      const response = await fetch('/api/time/entries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId, updates })
      });

      if (response.ok) {
        await loadTimeEntries();
        setEditingEntry(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update entry');
      }
    } catch (err) {
      setError('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السجل؟')) return;

    try {
      const response = await fetch('/api/time/entries', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId })
      });

      if (response.ok) {
        await loadTimeEntries();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete entry');
      }
    } catch (err) {
      setError('Failed to delete entry');
    }
  };

  const handleUpdateHourlyRate = async () => {
    if (!selectedEmployeeForRate || !newHourlyRate) {
      setError('يرجى اختيار موظف وإدخال الأجر بالساعة');
      return;
    }

    const rate = parseFloat(newHourlyRate);
    if (isNaN(rate) || rate <= 0) {
      setError('يرجى إدخال أجر صحيح');
      return;
    }

    try {
      const response = await fetch('/api/time/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: selectedEmployeeForRate,
          hourlyRate: rate
        })
      });

      if (response.ok) {
        await loadEmployeeSettings();
        setNewHourlyRate('');
        setSelectedEmployeeForRate('');
        setShowSettingsModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update hourly rate');
      }
    } catch (err) {
      setError('Failed to update hourly rate');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedEmployeeId('');
    setCurrentPage(1);
  };

  // Get unique employees from entries for filter dropdown
  const uniqueEmployees = entries ? 
    Array.from(new Set(entries.entries.map(entry => ({ id: entry.employeeId, name: entry.employeeName }))))
      .filter((employee, index, self) => self.findIndex(e => e.id === employee.id) === index)
    : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              إدارة أوقات الموظفين
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              عرض وإدارة سجلات الحضور والانصراف
            </p>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Settings className="w-4 h-4" />
            إعدادات الأجور
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث بالاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">جميع الموظفين</option>
            {uniqueEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="من تاريخ"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="إلى تاريخ"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              إعادة تعيين
            </button>
            <button
              onClick={loadTimeEntries}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
            >
              إغلاق
            </button>
          </div>
        )}
      </div>

      {/* Time Entries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              سجلات الحضور والانصراف
            </h2>
            {entries && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                عرض {entries.entries.length} من {entries.total} سجل
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  اسم الموظف
                </th>
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
                  الأجر بالساعة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الأجر اليومي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : !entries || entries.entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    لا توجد سجلات حضور
                  </td>
                </tr>
              ) : (
                entries.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {entry.employeeName}
                    </td>
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
                      {formatCurrency(entry.hourlyRate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.dailyWage ? formatCurrency(entry.dailyWage) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {entries && entries.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                صفحة {entries.page} من {entries.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(entries.totalPages, currentPage + 1))}
                  disabled={currentPage === entries.totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إعدادات الأجور
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الموظف
                </label>
                <select
                  value={selectedEmployeeForRate}
                  onChange={(e) => setSelectedEmployeeForRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">اختر موظف</option>
                  {uniqueEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأجر بالساعة ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newHourlyRate}
                  onChange={(e) => setNewHourlyRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10.00"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateHourlyRate}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                حفظ
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setNewHourlyRate('');
                  setSelectedEmployeeForRate('');
                }}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              تعديل السجل
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تسجيل الدخول
                </label>
                <input
                  type="time"
                  defaultValue={editingEntry.clockIn}
                  onChange={(e) => setEditingEntry({...editingEntry, clockIn: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تسجيل الخروج
                </label>
                <input
                  type="time"
                  defaultValue={editingEntry.clockOut || ''}
                  onChange={(e) => setEditingEntry({...editingEntry, clockOut: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأجر بالساعة ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingEntry.hourlyRate}
                  onChange={(e) => setEditingEntry({...editingEntry, hourlyRate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdateEntry(editingEntry.id, {
                  clockIn: editingEntry.clockIn,
                  clockOut: editingEntry.clockOut,
                  hourlyRate: editingEntry.hourlyRate
                })}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                حفظ التغييرات
              </button>
              <button
                onClick={() => setEditingEntry(null)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}