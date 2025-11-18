import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 p-10 flex items-center justify-center">
              <Link href="/" className="flex items-center gap-2">
          <div className="flex  items-center justify-center rounded-lg  ">
            <Image src="/BYS-LOGO-PNG_1.png" alt="Logo" width={70} height={70} />
            <span>Sagbama land authentication</span>
          </div>
         
        </Link>
             </div>
          </div>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

     {/* Hero Section */}
<section
  className="relative bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage:
      "url('/valerie-v-5Rp0rkDziGY-unsplash.jpg')", // Replace with your own land/surveying/government image
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative max-w-5xl mx-auto px-4 py-28 text-white">
    <div className="max-w-2xl space-y-6">
      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
        Secure Land Document Authentication for Sagbama LG
      </h2>

      <p className="text-lg text-white/80">
        A trusted and restricted verification platform for authorized personnel 
        to authenticate land documents with accuracy, transparency, and security.
      </p>

      <Link href="/verify">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
          Access System
        </Button>
      </Link>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="bg-card/50 border-y border-border/30 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">System Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border border-border/50">
              <div className="text-4xl mb-4">🔐</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Secure Access</h4>
              <p className="text-foreground/70 text-sm">
                Role-based authentication ensures only authorized personnel can access the system and sensitive documents.
              </p>
            </Card>
            <Card className="p-6 bg-card border border-border/50">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Document Verification</h4>
              <p className="text-foreground/70 text-sm">
                Complete verification workflow with authentication certificates and unique reference numbers for each document.
              </p>
            </Card>
            <Card className="p-6 bg-card border border-border/50">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Complete Audit Trail</h4>
              <p className="text-foreground/70 text-sm">
                Track all document submissions, verifications, and actions with full transparency and accountability.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-foreground mb-12 text-center">User Roles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 bg-card border border-border/50">
            <h4 className="text-xl font-bold text-foreground mb-4">👨‍💼 System Administrator</h4>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>✓ Manage system users and roles</li>
              <li>✓ View system statistics and reports</li>
              <li>✓ Monitor document authentication flow</li>
              <li>✓ Configure system settings</li>
            </ul>
          </Card>
          <Card className="p-8 bg-card border border-border/50">
            <h4 className="text-xl font-bold text-foreground mb-4">🔍 Verification Officer</h4>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>✓ Review submitted documents</li>
              <li>✓ Verify and authenticate documents</li>
              <li>✓ Reject documents with feedback</li>
              <li>✓ View authenticated documents</li>
            </ul>
          </Card>
          <Card className="p-8 bg-card border border-border/50">
            <h4 className="text-xl font-bold text-foreground mb-4">📁 Document Handler</h4>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>✓ Upload land documents</li>
              <li>✓ Track submission status</li>
              <li>✓ View authentication certificates</li>
              <li>✓ Access uploaded documents</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="bg-card/50 border-y border-border/30 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Demo Access Credentials</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-background border border-border/50 font-mono text-sm">
              <div className="mb-3">
                <p className="text-foreground/60 text-xs uppercase font-semibold mb-1">Admin</p>
                <p className="text-foreground">admin@sagbama.gov</p>
                <p className="text-foreground">admin123</p>
              </div>
            </Card>
            <Card className="p-6 bg-background border border-border/50 font-mono text-sm">
              <div className="mb-3">
                <p className="text-foreground/60 text-xs uppercase font-semibold mb-1">Verification Officer</p>
                <p className="text-foreground">officer@sagbama.gov</p>
                <p className="text-foreground">officer123</p>
              </div>
            </Card>
            <Card className="p-6 bg-background border border-border/50 font-mono text-sm">
              <div className="mb-3">
                <p className="text-foreground/60 text-xs uppercase font-semibold mb-1">Document Handler</p>
                <p className="text-foreground">handler@sagbama.gov</p>
                <p className="text-foreground">handler123</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
          <p className="text-lg opacity-90">
            Access the secure authentication system with your authorized credentials
          </p>
          <Link href="/login">
            <Button className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary px-8 py-6 text-base font-semibold">
              Sign In Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>&copy; 2025 Sagbama Local Government Authority. Land Document Authentication System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
