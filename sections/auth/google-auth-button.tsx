'use client';

import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/redux';
import { loginWithGoogle } from '@/redux/slices/authSlice';
import { cn } from '@/utils';
import { auth } from '../../private/firebase.config';

interface GoogleAuthButtonProps {
  className?: string;
  label?: string;
}

export default function GoogleAuthButton({ className, label }: GoogleAuthButtonProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect') ?? null;
  const [loading, setLoading] = useState(false);

  const buttonLabel = label ?? 'Tiếp tục với Google';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();
      if (!idToken) throw new Error('Failed to obtain Google ID token');

      await dispatch(loginWithGoogle(idToken) as any).unwrap();
      toast.success('Đăng nhập bằng Google thành công');

      if (redirectParam) {
        router.push(redirectParam);
      } else if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Google login error', err);
      toast.error(err?.message || 'Đăng nhập bằng Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={cn('w-full cursor-pointer gap-3 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm', className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.6 8.1 2.9l6-6C34.7 3 29.7 1.5 24 1.5 14.6 1.5 6.8 6.9 3.3 14.8l7.3 5.7C12.6 16.5 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3.6-2.6 6.1-5.6 7.9l8.6 6.6c5-4.6 7.8-11.6 7.8-18.5z" />
          <path fill="#FBBC05" d="M10.6 29.9c-.8-2.4-1.2-4.9-1.2-7.4s.4-5 1.2-7.4L3.3 9.4C1.2 13.1 0 17.4 0 21.9s1.2 8.8 3.3 12.5l7.3-4.5z" />
          <path fill="#34A853" d="M24 46.5c6.1 0 11.3-2 15.1-5.5l-7.3-5.6c-2 1.3-4.6 2.1-7.8 2.1-6.3 0-11.4-5-12.5-11.6L3.3 32.5C6.8 40.4 14.6 45.8 24 45.8z" />
        </svg>
      )}
      {loading ? 'Đang xử lý...' : buttonLabel}
    </Button>
  );
}
