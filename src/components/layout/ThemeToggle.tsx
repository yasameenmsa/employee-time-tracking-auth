'use client';

import ThemeSwitcher from '../ui/ThemeSwitcher';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  return (
    <div className={`${className}`}>
      <ThemeSwitcher />
    </div>
  );
}