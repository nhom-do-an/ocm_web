"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from './footer'

export default function FooterGuard() {
  const pathname = usePathname() || ''
  const hideOn = ['/login', '/register']
  if (hideOn.includes(pathname)) return null

  return <Footer />
}
