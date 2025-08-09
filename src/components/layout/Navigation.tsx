'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
}

interface NavigationProps {
  navigationItems: NavigationItem[];
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
}

export default function Navigation({ navigationItems, activeDropdown, setActiveDropdown }: NavigationProps) {
  const pathname = usePathname();
  const { currentTheme } = useTheme();

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <nav className="lg:flex items-center space-x-2 xl:space-x-4 rtl:space-x-reverse hidden">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <div key={item.name} className="relative group">
            {item.hasDropdown ? (
              <>
                <button
                  onClick={() => handleDropdownToggle(item.name)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl backdrop-blur-sm border shadow-lg hover:shadow-xl ${
                    isActive
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${currentTheme.colors.primaryAccentLight}50` : 'rgba(255, 255, 255, 0.1)',
                    borderColor: isActive ? `${currentTheme.colors.primaryAccentLight}80` : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isActive ? `0 4px 16px ${currentTheme.colors.primaryAccentDark}40` : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="hidden xl:inline font-bold">{item.name}</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === item.name && (
                  <div 
                    className="absolute top-full left-0 rtl:right-0 mt-3 w-56 rounded-2xl shadow-2xl border py-3 z-50 backdrop-blur-md"
                    style={{
                      backgroundColor: `${currentTheme.colors.cardBg}f8`,
                      borderColor: `${currentTheme.colors.borderSecondary}60`,
                      boxShadow: `0 12px 32px ${currentTheme.colors.primaryAccentDark}30, 0 4px 16px rgba(0, 0, 0, 0.1)`
                    }}
                  >
                    {item.dropdownItems?.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="block px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1"
                        style={{
                          color: currentTheme.colors.textPrimary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${currentTheme.colors.primaryAccent}20`;
                          e.currentTarget.style.color = currentTheme.colors.primaryAccent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = currentTheme.colors.textPrimary;
                        }}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl backdrop-blur-sm border shadow-lg hover:shadow-xl ${
                  isActive
                    ? 'text-white'
                    : 'text-white/90 hover:text-white'
                }`}
                style={{
                  backgroundColor: isActive ? `${currentTheme.colors.primaryAccentLight}50` : 'rgba(255, 255, 255, 0.1)',
                  borderColor: isActive ? `${currentTheme.colors.primaryAccentLight}80` : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isActive ? `0 4px 16px ${currentTheme.colors.primaryAccentDark}40` : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="hidden xl:inline font-bold">{item.name}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}