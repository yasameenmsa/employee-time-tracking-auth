'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import LogoutButton from '@/components/ui/LogoutButton';
import ThemeDemo from '@/components/ui/ThemeDemo';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg" style={{ color: 'var(--text-primary)' }}>جاري التحميل...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const headerActions = (
    <div className="flex items-center">
      <LogoutButton />
    </div>
  );

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'HR': return 'الموارد البشرية';
      case 'employees': return 'موظف';
      default: return 'موظف';
    }
  };

  return (
    <Layout headerActions={headerActions}>
      <div className="space-y-8 lg:space-y-10 xl:space-y-12 2xl:space-y-16 py-6 lg:py-8 xl:py-12">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 2xl:p-20 text-white shadow-2xl border border-blue-500/20 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 xl:gap-8 2xl:gap-12">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 2xl:mb-6 leading-tight tracking-tight">مرحباً بك، مدير الموارد البشرية</h1>
              <p className="text-blue-100/90 mb-6 2xl:mb-8 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-medium">الثلاثاء، 7 مايو 2024 في 9:21 ص</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 xl:gap-6 2xl:gap-8">
                <button className="bg-white/95 backdrop-blur-sm text-blue-700 px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-white/20">
                  إدارة الموارد البشرية
                </button>
                <button className="bg-blue-500/80 backdrop-blur-sm text-white px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-blue-400 hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-blue-400/30">
                  HRManager الدور:
                </button>
              </div>
            </div>
            <div className="text-right lg:text-left xl:text-right 2xl:min-w-[350px] bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-50 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2">نظام تتبع وقت الموظفين</p>
                  <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-blue-100/80 font-medium">{user.username} - {getRoleDisplayName(user.role)}</p>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-purple-300/60 group hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm xl:text-base 2xl:text-lg mb-1 2xl:mb-2 group-hover:text-purple-600 transition-colors">الموظفين الحاليين</p>
                <p className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">7</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-green-300/60 group hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-green-600 transition-colors font-medium">معدل الحضور</p>
                <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">94%</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-orange-300/60 group hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-orange-600 transition-colors font-medium">طلبات الإجازة</p>
                <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">23</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:border-blue-300/60 group hover:-translate-y-2 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 group-hover:text-blue-600 transition-colors font-medium">إجمالي الموظفين</p>
                <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">142</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 xl:w-18 xl:h-18 2xl:w-22 2xl:h-22 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-purple-300/60 group hover:-translate-y-3 hover:scale-105">
            <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-purple-700 transition-colors">كشوف المرتبات</h3>
            <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-purple-600 transition-colors font-medium leading-relaxed">إدارة الرواتب والمكافآت</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-green-300/60 group hover:-translate-y-3 hover:scale-105">
            <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
               <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
               </svg>
             </div>
             <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-green-700 transition-colors">تقارير الحضور</h3>
             <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-green-600 transition-colors font-medium leading-relaxed">تقارير الحضور والانصراف التفصيلية</p>
           </div>

           <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-orange-300/60 group hover:-translate-y-3 hover:scale-105">
            <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
               <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
               </svg>
             </div>
             <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-orange-700 transition-colors">طلبات الإجازة</h3>
             <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-orange-600 transition-colors font-medium leading-relaxed">مراجعة والموافقة على طلبات الإجازة</p>
           </div>

           <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-blue-300/60 group hover:-translate-y-3 hover:scale-105">
            <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
               <svg className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
               </svg>
             </div>
             <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 group-hover:text-blue-700 transition-colors">إدارة الموظفين</h3>
             <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 group-hover:text-blue-600 transition-colors font-medium leading-relaxed">عرض وإدارة بيانات الموظفين</p>
           </div>
        </div>
        
        {/* Theme System Demo */}
        <div className="mt-8">
          <ThemeDemo />
        </div>
      </div>
    </Layout>
  );
}
