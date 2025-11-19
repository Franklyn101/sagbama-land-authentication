'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isVerifyPage = pathname === '/verify'

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">LandAuth</h1>
                <p className="text-xs text-foreground/60">Sagbama LG</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !isVerifyPage
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/verify"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isVerifyPage
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                Verify Documents
              </Link>
               <Link
                href="/verified-documents"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isVerifyPage
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                Verified Documents
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-foreground/60 capitalize">{user.role}</p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border/50 text-foreground hover:bg-accent/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
