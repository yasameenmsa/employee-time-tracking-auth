'use client';

import Link from 'next/link';
import { Building2, Mail } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Logo() {
  const { currentTheme } = useTheme();

  return (
    <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 rtl:space-x-reverse">
      <Link href="/" className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse group">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ring-2 ring-white/30 transition-all duration-300 group-hover:scale-105 group-hover:ring-white/50 shadow-lg"
          style={{ 
            backgroundColor: currentTheme.colors.primaryAccentLight,
            boxShadow: `0 4px 16px ${currentTheme.colors.primaryAccentDark}40`
          }}
        >
          <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-white font-bold text-lg lg:text-xl xl:text-2xl tracking-wide leading-tight hidden">
            شركة المستقبل
          </h1>
          <p className="text-sm lg:text-base font-medium leading-tight hidden" style={{ color: currentTheme.colors.primaryAccentLight }}>
            نظام إدارة الموارد البشرية
          </p>
        </div>
      </Link>
      
      {/* Email Badge */}
      <div className="hidden xl:flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300">
        <Mail className="w-4 h-4 text-white" />
        <span className="text-sm font-semibold text-white">hr@company.com</span>
      </div>
    </div>
  );
}