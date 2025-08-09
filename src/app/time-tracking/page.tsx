'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeTimeTracker from '@/components/time/EmployeeTimeTracker';
import AdminTimeManager from '@/components/time/AdminTimeManager';
import { Clock } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'employee' | 'admin';
}

export default function TimeTrackingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // User not authenticated, redirect to login
        router.push('/login');
        return;
      }
    } catch (err) {
      setError('Failed to verify authentication');
      router.push('/login');
      return;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user.role === 'admin' ? (
        <AdminTimeManager userId={user.id} userName={user.username} />
      ) : (
        <EmployeeTimeTracker userId={user.id} userName={user.username} />
      )}
    </div>
  );
}