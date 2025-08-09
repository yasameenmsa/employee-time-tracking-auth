'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call logout API
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Clear any client-side storage if needed
          localStorage.removeItem('user');
          sessionStorage.clear();
          
          // Redirect to login page
          router.push('/login');
        } else {
          console.error('Logout failed');
          // Still redirect to login on failure
          router.push('/login');
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Redirect to login even on error
        router.push('/login');
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LogOut className="w-12 h-12 animate-pulse mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          جاري تسجيل الخروج...
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          سيتم توجيهك إلى صفحة تسجيل الدخول
        </p>
      </div>
    </div>
  );
}