'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { getVerifiedDocuments } from '@/lib/storage'
import type { Document } from '@/lib/storage'

export default function VerifiedDocumentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (user) {
      setDocuments(getVerifiedDocuments())
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

  const filteredDocs = filterType === 'all'
    ? documents
    : documents.filter(d => d.type === filterType)

  const documentTypes = ['all', ...new Set(documents.map(d => d.type))]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Verified Documents</h2>
          <p className="text-foreground/60">View all authenticated land documents in the system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Total Verified</div>
            <div className="text-4xl font-bold text-green-600">{documents.length}</div>
          </Card>
          <Card className="p-6 border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Surveys</div>
            <div className="text-4xl font-bold text-blue-600">{documents.filter(d => d.type === 'survey').length}</div>
          </Card>
          <Card className="p-6 border-border/50 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Deeds</div>
            <div className="text-4xl font-bold text-purple-600">{documents.filter(d => d.type === 'deed').length}</div>
          </Card>
          <Card className="p-6 border-border/50 bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Certificates</div>
            <div className="text-4xl font-bold text-orange-600">{documents.filter(d => d.type === 'certificate').length}</div>
          </Card>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {documentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/10 text-foreground/70 hover:bg-secondary/20'
              }`}
            >
              {type === 'all' ? 'All Documents' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {filteredDocs.length === 0 ? (
          <Card className="p-12 text-center border-border/50">
            <p className="text-foreground/60">No documents found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="p-5 border-border/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm leading-tight flex-1">{doc.title}</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded font-medium whitespace-nowrap ml-2">
                    Verified
                  </span>
                </div>
                
                <div className="space-y-2 text-xs text-foreground/60">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="text-foreground font-medium capitalize">{doc.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="text-primary font-mono font-bold">{doc.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified By:</span>
                    <span className="text-foreground font-medium">{doc.verifiedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-foreground font-medium">
                      {new Date(doc.verificationDate!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
