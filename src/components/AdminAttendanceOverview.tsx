'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Download, Search, Calendar, Building, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { AdminOverviewResponse, EmployeeAttendanceSummary } from '@/types/attendance';

interface AdminAttendanceOverviewProps {
  className?: string;
}

interface OverviewState {
  employees: EmployeeAttendanceSummary[];
  summary: {
    total_employees: number;
    checked_in_count: number;
    checked_out_count: number;
    average_hours_today: number;
    total_hours_today: number;
  };
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
      checked_in_count: 0,
      checked_out_count: 0,
      average_hours_today: 0,
      total_hours_today: 0
    },
    loading: true,
    error: null,
    selectedDate: new Date().toISOString().split('T')[0],
    selectedDepartment: '',
    searchTerm: ''
  });

  // Fetch attendance overview data
  const fetchOverviewData = useCallback(async () => {
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
  }, [state.selectedDate, state.selectedDepartment]);

  // Filter employees based on search term
  const filteredEmployees = state.employees.filter(employee =>
    employee.employee_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    (employee.department && employee.department.toLowerCase().includes(state.searchTerm.toLowerCase()))
  );

  // Format time
  const formatTime = (timeString: string | null | undefined) => {
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

  // Get avatar color based on index
  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600'
    ];
    return colors[index % colors.length];
  };

  // Get enhanced status badge
  const getEnhancedStatusBadge = (status: string) => {
    const statusConfig = {
      'checked_in': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: '🟢',
        label: 'حاضر'
      },
      'checked_out': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: '⚪',
        label: 'منصرف'
      },
      'absent': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: '🔴',
        label: 'غائب'
      },
      'late': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: '🟡',
        label: 'متأخر'
      },
      'present': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: '🟢',
        label: 'حاضر'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['absent'];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['اسم الموظف', 'القسم', 'تسجيل الحضور', 'تسجيل الانصراف', 'ساعات العمل', 'الحالة'];
    const csvData = filteredEmployees.map(emp => [
      emp.employee_name,
      emp.department,
      formatTime(emp.check_in_time),
      formatTime(emp.check_out_time),
      emp.today_hours ? formatHours(emp.today_hours) : '--',
      emp.current_status
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
  }, [fetchOverviewData]);

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

        {/* Enhanced Filters */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                التاريخ
              </label>
              <input
                type="date"
                value={state.selectedDate}
                onChange={(e) => setState(prev => ({ ...prev, selectedDate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building className="w-4 h-4 text-green-500" />
                القسم
              </label>
              <select
                value={state.selectedDepartment}
                onChange={(e) => setState(prev => ({ ...prev, selectedDepartment: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 text-purple-500" />
                البحث
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث عن الموظفين..."
                  value={state.searchTerm}
                  onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
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

      {/* Enhanced Summary Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{state.summary.total_employees}</div>
            <div className="text-sm text-blue-600 font-medium">إجمالي الموظفين</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-700">{state.summary.checked_in_count}</div>
            <div className="text-sm text-green-600 font-medium">حاضر اليوم</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-red-700">{state.summary.total_employees - state.summary.checked_in_count}</div>
            <div className="text-sm text-red-600 font-medium">غائب اليوم</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">0</div>
            <div className="text-sm text-yellow-600 font-medium">متأخر اليوم</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{formatHours(state.summary.average_hours_today)}</div>
            <div className="text-sm text-purple-600 font-medium">متوسط الساعات</div>
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
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                    الموظف
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                    القسم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                     تسجيل الحضور
                   </th>
                   <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                     تسجيل الانصراف
                   </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                    ساعات العمل
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEmployees.map((employee, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-200 transition-colors duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          getAvatarColor(index)
                        }`}>
                          <span className="text-white font-semibold text-sm">
                            {employee.employee_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{employee.employee_name}</div>
                          <div className="text-xs text-gray-500">{employee.username || 'لا يوجد اسم مستخدم'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{formatTime(employee.check_in_time)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{formatTime(employee.check_out_time)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-blue-600">
                        {employee.today_hours ? formatHours(employee.today_hours) : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getEnhancedStatusBadge(employee.current_status)}
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