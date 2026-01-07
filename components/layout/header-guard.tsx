"use client"

import React, { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './header'

function HeaderSkeleton() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-8 items-center justify-between" />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-80 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="bg-red-600 h-12" />
    </header>
  )
}

export default function HeaderGuard() {
  const pathname = usePathname() || ''

  // hide header on auth pages like /login and /register, and checkout
  const hideOn = ['/login', '/register', '/checkout']
  if (hideOn.includes(pathname)) return null

  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <Header />
    </Suspense>
  )
}
