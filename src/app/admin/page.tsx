'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Settings, BarChart3, DollarSign, Clock, Shield, Database, FileText, UserPlus, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LogoutButton from '@/components/ui/LogoutButton';
import { useThemeStyles } from '@/contexts/ThemeContext';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeUsers: 0,
    totalHours: 0,
    monthlyPayroll: 0
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
          if (userData.user.role !== 'admin') {
            router.push('/dashboard');
            return;
          }
          setUser(userData.user);
          // Load admin stats
          loadStats();
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

  const loadStats = async () => {
    try {
      // Simulate loading stats - replace with actual API calls
      setStats({
        totalEmployees: 45,
        activeUsers: 38,
        totalHours: 1840,
        monthlyPayroll: 125000
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
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
      <div 
        className="min-h-screen" 
        dir="rtl"
        style={{
          background: `linear-gradient(to bottom right, ${themeStyles.colors.primaryBg}, ${themeStyles.colors.secondaryBg})`
        }}
      >
        {/* Header Section */}
        <div 
          className="p-6 sm:p-8 xl:p-12 2xl:p-16"
          style={{
            background: `linear-gradient(to right, ${themeStyles.colors.primaryAccent}, ${themeStyles.colors.primaryAccentDark})`,
            color: themeStyles.colors.btnPrimaryText
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-right mb-6 lg:mb-0">
                <h1 className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 sm:mb-4">
                  مرحباً، {user.username}
                </h1>
                <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl opacity-90">
                  لوحة التحكم الرئيسية للمدير العام
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 xl:gap-6 mt-4 sm:mt-6 xl:mt-8">
                  <button 
                    className="backdrop-blur-sm px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl"
                    style={{
                      backgroundColor: `${themeStyles.colors.cardBg}95`,
                      color: themeStyles.colors.primaryAccent,
                      border: `1px solid ${themeStyles.colors.borderSecondary}`
                    }}
                  >
                    لوحة التحكم الرئيسية
                  </button>
                  <button 
                    className="backdrop-blur-sm px-6 sm:px-8 xl:px-10 2xl:px-12 py-3 xl:py-4 2xl:py-5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base xl:text-lg 2xl:text-xl shadow-xl hover:shadow-2xl"
                    style={{
                      backgroundColor: `${themeStyles.colors.primaryAccentDark}80`,
                      color: themeStyles.colors.btnPrimaryText,
                      border: `1px solid ${themeStyles.colors.borderSecondary}`
                    }}
                  >
                    الدور: مدير عام
                  </button>
                </div>
              </div>
              <div 
                className="text-right lg:text-left xl:text-right 2xl:min-w-[350px] backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}10`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}20`
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p 
                      className="text-sm sm:text-base xl:text-lg 2xl:text-xl"
                      style={{ color: `${themeStyles.colors.btnPrimaryText}80` }}
                    >
                      التاريخ
                    </p>
                    <p 
                      className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold"
                      style={{ color: themeStyles.colors.btnPrimaryText }}
                    >
                      {new Date().toLocaleDateString('ar-SA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Clock 
                    className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16" 
                    style={{ color: `${themeStyles.colors.btnPrimaryText}80` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto p-6 sm:p-8 xl:p-12 2xl:p-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10 mb-8 xl:mb-12 2xl:mb-16">
            <div 
              className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105"
              style={{
                backgroundColor: `${themeStyles.colors.cardBg}95`,
                border: `1px solid ${themeStyles.colors.borderSecondary}50`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium"
                    style={{ color: themeStyles.colors.textSecondary }}
                  >
                    إجمالي الموظفين
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors"
                    style={{ color: themeStyles.colors.textPrimary }}
                  >
                    {stats.totalEmployees}
                  </p>
                </div>
                <div 
                  className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors"
                  style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}
                >
                  <Users 
                    className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.primaryAccent }}
                  />
                </div>
              </div>
            </div>

            <div 
              className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105"
              style={{
                backgroundColor: `${themeStyles.colors.cardBg}95`,
                border: `1px solid ${themeStyles.colors.borderSecondary}50`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium"
                    style={{ color: themeStyles.colors.textSecondary }}
                  >
                    المستخدمون النشطون
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors"
                    style={{ color: themeStyles.colors.textPrimary }}
                  >
                    {stats.activeUsers}
                  </p>
                </div>
                <div 
                  className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors"
                  style={{ backgroundColor: themeStyles.colors.successLight }}
                >
                  <UserPlus 
                    className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.success }}
                  />
                </div>
              </div>
            </div>

            <div 
              className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105"
              style={{
                backgroundColor: `${themeStyles.colors.cardBg}95`,
                border: `1px solid ${themeStyles.colors.borderSecondary}50`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium"
                    style={{ color: themeStyles.colors.textSecondary }}
                  >
                    إجمالي الساعات
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors"
                    style={{ color: themeStyles.colors.textPrimary }}
                  >
                    {stats.totalHours.toLocaleString()}
                  </p>
                </div>
                <div 
                  className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors"
                  style={{ backgroundColor: themeStyles.colors.infoLight }}
                >
                  <Clock 
                    className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.info }}
                  />
                </div>
              </div>
            </div>

            <div 
              className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:scale-105"
              style={{
                backgroundColor: `${themeStyles.colors.cardBg}95`,
                border: `1px solid ${themeStyles.colors.borderSecondary}50`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-2 2xl:mb-3 transition-colors font-medium"
                    style={{ color: themeStyles.colors.textSecondary }}
                  >
                    الرواتب الشهرية
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold transition-colors"
                    style={{ color: themeStyles.colors.textPrimary }}
                  >
                    {stats.monthlyPayroll.toLocaleString()} ر.س
                  </p>
                </div>
                <div 
                  className="p-3 xl:p-4 2xl:p-5 rounded-xl transition-colors"
                  style={{ backgroundColor: themeStyles.colors.warningLight }}
                >
                  <DollarSign 
                    className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.warning }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="mb-8 xl:mb-12 2xl:mb-16">
            <h2 
              className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-6 xl:mb-8 2xl:mb-10"
              style={{ color: themeStyles.colors.textPrimary }}
            >
              إدارة النظام
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.primaryAccentLight}, ${themeStyles.colors.primaryAccentLight}80)`
                  }}
                >
                  <Users 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.primaryAccent }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  إدارة المستخدمين
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  إضافة وتعديل وحذف المستخدمين والأدوار
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.successLight}, ${themeStyles.colors.successLight}80)`
                  }}
                >
                  <BarChart3 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.success }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  التقارير والتحليلات
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  تقارير شاملة وتحليلات متقدمة
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.infoLight}, ${themeStyles.colors.infoLight}80)`
                  }}
                >
                  <Settings 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.info }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  إعدادات النظام
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  تكوين النظام والإعدادات العامة
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.infoLight}, ${themeStyles.colors.infoLight}80)`
                  }}
                >
                  <DollarSign 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.info }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  إدارة المالية
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  الرواتب والمكافآت والمصروفات
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.successLight}, ${themeStyles.colors.successLight}80)`
                  }}
                >
                  <FileText 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.success }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  سجلات النظام
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  مراجعة سجلات النشاط والأحداث
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.errorLight || themeStyles.colors.warningLight}, ${themeStyles.colors.errorLight || themeStyles.colors.warningLight}80)`
                  }}
                >
                  <Shield 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.error || themeStyles.colors.warning }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  الأمان والحماية
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  إدارة الصلاحيات والأمان
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.textSecondary}20, ${themeStyles.colors.textSecondary}10)`
                  }}
                >
                  <Database 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.textSecondary }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  إدارة البيانات
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  النسخ الاحتياطي واستعادة البيانات
                </p>
              </div>

              <div 
                className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105"
                style={{
                  backgroundColor: `${themeStyles.colors.cardBg}95`,
                  border: `1px solid ${themeStyles.colors.borderSecondary}50`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 xl:mb-8 2xl:mb-10 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${themeStyles.colors.warningLight}, ${themeStyles.colors.warningLight}80)`
                  }}
                >
                  <AlertCircle 
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" 
                    style={{ color: themeStyles.colors.warning }}
                  />
                </div>
                <h3 
                  className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 sm:mb-3 xl:mb-4 2xl:mb-5 transition-colors"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  التنبيهات والإشعارات
                </h3>
                <p 
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl font-medium leading-relaxed transition-colors"
                  style={{ color: themeStyles.colors.textSecondary }}
                >
                  إدارة التنبيهات والإشعارات
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div 
            className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 2xl:p-12 shadow-lg"
            style={{
              backgroundColor: `${themeStyles.colors.cardBg}95`,
              border: `1px solid ${themeStyles.colors.borderSecondary}50`
            }}
          >
            <h2 
              className="text-xl sm:text-2xl xl:text-3xl font-bold mb-6 xl:mb-8"
              style={{ color: themeStyles.colors.textPrimary }}
            >
              الإجراءات السريعة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
              <button 
                className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(to bottom right, ${themeStyles.colors.primaryAccent}, ${themeStyles.colors.primaryAccentDark})`,
                  color: themeStyles.colors.btnPrimaryText
                }}
              >
                <UserPlus 
                  className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" 
                  style={{ color: themeStyles.colors.btnPrimaryText }}
                />
                إضافة موظف جديد
              </button>
              <button 
                className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(to bottom right, ${themeStyles.colors.success}, ${themeStyles.colors.successDark || themeStyles.colors.success})`,
                  color: themeStyles.colors.btnPrimaryText
                }}
              >
                <BarChart3 
                  className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" 
                  style={{ color: themeStyles.colors.btnPrimaryText }}
                />
                عرض التقارير
              </button>
              <button 
                className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(to bottom right, ${themeStyles.colors.info}, ${themeStyles.colors.infoDark || themeStyles.colors.info})`,
                  color: themeStyles.colors.btnPrimaryText
                }}
              >
                <Settings 
                  className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" 
                  style={{ color: themeStyles.colors.btnPrimaryText }}
                />
                إعدادات النظام
              </button>
              <button 
                className="p-4 xl:p-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(to bottom right, ${themeStyles.colors.warning}, ${themeStyles.colors.warningDark || themeStyles.colors.warning})`,
                  color: themeStyles.colors.btnPrimaryText
                }}
              >
                <DollarSign 
                  className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2" 
                  style={{ color: themeStyles.colors.btnPrimaryText }}
                />
                إدارة الرواتب
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}