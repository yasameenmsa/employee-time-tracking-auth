'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeName } from '@/styles/theme';
import { Palette, ChevronDown, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const themeDisplayNames: Record<ThemeName, string> = {
  default: 'الافتراضي (أخضر)',
  blue: 'أزرق',
  purple: 'بنفسجي',
  red: 'أحمر',
};

const themeColors: Record<ThemeName, string> = {
  default: '#00d4aa',
  blue: '#3182ce',
  purple: '#805ad5',
  red: '#e53e3e',
};

export default function ThemeSwitcher({ 
  className = '', 
  variant = 'dropdown',
  size = 'md',
  showLabel = true 
}: ThemeSwitcherProps) {
  const { themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => {
          const currentIndex = availableThemes.indexOf(themeName);
          const nextIndex = (currentIndex + 1) % availableThemes.length;
          setTheme(availableThemes[nextIndex]);
        }}
        className={`inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: themeColors[themeName] }}
        title="تغيير المظهر"
      >
        <Palette className={`text-white ${iconSizes[size]}`} />
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2 rtl:mr-2">
            المظهر:
          </span>
        )}
        <div className="flex space-x-1 rtl:space-x-reverse">
          {availableThemes.map((theme) => (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              className={`${sizeClasses[size]} rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                themeName === theme
                  ? 'border-current shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                backgroundColor: themeName === theme ? themeColors[theme] : 'transparent',
                color: themeName === theme ? 'white' : themeColors[theme],
                borderColor: themeColors[theme],
              }}
              title={themeDisplayNames[theme]}
            >
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: themeColors[theme] }}
                />
                <span className="hidden sm:inline">{themeDisplayNames[theme]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          المظهر
        </label>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm ${sizeClasses[size]} text-right rtl:text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200`}
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: themeColors[themeName] }}
            />
            <span className="text-gray-900 dark:text-gray-100">
              {themeDisplayNames[themeName]}
            </span>
          </div>
          <ChevronDown 
            className={`${iconSizes[size]} text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
              {availableThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-right rtl:text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    themeName === theme ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: themeColors[theme] }}
                    />
                    <span className="text-gray-900 dark:text-gray-100">
                      {themeDisplayNames[theme]}
                    </span>
                  </div>
                  {themeName === theme && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}