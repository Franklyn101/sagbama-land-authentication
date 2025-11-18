'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import DocumentUploadForm from '@/components/document-upload-form'
import { getDocuments } from '@/lib/storage'
import type { Document } from '@/lib/storage'

export default function HandlerDashboard() {
  const { user } = useAuth()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    const allDocs = getDocuments().filter(d => d.uploadedBy === user?.name)
    setDocuments(allDocs)
  }

  const handleUploadSuccess = () => {
    setShowUploadForm(false)
    loadDocuments()
  }

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    verified: documents.filter(d => d.status === 'verified').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Document Handler Dashboard</h2>
        <p className="text-foreground/60">Upload and manage land documents for verification</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/50">
          <div className="text-foreground/60 text-xs mb-2">Total Uploads</div>
          <div className="text-3xl font-bold text-primary">{stats.total}</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-foreground/60 text-xs mb-2">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-foreground/60 text-xs mb-2">Verified</div>
          <div className="text-3xl font-bold text-green-600">{stats.verified}</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-foreground/60 text-xs mb-2">Rejected</div>
          <div className="text-3xl font-bold text-destructive">{stats.rejected}</div>
        </Card>
      </div>

      {!showUploadForm ? (
        <Card className="p-8 text-center border-border/50 border-dashed">
          <div className="mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Upload New Document</h3>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Upload land documents for verification. Supported formats: PDF, JPG, PNG
            </p>
            <Button
              onClick={() => setShowUploadForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Upload Document
            </Button>
          </div>
        </Card>
      ) : (
        <div>
          <div className="mb-4">
            <Button
              onClick={() => setShowUploadForm(false)}
              variant="outline"
              className="border-border/50 text-foreground hover:bg-secondary/10"
            >
              ← Back
            </Button>
          </div>
          <DocumentUploadForm
            onSuccess={handleUploadSuccess}
            handlerName={user?.name || 'Unknown'}
          />
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Your Documents</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4 border-border/50 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{doc.title}</h4>
                    <p className="text-sm text-foreground/60">
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} • {new Date(doc.uploadedDate).toLocaleDateString()}
                    </p>
                    {doc.reference && (
                      <p className="text-xs text-accent font-medium mt-1">Ref: {doc.reference}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                    doc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                    doc.status === 'verified' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                    'bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
