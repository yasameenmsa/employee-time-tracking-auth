'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Calendar, FileText, BarChart3, Clock, DollarSign, Award, TrendingUp, AlertCircle, Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LogoutButton from '@/components/ui/LogoutButton';
import { useThemeStyles } from '@/contexts/ThemeContext';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

export default function HRDashboard() {
  const themeStyles = useThemeStyles();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hrStats, setHrStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    newHires: 0,
    attendanceRate: 0
  });
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
          if (userData.user.role !== 'HR') {
            router.push('/dashboard');
            return;
          }
          setUser(userData.user);
          loadHRStats();
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

  const loadHRStats = async () => {
    try {
      // Simulate loading HR stats - replace with actual API calls
      setHrStats({
        totalEmployees: 45,
        pendingRequests: 8,
        newHires: 3,
        attendanceRate: 92
      });
    } catch (error) {
      console.error('Failed to load HR stats:', error);
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
      <div className="min-h-screen" style={{ background: themeStyles.colors.primaryBg }} dir="rtl">
        {/* Header Section */}
        <div className="text-white p-6 sm:p-8 xl:p-12 2xl:p-16" style={{ background: themeStyles.colors.primaryAccent }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-right mb-6 lg:mb-0">
                <h1 className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 sm:mb-4" style={{ color: themeStyles.colors.btnPrimaryText }}>
                  مرحباً، {user.username}
                </h1>
                <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl opacity-90" style={{ color: themeStyles.colors.primaryAccentLight }}>
                  لوحة تحكم الموارد البشرية
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 xl:gap-6 mt-4 sm:mt-6 xl:mt-8">
                  <button className="bg-white/95 backdrop-blur-sm text-green-700 px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-white/20">
                    لوحة الموارد البشرية
                  </button>
                  <button className="bg-green-500/80 backdrop-blur-sm text-white px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:bg-green-400 hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl border border-white/20">
                    الدور: موارد بشرية
                  </button>
                </div>
              </div>
              <div className="text-right lg:text-left xl:text-right 2xl:min-w-[350px] backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8" style={{ backgroundColor: themeStyles.colors.primaryAccentDark, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl" style={{ color: themeStyles.colors.textSecondary }}>التاريخ</p>
                    <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold" style={{ color: themeStyles.colors.btnPrimaryText }}>
                      {new Date().toLocaleDateString('ar-SA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16" style={{ color: themeStyles.colors.textSecondary }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto p-6 sm:p-8 xl:p-12 2xl:p-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10 mb-8 xl:mb-12 2xl:mb-16">
            <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium" style={{ color: themeStyles.colors.textSecondary }}>إجمالي الموظفين</p>
                  <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors" style={{ color: themeStyles.colors.textPrimary }}>{hrStats.totalEmployees}</p>
                </div>
                <div className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <Users className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium" style={{ color: themeStyles.colors.textSecondary }}>الطلبات المعلقة</p>
                  <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors" style={{ color: themeStyles.colors.textPrimary }}>{hrStats.pendingRequests}</p>
                </div>
                <div className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <AlertCircle className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium" style={{ color: themeStyles.colors.textSecondary }}>التوظيفات الجديدة</p>
                  <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors" style={{ color: themeStyles.colors.textPrimary }}>{hrStats.newHires}</p>
                </div>
                <div className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <UserPlus className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium" style={{ color: themeStyles.colors.textSecondary }}>معدل الحضور</p>
                  <p className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors" style={{ color: themeStyles.colors.textPrimary }}>{hrStats.attendanceRate}%</p>
                </div>
                <div className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <TrendingUp className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
              </div>
            </div>
          </div>

          {/* HR Management Cards */}
          <div className="mb-8 xl:mb-12 2xl:mb-16">
            <h2 className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-6 xl:mb-8 2xl:mb-10" style={{ color: themeStyles.colors.textPrimary }}>إدارة الموارد البشرية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>إدارة الموظفين</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>عرض وإدارة بيانات الموظفين</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.successLight }}>
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.success }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>التوظيف والتعيين</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>إدارة عمليات التوظيف الجديدة</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.infoLight }}>
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.info }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>إدارة الإجازات</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>مراجعة والموافقة على طلبات الإجازات</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>إدارة الحضور</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>مراقبة حضور وانصراف الموظفين</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.infoLight }}>
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.info }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>التقارير والتحليلات</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>تقارير الموارد البشرية والإحصائيات</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.warningLight }}>
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.warning }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>إدارة الرواتب</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>معالجة الرواتب والمكافآت</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.warningLight }}>
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.warning }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>تقييم الأداء</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>إدارة تقييمات أداء الموظفين</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>الوثائق والسجلات</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>إدارة ملفات ووثائق الموظفين</p>
              </div>

              <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}>
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" style={{ color: themeStyles.colors.primaryAccent }} />
                </div>
                <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors" style={{ color: themeStyles.colors.textPrimary }}>إعدادات الموارد البشرية</h3>
                <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl transition-colors font-medium leading-relaxed" style={{ color: themeStyles.colors.textSecondary }}>تكوين سياسات وإعدادات الموارد البشرية</p>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg mb-8 xl:mb-12" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
            <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold mb-6 xl:mb-8" style={{ color: themeStyles.colors.textPrimary }}>الطلبات المعلقة</h2>
            <div className="space-y-4 xl:space-y-6">
              <div className="flex items-center justify-between p-4 xl:p-6 rounded-xl" style={{ backgroundColor: themeStyles.colors.warningLight, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: themeStyles.colors.warning }}>
                    <Calendar className="w-5 h-5 xl:w-6 xl:h-6" style={{ color: themeStyles.colors.btnPrimaryText }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: themeStyles.colors.textPrimary }}>طلب إجازة - أحمد محمد</p>
                    <p className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>إجازة سنوية لمدة 5 أيام</p>
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button className="px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: themeStyles.colors.success, color: themeStyles.colors.btnPrimaryText }}>
                    موافقة
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: themeStyles.colors.warning, color: themeStyles.colors.btnPrimaryText }}>
                    رفض
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 xl:p-6 rounded-xl" style={{ backgroundColor: themeStyles.colors.primaryAccentLight, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: themeStyles.colors.primaryAccent }}>
                    <UserPlus className="w-5 h-5 xl:w-6 xl:h-6" style={{ color: themeStyles.colors.btnPrimaryText }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: themeStyles.colors.textPrimary }}>طلب توظيف - سارة أحمد</p>
                    <p className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>مطور واجهات أمامية</p>
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button className="px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: themeStyles.colors.success, color: themeStyles.colors.btnPrimaryText }}>
                    موافقة
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: themeStyles.colors.warning, color: themeStyles.colors.btnPrimaryText }}>
                    رفض
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg, border: `1px solid ${themeStyles.colors.borderSecondary}` }}>
            <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold mb-6 xl:mb-8" style={{ color: themeStyles.colors.textPrimary }}>الإجراءات السريعة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
              <button className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" style={{ backgroundColor: themeStyles.colors.primaryAccent, color: themeStyles.colors.btnPrimaryText }}>
                <UserPlus className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                إضافة موظف
              </button>
              <button className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" style={{ backgroundColor: themeStyles.colors.success, color: themeStyles.colors.btnPrimaryText }}>
                <Calendar className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                مراجعة الإجازات
              </button>
              <button className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" style={{ backgroundColor: themeStyles.colors.info, color: themeStyles.colors.btnPrimaryText }}>
                <BarChart3 className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                عرض التقارير
              </button>
              <button className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" style={{ backgroundColor: themeStyles.colors.warning, color: themeStyles.colors.btnPrimaryText }}>
                <DollarSign className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" />
                إدارة الرواتب
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}