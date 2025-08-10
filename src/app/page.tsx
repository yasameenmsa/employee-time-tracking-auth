'use client';
import Link from 'next/link';
import { Clock, Users, BarChart3, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useThemeStyles } from '@/contexts/ThemeContext';

export default function Home() {
  const themeStyles = useThemeStyles();
  
  return (
    <div 
      className="min-h-screen" 
      dir="rtl"
      style={{
        background: `linear-gradient(to bottom right, ${themeStyles.colors.primaryBg}, ${themeStyles.colors.secondaryBg})`
      }}
    >
      {/* Header */}
      <header 
        className="shadow-sm"
        style={{ backgroundColor: themeStyles.colors.headerBg }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Clock 
                className="h-8 w-8 ml-3" 
                style={{ color: themeStyles.colors.primaryAccent }}
              />
              <h1 
                className="text-2xl font-bold"
                style={{ color: themeStyles.colors.textPrimary }}
              >
                نظام إدارة الوقت
              </h1>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: themeStyles.colors.primaryAccent,
                  color: themeStyles.colors.btnPrimaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeStyles.colors.primaryAccentHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeStyles.colors.primaryAccent;
                }}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  border: `1px solid ${themeStyles.colors.primaryAccent}`,
                  color: themeStyles.colors.primaryAccent,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeStyles.colors.primaryAccentLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: themeStyles.colors.textPrimary }}
          >
            نظام إدارة الوقت
            <span 
              className="block"
              style={{ color: themeStyles.colors.primaryAccent }}
            >
              للموظفين
            </span>
          </h2>
          <p 
            className="text-xl mb-8 max-w-3xl mx-auto"
            style={{ color: themeStyles.colors.textSecondary }}
          >
            نظام شامل لتتبع أوقات العمل وإدارة الحضور والانصراف مع تقارير مفصلة وإدارة الرواتب
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-flex items-center"
              style={{
                backgroundColor: themeStyles.colors.primaryAccent,
                color: themeStyles.colors.btnPrimaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeStyles.colors.primaryAccentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeStyles.colors.primaryAccent;
              }}
            >
              ابدأ الآن
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              style={{
                border: `1px solid ${themeStyles.colors.borderPrimary}`,
                color: themeStyles.colors.textSecondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeStyles.colors.secondaryBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 
            className="text-3xl font-bold text-center mb-12"
            style={{ color: themeStyles.colors.textPrimary }}
          >
            المميزات الرئيسية
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ backgroundColor: themeStyles.colors.cardBg }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeStyles.colors.primaryAccentLight }}
              >
                <Clock 
                  className="h-6 w-6" 
                  style={{ color: themeStyles.colors.primaryAccent }}
                />
              </div>
              <h4 
                className="text-xl font-semibold mb-2"
                style={{ color: themeStyles.colors.textPrimary }}
              >
                تتبع الوقت
              </h4>
              <p style={{ color: themeStyles.colors.textSecondary }}>
                تسجيل أوقات الحضور والانصراف بدقة مع حساب ساعات العمل تلقائياً
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ backgroundColor: themeStyles.colors.cardBg }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeStyles.colors.successLight }}
              >
                <Users 
                  className="h-6 w-6" 
                  style={{ color: themeStyles.colors.success }}
                />
              </div>
              <h4 
                className="text-xl font-semibold mb-2"
                style={{ color: themeStyles.colors.textPrimary }}
              >
                إدارة الموظفين
              </h4>
              <p style={{ color: themeStyles.colors.textSecondary }}>
                إدارة شاملة لبيانات الموظفين وأدوارهم وصلاحياتهم
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ backgroundColor: themeStyles.colors.cardBg }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeStyles.colors.infoLight }}
              >
                <BarChart3 
                  className="h-6 w-6" 
                  style={{ color: themeStyles.colors.info }}
                />
              </div>
              <h4 
                className="text-xl font-semibold mb-2"
                style={{ color: themeStyles.colors.textPrimary }}
              >
                التقارير والتحليلات
              </h4>
              <p style={{ color: themeStyles.colors.textSecondary }}>
                تقارير مفصلة عن الحضور والأداء مع إحصائيات شاملة
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ backgroundColor: themeStyles.colors.cardBg }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: themeStyles.colors.warningLight }}
              >
                <Shield 
                  className="h-6 w-6" 
                  style={{ color: themeStyles.colors.warning }}
                />
              </div>
              <h4 
                className="text-xl font-semibold mb-2"
                style={{ color: themeStyles.colors.textPrimary }}
              >
                الأمان والخصوصية
              </h4>
              <p style={{ color: themeStyles.colors.textSecondary }}>
                حماية عالية للبيانات مع نظام صلاحيات متقدم
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div 
          className="mt-20 rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: themeStyles.colors.cardBg }}
        >
          <h3 
            className="text-3xl font-bold text-center mb-8"
            style={{ color: themeStyles.colors.textPrimary }}
          >
            لماذا تختار نظامنا؟
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle 
                className="h-6 w-6 ml-3 mt-1 flex-shrink-0" 
                style={{ color: themeStyles.colors.success }}
              />
              <div>
                <h4 
                  className="font-semibold mb-1"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  سهولة الاستخدام
                </h4>
                <p style={{ color: themeStyles.colors.textSecondary }}>
                  واجهة بسيطة وسهلة الاستخدام لجميع المستخدمين
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle 
                className="h-6 w-6 ml-3 mt-1 flex-shrink-0" 
                style={{ color: themeStyles.colors.success }}
              />
              <div>
                <h4 
                  className="font-semibold mb-1"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  تقارير دقيقة
                </h4>
                <p style={{ color: themeStyles.colors.textSecondary }}>
                  تقارير مفصلة ودقيقة لمساعدتك في اتخاذ القرارات
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle 
                className="h-6 w-6 ml-3 mt-1 flex-shrink-0" 
                style={{ color: themeStyles.colors.success }}
              />
              <div>
                <h4 
                  className="font-semibold mb-1"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  إدارة متقدمة
                </h4>
                <p style={{ color: themeStyles.colors.textSecondary }}>
                  أدوات إدارية متقدمة لتسهيل عملية إدارة الموظفين
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle 
                className="h-6 w-6 ml-3 mt-1 flex-shrink-0" 
                style={{ color: themeStyles.colors.success }}
              />
              <div>
                <h4 
                  className="font-semibold mb-1"
                  style={{ color: themeStyles.colors.textPrimary }}
                >
                  دعم فني ممتاز
                </h4>
                <p style={{ color: themeStyles.colors.textSecondary }}>
                  فريق دعم فني متاح لمساعدتك في أي وقت
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="py-8 mt-20"
        style={{ backgroundColor: themeStyles.colors.footerBg }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock 
              className="h-6 w-6 ml-2" 
              style={{ color: themeStyles.colors.textPrimary }}
            />
            <span 
              className="text-lg font-semibold"
              style={{ color: themeStyles.colors.textPrimary }}
            >
              نظام إدارة الوقت
            </span>
          </div>
          <p style={{ color: themeStyles.colors.textSecondary }}>
            © 2024 نظام إدارة الوقت للموظفين. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
