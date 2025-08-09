'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, BarChart3, FileText, Calendar, Settings, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from './Logo';
import Navigation from './Navigation';
import ProfileDropdown from './ProfileDropdown';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  user?: {
    username: string;
    role: string;
    email?: string;
  };
}

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
}

const navigationItems: NavigationItem[] = [
  { 
    name: 'آلية التحكم', 
    href: '/control-mechanism',
    icon: Settings,
    hasDropdown: true,
    dropdownItems: [
      { name: 'لوحة التحكم', href: '/dashboard' },
      { name: 'الإعدادات', href: '/settings' }
    ]
  },
  { 
    name: 'تتبع الوقت', 
    href: '/time-tracking',
    icon: Clock
  },
  { 
    name: 'جدول الأوقات', 
    href: '/schedule',
    icon: Calendar,
    hasDropdown: true,
    dropdownItems: [
      { name: 'الجدول الأسبوعي', href: '/schedule/weekly' },
      { name: 'الجدول الشهري', href: '/schedule/monthly' }
    ]
  },
  { name: 'التقارير', href: '/reports', icon: FileText },
  { name: 'الإحصائيات', href: '/statistics', icon: BarChart3 }
];

export default function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { currentTheme } = useTheme();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: `${currentTheme.colors.headerBg}95`,
        borderColor: `${currentTheme.colors.borderPrimary}40`,
        boxShadow: `0 4px 20px ${currentTheme.colors.shadowColor}15`
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Section */}
          <Logo />

          {/* Desktop Navigation */}
          <Navigation 
            navigationItems={navigationItems}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />

          {/* Right Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Theme Switcher */}
            {/* <ThemeToggle className="hidden lg:block" /> */}

            {/* Profile Dropdown */}
            <ProfileDropdown 
              user={user}
              isOpen={isProfileDropdownOpen}
              setIsOpen={setIsProfileDropdownOpen}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                console.log('Mobile menu button clicked'); // Add for debugging
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden p-3 transition-all duration-300 rounded-2xl border hover:scale-110 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: `${currentTheme.colors.cardBg}80`,
                borderColor: `${currentTheme.colors.borderSecondary}40`,
                color: currentTheme.colors.primaryAccent,
                boxShadow: `0 4px 15px ${currentTheme.colors.shadowColor}15`
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Overlay for dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
      
      {/* Overlay for profile dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
}