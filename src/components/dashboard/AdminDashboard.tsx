'use client';
import React from 'react';
import { Users, Settings, BarChart3, DollarSign, Clock, Shield, Database, FileText } from 'lucide-react';
import LogoutButton from '@/components/ui/LogoutButton';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
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
      {/* Admin Header Section */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 2xl:p-20 text-white shadow-2xl border border-red-500/20 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 xl:gap-8 2xl:gap-12">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 2xl:mb-6 leading-tight tracking-tight">مرحباً بك، المدير العام</h1>
            <p className="text-red-100/90 mb-6 2xl:mb-8 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-medium">{currentDate} في {currentTime}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 xl:gap-6 2xl:gap-8">
              <button className="bg-white/95 backdrop-blur-sm text-red-700 px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-white/20">
                لوحة التحكم الرئيسية
              </button>
              <button className="bg-red-500/80 backdrop-blur-sm text-white px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-red-400 hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-red-400/30">
                الدور: مدير عام
              </button>
            </div>
          </div>
          <div className="text-right lg:text-left xl:text-right 2xl:min-w-[350px] bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-50 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2">نظام إدارة الموظفين المتكامل</p>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-red-100/80 font-medium">{user.username} - مدير عام</p>
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

      {/* Admin Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-blue-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm xl:text-base 2xl:text-lg mb-1 2xl:mb-2 group-hover:text-blue-600 transition-colors">إجمالي المستخدمين</p>
              <p className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">156</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-green-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-green-600 transition-colors font-medium">الإيرادات الشهرية</p>
              <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">₪45,230</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-purple-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-purple-600 transition-colors font-medium">ساعات العمل الكلية</p>
              <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">1,247</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-orange-300/60 group hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-orange-600 transition-colors font-medium">حالة النظام</p>
              <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">99.9%</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-blue-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-blue-700 transition-colors">إدارة المستخدمين</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-blue-600 transition-colors font-medium leading-relaxed">إضافة وتعديل وحذف المستخدمين والأدوار</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-green-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-green-700 transition-colors">التقارير والتحليلات</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-green-600 transition-colors font-medium leading-relaxed">تقارير شاملة وتحليلات متقدمة</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-purple-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-purple-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-purple-700 transition-colors">إعدادات النظام</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-purple-600 transition-colors font-medium leading-relaxed">تكوين النظام والإعدادات العامة</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-orange-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Database className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-orange-700 transition-colors">إدارة قاعدة البيانات</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-orange-600 transition-colors font-medium leading-relaxed">نسخ احتياطي واستعادة البيانات</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-red-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-red-700 transition-colors">الأمان والصلاحيات</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-red-600 transition-colors font-medium leading-relaxed">إدارة الأمان وصلاحيات المستخدمين</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-indigo-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-indigo-700 transition-colors">إدارة المالية</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-indigo-600 transition-colors font-medium leading-relaxed">الرواتب والمكافآت والمصروفات</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-teal-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-teal-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-teal-700 transition-colors">سجلات النظام</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-teal-600 transition-colors font-medium leading-relaxed">مراجعة سجلات النشاط والأحداث</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-pink-300/60 group hover:-translate-y-3 hover:scale-105">
          <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-pink-200 group-hover:to-pink-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-pink-600" />
          </div>
          <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-pink-700 transition-colors">إدارة الوقت</h3>
          <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-pink-600 transition-colors font-medium leading-relaxed">مراقبة أوقات العمل والحضور</p>
        </div>
      </div>
    </div>
  );
}