'use client';

import Link from 'next/link';
import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';

interface ProfileDropdownProps {
  user?: {
    username: string;
    role: string;
    email?: string;
  };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export default function ProfileDropdown({ user, isOpen, setIsOpen, onLogout, isLoggingOut }: ProfileDropdownProps) {
  const { currentTheme } = useTheme();

  const toggleProfileDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleProfileDropdown}
        className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-2xl transition-all duration-300 hover:bg-white/15 backdrop-blur-sm border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
        style={{
          boxShadow: `0 4px 16px ${currentTheme.colors.primaryAccentDark}30`
        }}
      >
        {/* Profile Avatar */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-white/40 hover:ring-white/60 transition-all duration-300 shadow-lg"
          style={{ 
            backgroundColor: currentTheme.colors.primaryAccentLight,
            boxShadow: `0 4px 12px ${currentTheme.colors.primaryAccentDark}40`
          }}
        >
          <User className="w-6 h-6 text-white" />
        </div>
        
        {/* User Name (hidden on mobile) */}
        <div className="hidden lg:block text-right rtl:text-left">
          <p className="text-white text-base font-bold leading-tight">
            {user?.username || 'مدير الموارد البشرية'}
          </p>
          <p className="text-sm font-semibold leading-tight" style={{ color: currentTheme.colors.primaryAccentLight }}>
            {user?.role || 'مدير الموارد البشرية'}
          </p>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-5 h-5 text-white/90 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Profile Dropdown Menu */}
      {isOpen && (
        <>
          {/* Mobile/Tablet Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div 
             className="absolute top-full mt-3 rounded-3xl shadow-2xl border backdrop-blur-md z-50"
             style={{
               backgroundColor: `${currentTheme.colors.cardBg}fa`,
               borderColor: `${currentTheme.colors.borderSecondary}50`,
               boxShadow: `0 20px 40px ${currentTheme.colors.primaryAccentDark}40, 0 8px 24px rgba(0, 0, 0, 0.15)`,
               left: '0',
               right: 'auto',
               width: 'min(384px, calc(100vw - 2rem))',
               maxWidth: 'calc(100vw - 2rem)',
               minWidth: '280px'
             }}
           >
          {/* Profile Header */}
          <div className="p-4 sm:p-6 lg:p-8 border-b" style={{ borderColor: `${currentTheme.colors.borderSecondary}30` }}>
            <div className="flex items-center space-x-5 rtl:space-x-reverse">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center ring-4 ring-white/30 shadow-xl"
                style={{ 
                  backgroundColor: currentTheme.colors.primaryAccentLight,
                  boxShadow: `0 8px 24px ${currentTheme.colors.primaryAccentDark}40`
                }}
              >
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-right rtl:text-left">
                <h3 className="text-xl font-bold leading-tight" style={{ color: currentTheme.colors.textPrimary }}>
                  مرحباً، {user?.username || 'مدير الموارد البشرية'}
                </h3>
                <p className="text-base font-semibold mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  {user?.email || 'hr@company.com'}
                </p>
                <p className="text-sm font-bold mt-2 px-3 py-1.5 rounded-full inline-block" 
                   style={{ 
                     backgroundColor: `${currentTheme.colors.primaryAccent}25`,
                     color: currentTheme.colors.primaryAccent 
                   }}>
                  {user?.role || 'مدير الموارد البشرية'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="p-2 sm:p-3">
            {/* Theme Switcher */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b" style={{ borderColor: `${currentTheme.colors.borderSecondary}30` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.primaryAccent}20`,
                      boxShadow: `0 2px 8px ${currentTheme.colors.primaryAccent}25`
                    }}
                  >
                    <Settings className="w-5 h-5" style={{ color: currentTheme.colors.primaryAccent }} />
                  </div>
                  <span className="text-base font-semibold" style={{ color: currentTheme.colors.textPrimary }}>
                    المظهر
                  </span>
                </div>
                <ThemeSwitcher variant="minimal" size="sm" showLabel={false} />
              </div>
            </div>
            
            {/* Account Management */}
            <Link
              href="/profile"
              className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1"
              style={{ color: currentTheme.colors.textPrimary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${currentTheme.colors.primaryAccent}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">إدارة الحساب</span>
            </Link>
            
            {/* Help & Support */}
            <Link
              href="/help"
              className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1"
              style={{ color: currentTheme.colors.textPrimary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${currentTheme.colors.primaryAccent}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">المساعدة والدعم</span>
            </Link>
            
            {/* Logout */}
            <div className="px-2 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center space-x-3 rtl:space-x-reverse px-4 py-4 bg-red-500/15 hover:bg-red-500/25 text-red-600 border-2 border-red-500/30 hover:border-red-500/50 transition-all duration-200 rounded-2xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>جاري تسجيل الخروج...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-6 h-6" />
                    <span>تسجيل الخروج</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}