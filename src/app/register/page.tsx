'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'فشل في التسجيل');
      }
    } catch (error) {
      setError('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="text-center">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        لديك حساب بالفعل؟{' '}
        <a href="/login" className="font-medium hover:text-accent transition-colors" style={{ color: 'var(--text-accent)' }}>
          تسجيل الدخول
        </a>
      </p>
    </div>
  );

  return (
    <Layout>
      <Card title="إنشاء حسابك" footer={footer}>
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
              type="email"
              placeholder="البريد الإلكتروني (اختياري)"
              value={email}
              onChange={setEmail}
            />
            
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={setPassword}
              required
            />
            
            <Input
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
          </div>

          <Button
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </Button>
        </form>
      </Card>
    </Layout>
  );
}