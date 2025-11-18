'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPendingDocuments, updateDocument, getVerifiedDocuments } from '@/lib/storage'
import { useAuth } from '@/components/auth-provider'
import type { Document } from '@/lib/storage'

export default function OfficerDashboard() {
  const { user } = useAuth()
  const [pendingDocs, setPendingDocs] = useState<Document[]>([])
  const [verifiedDocs, setVerifiedDocs] = useState<Document[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending')
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    setPendingDocs(getPendingDocuments())
    setVerifiedDocs(getVerifiedDocuments())
  }

  const handleApprove = (docId: string) => {
    if (!user) return
    const updatedDoc = updateDocument(docId, {
      status: 'verified',
      verifiedBy: user.name,
      verificationDate: new Date(),
      notes: notes || 'Verified by ' + user.name,
      reference: `LDC-${new Date().getFullYear()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
    })
    if (updatedDoc) {
      loadDocuments()
      setSelectedDoc(null)
      setNotes('')
    }
  }

  const handleReject = (docId: string) => {
    if (!user) return
    const updatedDoc = updateDocument(docId, {
      status: 'rejected',
      verifiedBy: user.name,
      verificationDate: new Date(),
      notes: notes || 'Rejected - requires further review',
    })
    if (updatedDoc) {
      loadDocuments()
      setSelectedDoc(null)
      setNotes('')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Verification Officer Dashboard</h2>
        <p className="text-foreground/60">Review and authenticate land documents for Sagbama LG</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
          <div className="text-foreground/60 text-sm mb-2">Pending Review</div>
          <div className="text-4xl font-bold text-yellow-600">{pendingDocs.length}</div>
        </Card>
        <Card className="p-6 border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
          <div className="text-foreground/60 text-sm mb-2">Verified Documents</div>
          <div className="text-4xl font-bold text-green-600">{verifiedDocs.length}</div>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-border/50">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          Pending ({pendingDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'verified'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          Verified ({verifiedDocs.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'pending' && (
            <div className="space-y-3">
              {pendingDocs.length === 0 ? (
                <Card className="p-8 text-center border-border/50">
                  <p className="text-foreground/60">No pending documents</p>
                </Card>
              ) : (
                pendingDocs.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`p-4 border-border/50 cursor-pointer transition-all ${
                      selectedDoc?.id === doc.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{doc.title}</h4>
                        <p className="text-sm text-foreground/60">
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} • Uploaded by {doc.uploadedBy}
                        </p>
                        <p className="text-xs text-foreground/40 mt-1">
                          {new Date(doc.uploadedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 text-xs rounded font-medium">
                        Pending
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'verified' && (
            <div className="space-y-3">
              {verifiedDocs.length === 0 ? (
                <Card className="p-8 text-center border-border/50">
                  <p className="text-foreground/60">No verified documents yet</p>
                </Card>
              ) : (
                verifiedDocs.map((doc) => (
                  <Card key={doc.id} className="p-4 border-border/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{doc.title}</h4>
                        <p className="text-sm text-foreground/60">
                          Ref: {doc.reference}
                        </p>
                        <p className="text-xs text-foreground/40 mt-1">
                          Verified {new Date(doc.verificationDate!).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-700 text-xs rounded font-medium">
                        Verified
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {activeTab === 'pending' && selectedDoc && (
          <Card className="border-border/50 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-foreground mb-4">Document Details</h3>
            <div className="space-y-3 text-sm mb-6">
              <div>
                <p className="text-foreground/60 text-xs">Title</p>
                <p className="text-foreground font-medium">{selectedDoc.title}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Type</p>
                <p className="text-foreground font-medium capitalize">{selectedDoc.type}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Uploaded By</p>
                <p className="text-foreground font-medium">{selectedDoc.uploadedBy}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Uploaded Date</p>
                <p className="text-foreground font-medium">{new Date(selectedDoc.uploadedDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add verification notes..."
                  className="w-full p-2 border border-border/50 rounded bg-background text-foreground text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleApprove(selectedDoc.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(selectedDoc.id)}
                  variant="outline"
                  className="flex-1 border-border/50 text-foreground hover:bg-destructive/10"
                >
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
