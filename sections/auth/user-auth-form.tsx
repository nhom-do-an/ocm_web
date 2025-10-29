'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { loginUser, registerUser } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleAuthButton from './google-auth-button';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const redirectParam = searchParams?.get('redirect') ?? null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { email, password }

      const result = await dispatch(loginUser(payload) as any).unwrap()
      toast.success('Đăng nhập thành công')

      if (redirectParam) {
        router.push(redirectParam)
      } else if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
      } else {
        router.push('/')
      }
    } catch (err: any) {
      toast.error(err || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" className="bg-red-600" disabled={loading}>
              {loading ? 'Đang...' : 'Đăng nhập'}
            </Button>
          </div>

          {/* Google sign-in */}
          <div>
            <GoogleAuthButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const redirectParam = searchParams?.get('redirect') ?? null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { first_name: firstName, last_name: lastName, phone, password };
      if (email) payload.email = email;

      const result = await dispatch(registerUser(payload) as any).unwrap()
      toast.success('Đăng ký thành công')

      if (redirectParam) {
        router.push(redirectParam)
      } else if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
      } else {
        router.push('/')
      }
    } catch (err: any) {
      toast.error(err || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Tên*</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tên"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Họ*</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Họ"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại*</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email*</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu*</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" className="bg-red-600" disabled={loading}>
              {loading ? 'Đang...' : 'Đăng ký'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function UserAuthForm({ type }: { type: 'login' | 'register' }) {
  return type === 'login' ? <LoginForm /> : <RegisterForm />;
}
