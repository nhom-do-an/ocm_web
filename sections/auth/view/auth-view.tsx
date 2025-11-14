'use client';

import Link from 'next/link';
import UserAuthForm from '@/sections/auth/user-auth-form';

interface AuthViewProps {
  form_type: string; // e.g., 'login' or 'register'
}

const AuthView: React.FC<AuthViewProps> = ({ form_type }) => {
  const isRegister = form_type === 'register';

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-12 lg:px-8">
        <div className="w-full">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
              <Link href="/" className="inline-block text-2xl font-bold text-red-600 hover:text-red-700">
                OCM Store
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white/95 p-8 shadow-xl backdrop-blur sm:p-10">
              <UserAuthForm type={isRegister ? 'register' : 'login'} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthView;
