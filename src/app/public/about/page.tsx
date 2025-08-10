'use client';
import Link from 'next/link';
import { Clock, Users, BarChart3, Shield, CheckCircle, ArrowLeft, Star, Award, Target } from 'lucide-react';
import { useThemeStyles } from '@/contexts/ThemeContext';

export default function AboutPage() {
  const themeStyles = useThemeStyles();
  
  return (
    <div className="min-h-screen" style={{ background: themeStyles.colors.primaryBg }} dir="rtl">
      {/* Header */}
      <header className="backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: themeStyles.colors.cardBg, borderBottom: `1px solid ${themeStyles.colors.borderSecondary}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                نظام إدارة الوقت
              </h1>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ color: themeStyles.colors.textSecondary }}
                onMouseEnter={(e) => e.target.style.color = themeStyles.colors.primaryAccent}
                onMouseLeave={(e) => e.target.style.color = themeStyles.colors.textSecondary}
              >
                الرئيسية
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: themeStyles.colors.primaryAccent, color: themeStyles.colors.btnPrimaryText }}
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: themeStyles.colors.textPrimary }}>
            حول نظام إدارة الوقت
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: themeStyles.colors.textSecondary }}>
            نظام شامل ومتطور لإدارة أوقات العمل وتتبع الحضور والانصراف مع تقارير مفصلة وإدارة الرواتب
          </p>
        </div>

        {/* Mission Section */}
        <div className="rounded-2xl p-8 shadow-lg mb-16" style={{ backgroundColor: themeStyles.colors.cardBg }}>
          <div className="text-center mb-8">
            <Target className="h-16 w-16 mx-auto mb-4" style={{ color: themeStyles.colors.primaryAccent }} />
            <h3 className="text-3xl font-bold mb-4" style={{ color: themeStyles.colors.textPrimary }}>
              رؤيتنا ورسالتنا
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                الرؤية
              </h4>
              <p style={{ color: themeStyles.colors.textSecondary }}>
                أن نكون الحل الأمثل لإدارة الوقت والموارد البشرية في المؤسسات العربية، مع توفير تجربة مستخدم متميزة وتقنيات حديثة
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                الرسالة
              </h4>
              <p style={{ color: themeStyles.colors.textSecondary }}>
                تطوير حلول تقنية متقدمة لإدارة الوقت والحضور تساعد المؤسسات على تحسين الإنتاجية وتبسيط العمليات الإدارية
              </p>
            </div>
          </div>
        </div>

        {/* Features Detail */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: themeStyles.colors.textPrimary }}>
            المميزات التفصيلية
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg }}>
              <Clock className="h-12 w-12 mb-4" style={{ color: themeStyles.colors.primaryAccent }} />
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                تتبع الوقت الذكي
              </h4>
              <ul className="space-y-2" style={{ color: themeStyles.colors.textSecondary }}>
                <li>• تسجيل الحضور والانصراف التلقائي</li>
                <li>• حساب ساعات العمل الإضافية</li>
                <li>• تتبع فترات الراحة</li>
                <li>• تقارير الوقت المفصلة</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg }}>
              <Users className="h-12 w-12 mb-4" style={{ color: themeStyles.colors.success }} />
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                إدارة الموظفين المتقدمة
              </h4>
              <ul className="space-y-2" style={{ color: themeStyles.colors.textSecondary }}>
                <li>• إدارة ملفات الموظفين</li>
                <li>• تحديد الأدوار والصلاحيات</li>
                <li>• متابعة الأداء</li>
                <li>• إدارة الإجازات والغياب</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg }}>
              <BarChart3 className="h-12 w-12 mb-4" style={{ color: themeStyles.colors.info }} />
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                التقارير والإحصائيات
              </h4>
              <ul className="space-y-2" style={{ color: themeStyles.colors.textSecondary }}>
                <li>• تقارير الحضور الشهرية</li>
                <li>• إحصائيات الإنتاجية</li>
                <li>• تحليل الأداء</li>
                <li>• تقارير الرواتب</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg }}>
              <Shield className="h-12 w-12 mb-4" style={{ color: themeStyles.colors.warning }} />
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                الأمان والحماية
              </h4>
              <ul className="space-y-2" style={{ color: themeStyles.colors.textSecondary }}>
                <li>• تشفير البيانات المتقدم</li>
                <li>• نظام صلاحيات متعدد المستويات</li>
                <li>• نسخ احتياطية تلقائية</li>
                <li>• مراقبة الأنشطة</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg }}>
              <Star className="h-12 w-12 mb-4" style={{ color: themeStyles.colors.warning }} />
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                سهولة الاستخدام
              </h4>
              <ul className="space-y-2" style={{ color: themeStyles.colors.textSecondary }}>
                <li>• واجهة مستخدم بديهية</li>
                <li>• دعم اللغة العربية الكامل</li>
                <li>• تصميم متجاوب</li>
                <li>• تدريب وإرشادات شاملة</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: themeStyles.colors.cardBg }}>
              <Award className="h-12 w-12 mb-4" style={{ color: themeStyles.colors.error }} />
              <h4 className="text-xl font-semibold mb-3" style={{ color: themeStyles.colors.textPrimary }}>
                الدعم الفني
              </h4>
              <ul className="space-y-2" style={{ color: themeStyles.colors.textSecondary }}>
                <li>• دعم فني على مدار الساعة</li>
                <li>• تحديثات دورية مجانية</li>
                <li>• تدريب الفرق</li>
                <li>• استشارات تقنية</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="rounded-2xl p-8 text-center" style={{ background: themeStyles.colors.primaryAccent }}>
          <h3 className="text-3xl font-bold mb-6" style={{ color: themeStyles.colors.btnPrimaryText }}>
            لماذا تختار نظامنا؟
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: themeStyles.colors.btnPrimaryText }}>99%</div>
              <div className="text-lg" style={{ color: themeStyles.colors.btnPrimaryText }}>معدل الرضا</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: themeStyles.colors.btnPrimaryText }}>24/7</div>
              <div className="text-lg" style={{ color: themeStyles.colors.btnPrimaryText }}>الدعم الفني</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: themeStyles.colors.btnPrimaryText }}>100+</div>
              <div className="text-lg" style={{ color: themeStyles.colors.btnPrimaryText }}>عميل راضٍ</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold mb-6" style={{ color: themeStyles.colors.textPrimary }}>
            ابدأ رحلتك معنا اليوم
          </h3>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-flex items-center"
              style={{ backgroundColor: themeStyles.colors.primaryAccent, color: themeStyles.colors.btnPrimaryText }}
            >
              ابدأ الآن
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
            <Link
              href="/public/contact"
              className="px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              style={{ border: `1px solid ${themeStyles.colors.primaryAccent}`, color: themeStyles.colors.primaryAccent }}
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-20" style={{ backgroundColor: themeStyles.colors.cardBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 ml-2" style={{ color: themeStyles.colors.primaryAccent }} />
            <span className="text-lg font-semibold" style={{ color: themeStyles.colors.textPrimary }}>نظام إدارة الوقت</span>
          </div>
          <p style={{ color: themeStyles.colors.textSecondary }}>
            © 2024 نظام إدارة الوقت للموظفين. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}