'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar, FileText, User, BarChart3, CheckCircle, AlertCircle, TrendingUp, Target, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LogoutButton from '@/components/ui/LogoutButton';
import { useThemeStyles } from '@/contexts/ThemeContext';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

interface TimeEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late';
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClocked, setIsClocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayEntry, setTodayEntry] = useState<TimeEntry | null>(null);
  const [weeklyStats, setWeeklyStats] = useState({
    totalHours: 0,
    daysPresent: 0,
    averageHours: 0,
    performance: 0
  });
  const router = useRouter();
  const themeStyles = useThemeStyles();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.user.role !== 'employees') {
            router.push('/dashboard');
            return;
          }
          setUser(userData.user);
          loadEmployeeData();
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadEmployeeData = async () => {
    try {
      // Simulate loading employee data - replace with actual API calls
      setTodayEntry({
        id: '1',
        date: new Date().toISOString().split('T')[0],
        clockIn: '08:30',
        clockOut: undefined,
        totalHours: 0,
        status: 'present'
      });
      setIsClocked(true);
      setWeeklyStats({
        totalHours: 42.5,
        daysPresent: 5,
        averageHours: 8.5,
        performance: 95
      });
    } catch (error) {
      console.error('Failed to load employee data:', error);
    }
  };

  const handleClockInOut = async () => {
    try {
      if (isClocked) {
        // Clock out
        setIsClocked(false);
        if (todayEntry) {
          setTodayEntry({
            ...todayEntry,
            clockOut: currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            totalHours: 8.5
          });
        }
      } else {
        // Clock in
        setIsClocked(true);
        setTodayEntry({
          id: '1',
          date: new Date().toISOString().split('T')[0],
          clockIn: currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          clockOut: undefined,
          totalHours: 0,
          status: 'present'
        });
      }
    } catch (error) {
      console.error('Clock in/out failed:', error);
    }
  };

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

  return (
    <Layout headerActions={headerActions}>
      <div style={{ background: themeStyles.colors.primaryBg }} className="min-h-screen" dir="rtl">
        {/* Header Section */}
        <div style={{ background: themeStyles.colors.primaryAccent, color: themeStyles.colors.btnPrimaryText }} className="p-6 sm:p-8 xl:p-12 2xl:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-right mb-6 lg:mb-0">
                <h1 className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 sm:mb-4">
                  مرحباً، {user.username}
                </h1>
                <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl opacity-90">
                  لوحة تحكم الموظف
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 xl:gap-6 mt-4 sm:mt-6 xl:mt-8">
                  <button style={{ backgroundColor: themeStyles.colors.cardBg, color: themeStyles.colors.primaryAccent, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border">
                    لوحة تحكم الموظف
                  </button>
                  <button style={{ backgroundColor: themeStyles.colors.primaryAccentLight, color: themeStyles.colors.btnPrimaryText, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border">
                    الدور: موظف
                  </button>
                </div>
              </div>
              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="text-right lg:text-left xl:text-right 2xl:min-w-[350px] backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg 2xl:text-xl">الوقت الحالي</p>
                    <p style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                      {currentTime.toLocaleTimeString('ar-SA')}
                    </p>
                    <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg 2xl:text-xl mt-2">
                      {currentTime.toLocaleDateString('ar-SA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Clock style={{ color: themeStyles.colors.textSecondary }} className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 sm:p-8 xl:p-12 2xl:p-16">
          {/* Clock In/Out Section */}
          <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg border mb-8 xl:mb-12">
            <div className="text-center">
              <h2 style={{ color: themeStyles.colors.textPrimary }} className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-6 xl:mb-8">تسجيل الحضور والانصراف</h2>
              <div className="flex flex-col items-center space-y-6 xl:space-y-8">
                <div style={{ backgroundColor: isClocked ? themeStyles.colors.successLight : themeStyles.colors.dangerLight, borderColor: isClocked ? themeStyles.colors.success : themeStyles.colors.danger }} className="w-32 h-32 sm:w-40 sm:h-40 xl:w-48 xl:h-48 rounded-full flex items-center justify-center border-4 transition-all duration-500">
                  <Clock style={{ color: isClocked ? themeStyles.colors.success : themeStyles.colors.danger }} className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24" />
                </div>
                <div className="text-center">
                  <p style={{ color: themeStyles.colors.textSecondary }} className="text-lg sm:text-xl xl:text-2xl mb-2">
                    {isClocked ? 'أنت مسجل حضور حالياً' : 'لم تسجل حضورك بعد'}
                  </p>
                  {todayEntry && (
                    <div style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg">
                      {todayEntry.clockIn && (
                        <p>وقت الحضور: {todayEntry.clockIn}</p>
                      )}
                      {todayEntry.clockOut && (
                        <p>وقت الانصراف: {todayEntry.clockOut}</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleClockInOut}
                  style={{ backgroundColor: isClocked ? themeStyles.colors.danger : themeStyles.colors.success, color: themeStyles.colors.btnPrimaryText }}
                  className="px-8 sm:px-12 xl:px-16 py-4 xl:py-6 rounded-xl font-bold text-lg sm:text-xl xl:text-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isClocked ? 'تسجيل الانصراف' : 'تسجيل الحضور'}
                </button>
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-8 xl:mb-12">
            <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg mb-2 font-medium">إجمالي الساعات</p>
                  <p style={{ color: themeStyles.colors.textPrimary }} className="text-3xl sm:text-4xl xl:text-5xl font-bold">{weeklyStats.totalHours}</p>
                </div>
                <div style={{ backgroundColor: themeStyles.colors.primaryAccentLight }} className="p-3 xl:p-4 rounded-xl">
                  <Clock style={{ color: themeStyles.colors.primaryAccent }} className="w-6 h-6 xl:w-8 xl:h-8" />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg mb-2 font-medium">أيام الحضور</p>
                  <p style={{ color: themeStyles.colors.textPrimary }} className="text-3xl sm:text-4xl xl:text-5xl font-bold">{weeklyStats.daysPresent}</p>
                </div>
                <div style={{ backgroundColor: themeStyles.colors.successLight }} className="p-3 xl:p-4 rounded-xl">
                  <CheckCircle style={{ color: themeStyles.colors.success }} className="w-6 h-6 xl:w-8 xl:h-8" />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg mb-2 font-medium">متوسط الساعات</p>
                  <p style={{ color: themeStyles.colors.textPrimary }} className="text-3xl sm:text-4xl xl:text-5xl font-bold">{weeklyStats.averageHours}</p>
                </div>
                <div style={{ backgroundColor: themeStyles.colors.infoLight }} className="p-3 xl:p-4 rounded-xl">
                  <BarChart3 style={{ color: themeStyles.colors.info }} className="w-6 h-6 xl:w-8 xl:h-8" />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg mb-2 font-medium">معدل الأداء</p>
                  <p style={{ color: themeStyles.colors.textPrimary }} className="text-3xl sm:text-4xl xl:text-5xl font-bold">{weeklyStats.performance}%</p>
                </div>
                <div style={{ backgroundColor: themeStyles.colors.warningLight }} className="p-3 xl:p-4 rounded-xl">
                  <TrendingUp style={{ color: themeStyles.colors.warning }} className="w-6 h-6 xl:w-8 xl:h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Employee Features */}
          <div className="mb-8 xl:mb-12">
            <h2 style={{ color: themeStyles.colors.textPrimary }} className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-6 xl:mb-8">الخدمات المتاحة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3">
                <div style={{ backgroundColor: themeStyles.colors.primaryAccentLight }} className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 transition-all duration-500">
                  <Calendar style={{ color: themeStyles.colors.primaryAccent }} className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8" />
                </div>
                <h3 style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 xl:mb-4">طلب إجازة</h3>
                <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg font-medium">تقديم طلبات الإجازات ومتابعة حالتها</p>
              </div>

              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3">
                <div style={{ backgroundColor: themeStyles.colors.successLight }} className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 transition-all duration-500">
                  <FileText style={{ color: themeStyles.colors.success }} className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8" />
                </div>
                <h3 style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 xl:mb-4">تقارير الحضور</h3>
                <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg font-medium">عرض تقارير الحضور والانصراف</p>
              </div>

              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3">
                <div style={{ backgroundColor: themeStyles.colors.infoLight }} className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 transition-all duration-500">
                  <User style={{ color: themeStyles.colors.info }} className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8" />
                </div>
                <h3 style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 xl:mb-4">الملف الشخصي</h3>
                <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg font-medium">تحديث البيانات الشخصية</p>
              </div>

              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3">
                <div style={{ backgroundColor: themeStyles.colors.primaryAccentLight }} className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 transition-all duration-500">
                  <Target style={{ color: themeStyles.colors.primaryAccent }} className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8" />
                </div>
                <h3 style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 xl:mb-4">الأهداف والمهام</h3>
                <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg font-medium">متابعة الأهداف والمهام المطلوبة</p>
              </div>

              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3">
                <div style={{ backgroundColor: themeStyles.colors.infoLight }} className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 transition-all duration-500">
                  <BarChart3 style={{ color: themeStyles.colors.info }} className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8" />
                </div>
                <h3 style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 xl:mb-4">تقييم الأداء</h3>
                <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg font-medium">عرض تقييمات الأداء والتطوير</p>
              </div>

              <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3">
                <div style={{ backgroundColor: themeStyles.colors.warningLight }} className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 transition-all duration-500">
                  <Award style={{ color: themeStyles.colors.warning }} className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8" />
                </div>
                <h3 style={{ color: themeStyles.colors.textPrimary }} className="text-lg sm:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 xl:mb-4">الإنجازات والمكافآت</h3>
                <p style={{ color: themeStyles.colors.textSecondary }} className="text-sm sm:text-base xl:text-lg font-medium">عرض الإنجازات والمكافآت المحققة</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: themeStyles.colors.cardBg, borderColor: themeStyles.colors.borderSecondary }} className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 shadow-lg border">
            <h2 style={{ color: themeStyles.colors.textPrimary }} className="text-xl sm:text-2xl xl:text-3xl font-bold mb-6 xl:mb-8">الإجراءات السريعة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
              <button style={{ backgroundColor: themeStyles.colors.primaryAccent, color: themeStyles.colors.btnPrimaryText }} className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Calendar className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                طلب إجازة
              </button>
              <button style={{ backgroundColor: themeStyles.colors.success, color: themeStyles.colors.btnPrimaryText }} className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <FileText className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                عرض التقارير
              </button>
              <button style={{ backgroundColor: themeStyles.colors.info, color: themeStyles.colors.btnPrimaryText }} className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <User className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                الملف الشخصي
              </button>
              <button style={{ backgroundColor: themeStyles.colors.warning, color: themeStyles.colors.btnPrimaryText }} className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Target className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                الأهداف
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}