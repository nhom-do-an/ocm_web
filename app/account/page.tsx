"use client"

import React from 'react'
import UserAuthForm from '@/sections/auth/user-auth-form'

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <UserAuthForm type="login" />
      </div>
    </div>
  )
}
