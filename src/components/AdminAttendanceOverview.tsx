'use client';

import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Filter, Download, Search } from 'lucide-react';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { AdminOverviewResponse, EmployeeAttendanceSummary, AttendanceStats } from '@/types/attendance';

interface AdminAttendanceOverviewProps {
  className?: string;
}

interface OverviewState {
  employees: EmployeeAttendanceSummary[];
  summary: AttendanceStats;
  loading: boolean;
  error: string | null;
  selectedDate: string;
  selectedDepartment: string;
  searchTerm: string;
}

export default function AdminAttendanceOverview({ className = '' }: AdminAttendanceOverviewProps) {
  const themeStyles = useThemeStyles();
  
  const [state, setState] = useState<OverviewState>({
    employees: [],
    summary: {
      total_employees: 0,
      present_today: 0,
      absent_today: 0,
      late_today: 0,
      average_hours: 0
    },
    loading: true,
    error: null,
    selectedDate: new Date().toISOString().split('T')[0],
    selectedDepartment: '',
    searchTerm: ''
  });

  // Fetch attendance overview data
  const fetchOverviewData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams();
      if (state.selectedDate) params.append('date', state.selectedDate);
      if (state.selectedDepartment) params.append('department', state.selectedDepartment);

      const response = await fetch(`/api/attendance/admin/overview?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب نظرة عامة على الحضور');
      }

      const data: AdminOverviewResponse = await response.json();
      
      setState(prev => ({
        ...prev,
        employees: data.employees,
        summary: data.summary,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'فشل في تحميل بيانات الحضور'
      }));
    }
  };

  // Filter employees based on search term
  const filteredEmployees = state.employees.filter(employee =>
    employee.employee_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  // Format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format hours
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}س ${m}د`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { bg: 'bg-green-100', text: 'text-green-800', label: 'حاضر' },
      absent: { bg: 'bg-red-100', text: 'text-red-800', label: 'غائب' },
      late: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'متأخر' },
      checked_in: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'مسجل الدخول' },
      checked_out: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'مسجل الخروج' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['اسم الموظف', 'القسم', 'تسجيل الدخول', 'تسجيل الخروج', 'ساعات العمل', 'الحالة'];
    const csvData = filteredEmployees.map(emp => [
      emp.employee_name,
      emp.department,
      formatTime(emp.check_in_time),
      formatTime(emp.check_out_time),
      emp.hours_worked ? formatHours(emp.hours_worked) : '--',
      emp.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${state.selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchOverviewData();
  }, [state.selectedDate, state.selectedDepartment]);

  if (state.loading) {
    return (
      <div className={`rounded-lg p-6 ${className}`} style={{ backgroundColor: themeStyles.colors.cardBg }}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeStyles.colors.primaryAccent }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-sm ${className}`} style={{ backgroundColor: themeStyles.colors.cardBg }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            نظرة عامة على الحضور
          </h2>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            تصدير CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              التاريخ
            </label>
            <input
              type="date"
              value={state.selectedDate}
              onChange={(e) => setState(prev => ({ ...prev, selectedDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              القسم
            </label>
            <select
              value={state.selectedDepartment}
              onChange={(e) => setState(prev => ({ ...prev, selectedDepartment: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الأقسام</option>
              <option value="Engineering">الهندسة</option>
              <option value="Marketing">التسويق</option>
              <option value="Sales">المبيعات</option>
              <option value="HR">الموارد البشرية</option>
              <option value="Finance">المالية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البحث
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن الموظفين..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="p-6">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{state.summary.total_employees}</div>
            <div className="text-sm text-gray-500">إجمالي الموظفين</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{state.summary.present_today}</div>
            <div className="text-sm text-gray-500">حاضر اليوم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{state.summary.absent_today}</div>
            <div className="text-sm text-gray-500">غائب اليوم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{state.summary.late_today}</div>
            <div className="text-sm text-gray-500">متأخر اليوم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatHours(state.summary.average_hours)}</div>
            <div className="text-sm text-gray-500">متوسط الساعات</div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="p-6">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لم يتم العثور على موظفين</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموظف
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القسم
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تسجيل الدخول
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تسجيل الخروج
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ساعات العمل
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.employee_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(employee.check_in_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(employee.check_out_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.hours_worked ? formatHours(employee.hours_worked) : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.current_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}