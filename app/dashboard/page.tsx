'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import AdminDashboard from '@/components/dashboards/admin-dashboard'
import OfficerDashboard from '@/components/dashboards/officer-dashboard'
import HandlerDashboard from '@/components/dashboards/handler-dashboard'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/verify')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'officer' && <OfficerDashboard />}
      {user.role === 'handler' && <HandlerDashboard />}
    </DashboardLayout>
  )
}
