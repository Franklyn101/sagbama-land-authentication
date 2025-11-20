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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = async () => {
      if (!isLoading && !user) {
        router.push('/login')
        return
      }
      
      if (user) {
        try {
          setLoading(true)
          const verifiedDocs = await getVerifiedDocuments()
          setDocuments(verifiedDocs)
        } catch (error) {
          console.error('Error loading verified documents:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadDocuments()
  }, [user, isLoading, router])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  // Use documentType instead of type, and filter properly
  const filteredDocs = filterType === 'all'
    ? documents
    : documents.filter(d => d.documentType.toLowerCase().includes(filterType.toLowerCase()))

  // Get unique document types from the actual data
  const documentTypes = ['all', ...new Set(documents.map(d => d.documentType))]

  // Helper function to get document category for stats
  const getDocumentCategory = (docType: string) => {
    const type = docType.toLowerCase()
    if (type.includes('survey') || type.includes('plan')) return 'survey'
    if (type.includes('deed') || type.includes('conveyance')) return 'deed'
    if (type.includes('certificate') || type.includes('title')) return 'certificate'
    return 'other'
  }

  // Calculate statistics
  const totalVerified = documents.length
  const surveys = documents.filter(d => getDocumentCategory(d.documentType) === 'survey').length
  const deeds = documents.filter(d => getDocumentCategory(d.documentType) === 'deed').length
  const certificates = documents.filter(d => getDocumentCategory(d.documentType) === 'certificate').length

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
            <div className="text-4xl font-bold text-green-600">{totalVerified}</div>
          </Card>
          <Card className="p-6 border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Surveys</div>
            <div className="text-4xl font-bold text-blue-600">{surveys}</div>
          </Card>
          <Card className="p-6 border-border/50 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Deeds</div>
            <div className="text-4xl font-bold text-purple-600">{deeds}</div>
          </Card>
          <Card className="p-6 border-border/50 bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="text-foreground/60 text-sm mb-2">Certificates</div>
            <div className="text-4xl font-bold text-orange-600">{certificates}</div>
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
              {type === 'all' ? 'All Documents' : type}
            </button>
          ))}
        </div>

        {filteredDocs.length === 0 ? (
          <Card className="p-12 text-center border-border/50">
            <p className="text-foreground/60">
              {documents.length === 0 ? 'No verified documents found' : 'No documents match your filter'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="p-5 border-border/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm leading-tight flex-1">
                    {doc.documentType}
                  </h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded font-medium whitespace-nowrap ml-2">
                    Verified
                  </span>
                </div>
                
                <div className="space-y-2 text-xs text-foreground/60 mb-3">
                  <div className="flex justify-between">
                    <span>Vendor:</span>
                    <span className="text-foreground font-medium text-right max-w-[120px] truncate">
                      {doc.vendorName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purchaser:</span>
                    <span className="text-foreground font-medium text-right max-w-[120px] truncate">
                      {doc.purchaserName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span className="text-foreground font-medium text-right max-w-[120px] truncate">
                      {doc.subjectMatter}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-foreground/60 border-t pt-3">
                  <div className="flex justify-between">
                    <span>Document Type:</span>
                    <span className="text-foreground font-medium capitalize">{doc.documentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="text-primary font-mono font-bold text-xs">
                      {doc.bainNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified By:</span>
                    <span className="text-foreground font-medium text-xs">
                      {doc.verifiedBy || 'System'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Verified:</span>
                    <span className="text-foreground font-medium text-xs">
                      {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Executed:</span>
                    <span className="text-foreground font-medium text-xs">
                      {doc.executionDate ? new Date(doc.executionDate).toLocaleDateString() : 'N/A'}
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