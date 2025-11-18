'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import LoginForm from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">LandAuth</h1>
          <p className="text-foreground/60">
            Sagbama Local Government Land Document Authentication
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-sm text-foreground/70 text-center mb-3 font-semibold">
            Demo Credentials:
          </p>
          <div className="space-y-2 text-xs text-foreground/60">
            <p>Admin: admin@sagbama.gov / admin123</p>
            <p>Officer: officer@sagbama.gov / officer123</p>
            <p>Handler: handler@sagbama.gov / handler123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
