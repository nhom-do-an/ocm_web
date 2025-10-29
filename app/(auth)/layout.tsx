import React from 'react'

export const metadata = {
  title: 'Đăng nhập / Đăng ký',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl px-4 py-8">
        {children}
      </div>
    </div>
  )
}
