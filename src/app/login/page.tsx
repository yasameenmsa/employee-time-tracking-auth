'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'فشل في تسجيل الدخول');
      }
    } catch (_error) {
      setError('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="text-center">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        ليس لديك حساب؟{' '}
        <a href="/register" className="font-medium hover:text-accent transition-colors" style={{ color: 'var(--text-accent)' }}>
          إنشاء حساب جديد
        </a>
      </p>
    </div>
  );

  return (
    <Layout>
      <Card title="تسجيل الدخول" footer={footer}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorMessage message={error} />
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={setUsername}
              required
            />
            
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={setPassword}
              required
            />
          </div>

          <Button
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </Card>
    </Layout>
  );
}
