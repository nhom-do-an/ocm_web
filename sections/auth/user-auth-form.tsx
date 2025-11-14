'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { Mail, Lock, Phone, User, Loader2, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/redux';
import { loginUser, registerUser } from '@/redux/slices/authSlice';
import { loginSchema, registerSchema } from '@/lib/form-schema';
import GoogleAuthButton from './google-auth-button';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label: string;
  optionalLabel?: React.ReactNode;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ icon, label, optionalLabel, error, className, ...props }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm font-medium text-gray-600">
        <label>{label}</label>
        {optionalLabel}
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <Input
          className={`h-12 rounded-xl border-gray-200 bg-white pl-11 text-sm shadow-sm transition focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
            error ? 'border-red-500 focus:border-red-500' : ''
          } ${className ?? ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect') ?? null;

  const redirectSuffix = useMemo(
    () => (redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''),
    [redirectParam]
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof typeof fieldErrors] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const validateField = (field: 'email' | 'password', value: string) => {
    try {
      if (field === 'email') {
        loginSchema.pick({ email: true }).parse({ email: value });
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else {
        loginSchema.pick({ password: true }).parse({ password: value });
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issue = err.issues[0];
        if (issue && issue.path[0] === field) {
          setErrors((prev) => ({ ...prev, [field]: issue.message }));
        }
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateField('email', value);
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      validateField('password', value);
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload: any = { email, password };

      await dispatch(loginUser(payload) as any).unwrap();
      toast.success('Đăng nhập thành công');

      if (redirectParam) {
        router.push(redirectParam);
      } else if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = useMemo(() => {
    try {
      loginSchema.parse({ email, password });
      return true;
    } catch {
      return false;
    }
  }, [email, password]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <Home className="h-4 w-4" />
          Quay về trang chủ
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-5">
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            icon={<Mail className="h-5 w-5" />}
            autoComplete="email"
            required
            error={errors.email}
          />

          <AuthInput
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={handlePasswordChange}
            icon={<Lock className="h-5 w-5" />}
            autoComplete="current-password"
            required
            error={errors.password}
            optionalLabel={
              <Link href="/forgot-password" className="text-xs font-semibold text-red-500 hover:text-red-600">
                Quên mật khẩu?
              </Link>
            }
          />

          <Button
            type="submit"
            size="lg"
            className="w-full cursor-pointer rounded-xl bg-red-600 text-base font-semibold shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isFormValid}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>

          <div className="relative text-center text-sm text-gray-400">
            <span className="relative z-10 bg-white px-3">Hoặc</span>
            <div className="absolute inset-x-0 top-1/2 -z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          <GoogleAuthButton className="h-12 rounded-xl border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50" />
        </form>

      <div className="pt-4 text-center text-sm text-gray-500">
        <span>Chưa có tài khoản? </span>
        <Link href={`/register${redirectSuffix}`} className="font-semibold text-red-600 hover:text-red-700">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect') ?? null;

  const redirectSuffix = useMemo(
    () => (redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''),
    [redirectParam]
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    try {
      registerSchema.parse({ firstName, lastName, phone, email, password });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: {
          firstName?: string;
          lastName?: string;
          phone?: string;
          email?: string;
          password?: string;
        } = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof typeof fieldErrors] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const validateRegisterField = (
    field: 'firstName' | 'lastName' | 'phone' | 'email' | 'password',
    value: string
  ) => {
    try {
      if (field === 'firstName') {
        registerSchema.pick({ firstName: true }).parse({ firstName: value });
        setErrors((prev) => ({ ...prev, firstName: undefined }));
      } else if (field === 'lastName') {
        registerSchema.pick({ lastName: true }).parse({ lastName: value });
        setErrors((prev) => ({ ...prev, lastName: undefined }));
      } else if (field === 'phone') {
        registerSchema.pick({ phone: true }).parse({ phone: value });
        setErrors((prev) => ({ ...prev, phone: undefined }));
      } else if (field === 'email') {
        registerSchema.pick({ email: true }).parse({ email: value });
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else {
        registerSchema.pick({ password: true }).parse({ password: value });
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issue = err.issues[0];
        if (issue && issue.path[0] === field) {
          setErrors((prev) => ({ ...prev, [field]: issue.message }));
        }
      }
    }
  };

  const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Chỉ cho phép nhập số cho số điện thoại, bắt đầu bằng 0
    if (field === 'phone') {
      // Chỉ cho phép số
      value = value.replace(/[^0-9]/g, '');
      // Phải bắt đầu bằng 0
      if (value && !value.startsWith('0')) {
        value = '0' + value.replace(/^0+/, '');
      }
      // Giới hạn độ dài 10 số (0 + 9 số)
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }
    
    switch (field) {
      case 'firstName':
        setFirstName(value);
        if (value) {
          validateRegisterField('firstName', value);
        } else {
          setErrors((prev) => ({ ...prev, firstName: undefined }));
        }
        break;
      case 'lastName':
        setLastName(value);
        if (value) {
          validateRegisterField('lastName', value);
        } else {
          setErrors((prev) => ({ ...prev, lastName: undefined }));
        }
        break;
      case 'phone':
        setPhone(value);
        if (value) {
          validateRegisterField('phone', value);
        } else {
          setErrors((prev) => ({ ...prev, phone: undefined }));
        }
        break;
      case 'email':
        setEmail(value);
        if (value) {
          validateRegisterField('email', value);
        } else {
          setErrors((prev) => ({ ...prev, email: undefined }));
        }
        break;
      case 'password':
        setPassword(value);
        if (value) {
          validateRegisterField('password', value);
        } else {
          setErrors((prev) => ({ ...prev, password: undefined }));
        }
        break;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload: any = { first_name: firstName, last_name: lastName, phone, password };
      if (email) payload.email = email;

      await dispatch(registerUser(payload) as any).unwrap();
      toast.success('Đăng ký thành công');

      if (redirectParam) {
        router.push(redirectParam);
      } else if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = useMemo(() => {
    try {
      registerSchema.parse({ firstName, lastName, phone, email, password });
      return true;
    } catch {
      return false;
    }
  }, [firstName, lastName, phone, email, password]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Đăng ký</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <Home className="h-4 w-4" />
          Quay về trang chủ
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthInput
              label="Tên*"
              placeholder="Nguyễn"
              value={firstName}
              onChange={handleFieldChange('firstName')}
              icon={<User className="h-5 w-5" />}
              required
              error={errors.firstName}
            />
            <AuthInput
              label="Họ*"
              placeholder="Văn A"
              value={lastName}
              onChange={handleFieldChange('lastName')}
              icon={<User className="h-5 w-5" />}
              required
              error={errors.lastName}
            />
          </div>

          <AuthInput
            label="Số điện thoại*"
            type="tel"
            placeholder="0987654321"
            value={phone}
            onChange={handleFieldChange('phone')}
            icon={<Phone className="h-5 w-5" />}
            required
            error={errors.phone}
            inputMode="numeric"
          />

          <AuthInput
            label="Email*"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleFieldChange('email')}
            icon={<Mail className="h-5 w-5" />}
            required
            error={errors.email}
          />

          <AuthInput
            label="Mật khẩu*"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            value={password}
            onChange={handleFieldChange('password')}
            icon={<Lock className="h-5 w-5" />}
            required
            error={errors.password}
            optionalLabel={<span className="text-xs text-gray-400">Tối thiểu 8 ký tự, có chữ, số và ký tự đặc biệt</span>}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full cursor-pointer rounded-xl bg-red-600 text-base font-semibold shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isFormValid}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>

      <div className="pt-4 text-center text-sm text-gray-500">
        <span>Đã có tài khoản? </span>
        <Link href={`/login${redirectSuffix}`} className="font-semibold text-red-600 hover:text-red-700">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default function UserAuthForm({ type }: { type: 'login' | 'register' }) {
  return type === 'login' ? <LoginForm /> : <RegisterForm />;
}
