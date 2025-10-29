"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './header'

export default function HeaderGuard() {
  const pathname = usePathname() || ''

  // hide header on auth pages like /login and /register
  const hideOn = ['/login', '/register']
  if (hideOn.includes(pathname)) return null

  return <Header />
}
