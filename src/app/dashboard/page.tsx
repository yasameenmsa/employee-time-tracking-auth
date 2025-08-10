'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import HRDashboard from '@/components/dashboard/HRDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';
import LogoutButton from '@/components/ui/LogoutButton';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg" style={{ color: 'var(--text-primary)' }}>جاري التحميل...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const headerActions = (
    <div className="flex items-center">
      <LogoutButton />
    </div>
  );

  // Render role-based dashboard
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'HR':
        return <HRDashboard user={user} />;
      case 'employees':
      default:
        return <EmployeeDashboard user={user} />;
    }
  };

  return (
    <Layout headerActions={headerActions}>
      {renderDashboard()}
    </Layout>
  );
}
