'use client';

interface AuthViewProps {
  form_type: string; // e.g., 'login' or 'register'
}

import UserAuthForm from '@/sections/auth/user-auth-form'

const AuthView: React.FC<AuthViewProps> = ({ form_type }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col items-center justify-center bg-red-600 text-white p-8">
          <h2 className="text-2xl font-bold mb-2">Chào mừng đến với OCM</h2>
          <p className="text-sm opacity-90">Mua sắm thông minh — giá tốt mỗi ngày.</p>
        </div>

        <div className="p-6">
          <UserAuthForm type={form_type === 'register' ? 'register' : 'login'} />
        </div>
      </div>
    </div>
  )
}

export default AuthView;
