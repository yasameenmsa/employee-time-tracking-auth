'use client';

import React from 'react';
import { useTheme, useThemeStyles } from '@/contexts/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import { Palette, Settings } from 'lucide-react';

export default function ThemeDemo() {
  const { themeName, currentTheme } = useTheme();
  const themeStyles = useThemeStyles();

  return (
    <div className="p-6 space-y-6">
      {/* Theme Information Card */}
      <div 
        className="rounded-lg p-6 border transition-all duration-300"
        style={{
          backgroundColor: themeStyles.colors.cardBg,
          borderColor: themeStyles.colors.borderSecondary,
          color: themeStyles.colors.textPrimary,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: themeStyles.colors.primaryAccent }} />
            نظام المظاهر المركزي
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>
              المظهر الحالي:
            </span>
            <span 
              className="px-2 py-1 rounded text-sm font-medium"
              style={{
                backgroundColor: themeStyles.colors.primaryAccent,
                color: '#ffffff',
              }}
            >
              {themeName}
            </span>
          </div>
        </div>
        
        <p className="mb-4" style={{ color: themeStyles.colors.textSecondary }}>
          يمكنك تغيير مظهر التطبيق باستخدام أداة تبديل المظاهر أدناه. جميع المكونات ستتحديث تلقائياً.
        </p>
        
        {/* Theme Switcher Demo */}
        <div className="space-y-4">
          <h3 className="font-semibold">أدوات تبديل المظاهر:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dropdown Variant */}
            <div className="space-y-2">
              <label className="text-sm font-medium">القائمة المنسدلة:</label>
              <ThemeSwitcher variant="dropdown" size="md" />
            </div>
            
            {/* Buttons Variant */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الأزرار:</label>
              <ThemeSwitcher variant="buttons" size="sm" showLabel={false} />
            </div>
            
            {/* Minimal Variant */}
            <div className="space-y-2">
              <label className="text-sm font-medium">المبسط:</label>
              <div className="flex items-center gap-2">
                <ThemeSwitcher variant="minimal" size="lg" />
                <span className="text-sm" style={{ color: themeStyles.colors.textSecondary }}>
                  انقر للتبديل
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Display */}
      <div 
        className="rounded-lg p-6 border"
        style={{
          backgroundColor: themeStyles.colors.cardBg,
          borderColor: themeStyles.colors.borderSecondary,
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: themeStyles.colors.textPrimary }}>
          لوحة الألوان الحالية
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(currentTheme.colors).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg border mx-auto mb-2 shadow-sm"
                style={{ 
                  backgroundColor: value,
                  borderColor: themeStyles.colors.borderSecondary,
                }}
              />
              <p className="text-xs font-medium" style={{ color: themeStyles.colors.textPrimary }}>
                {key}
              </p>
              <p className="text-xs" style={{ color: themeStyles.colors.textMuted }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Components Demo */}
      <div 
        className="rounded-lg p-6 border"
        style={{
          backgroundColor: themeStyles.colors.cardBg,
          borderColor: themeStyles.colors.borderSecondary,
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: themeStyles.colors.textPrimary }}>
          مكونات تفاعلية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary Button */}
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style={themeStyles.primaryButtonStyle}
          >
            زر أساسي
          </button>
          
          {/* Secondary Button */}
          <button 
            className="px-4 py-2 rounded-lg font-medium border transition-all duration-200 hover:opacity-90"
            style={themeStyles.secondaryButtonStyle}
          >
            زر ثانوي
          </button>
          
          {/* Input Field */}
          <input 
            type="text"
            placeholder="حقل إدخال"
            className="px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              ...themeStyles.inputStyle,
              '--tw-ring-color': themeStyles.colors.primaryAccent,
            } as React.CSSProperties}
          />
        </div>
        
        {/* Card Example */}
        <div className="mt-6">
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: themeStyles.colors.secondaryBg,
              borderColor: themeStyles.colors.borderSecondary,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5" style={{ color: themeStyles.colors.primaryAccent }} />
              <h4 className="font-semibold" style={{ color: themeStyles.colors.textPrimary }}>
                بطاقة تجريبية
              </h4>
            </div>
            <p style={{ color: themeStyles.colors.textSecondary }}>
              هذه بطاقة تجريبية تُظهر كيفية تطبيق المظاهر على المكونات المختلفة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}