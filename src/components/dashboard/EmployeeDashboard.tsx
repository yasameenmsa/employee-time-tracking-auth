'use client';
import React from 'react';
import { Clock, Calendar, DollarSign, User, FileText, TrendingUp, Target, Award } from 'lucide-react';
import LogoutButton from '@/components/ui/LogoutButton';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

interface EmployeeDashboardProps {
  user: User;
}

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-8 lg:space-y-10 xl:space-y-12 2xl:space-y-16 py-6 lg:py-8 xl:py-12">
      {/* Employee Header Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 2xl:p-20 text-white shadow-2xl border border-green-500/20 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 xl:gap-8 2xl:gap-12">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 2xl:mb-6 leading-tight tracking-tight">مرحباً بك، {user.username}</h1>
            <p className="text-green-100/90 mb-6 2xl:mb-8 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-medium">{currentDate} في {currentTime}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 xl:gap-6 2xl:gap-8">
              <button className="bg-white/95 backdrop-blur-sm text-green-700 px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-white/20">
                لوحة التحكم الشخصية
              </button>
              <button className="bg-green-500/80 backdrop-blur-sm text-white px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-green-400 hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-green-400/30">
                الدور: موظف
              </button>
            </div>
          </div>
          <div className="text-right lg:text-left xl:text-right 2xl:min-w-[350px] bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-50 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2">نظام تتبع الوقت الشخصي</p>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-green-100/80 font-medium">{user.username} - موظف</p>
              </div>
              <LogoutButton 
                variant="outline" 
                size="md" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-blue-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm xl:text-base 2xl:text-lg mb-1 2xl:mb-2 group-hover:text-blue-600 transition-colors">ساعات العمل اليوم</p>
              <p className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">8.5</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-green-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-green-600 transition-colors font-medium">ساعات هذا الشهر</p>
              <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">168</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-purple-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-purple-600 transition-colors font-medium">الراتب المتوقع</p>
              <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">₪4,200</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-orange-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-orange-600 transition-colors font-medium">أيام الإجازة المتبقية</p>
              <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">12</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-blue-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-blue-700 transition-colors">تتبع الوقت</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-blue-600 transition-colors font-medium leading-relaxed">تسجيل أوقات الحضور والانصراف اليومية</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-green-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-green-700 transition-colors">تقاريري الشخصية</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-green-600 transition-colors font-medium leading-relaxed">عرض تقارير الحضور والساعات الشخصية</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-purple-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <User className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-purple-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-purple-700 transition-colors">الملف الشخصي</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-purple-600 transition-colors font-medium leading-relaxed">إدارة البيانات الشخصية والإعدادات</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-orange-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-orange-700 transition-colors">طلب إجازة</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-orange-600 transition-colors font-medium leading-relaxed">تقديم طلبات الإجازة ومتابعة حالتها</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-indigo-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-indigo-700 transition-colors">إحصائيات الأداء</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-indigo-600 transition-colors font-medium leading-relaxed">مراجعة إحصائيات الأداء والإنتاجية</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-yellow-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-yellow-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-yellow-700 transition-colors">الإنجازات والمكافآت</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-yellow-600 transition-colors font-medium leading-relaxed">عرض الإنجازات والمكافآت المحققة</p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50">
        <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900 mb-6 xl:mb-8">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            تسجيل الحضور
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            عرض تقرير الشهر
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            طلب إجازة جديدة
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50">
        <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900 mb-6 xl:mb-8">جدول اليوم</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900">تسجيل الحضور</p>
                <p className="text-sm text-gray-600">08:30 ص</p>
              </div>
            </div>
            <span className="text-green-600 font-semibold">مكتمل</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900">اجتماع الفريق</p>
                <p className="text-sm text-gray-600">10:00 ص - 11:00 ص</p>
              </div>
            </div>
            <span className="text-blue-600 font-semibold">قادم</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900">تسجيل الانصراف</p>
                <p className="text-sm text-gray-600">05:30 م</p>
              </div>
            </div>
            <span className="text-gray-600 font-semibold">مجدول</span>
          </div>
        </div>
      </div>
    </div>
  );
}