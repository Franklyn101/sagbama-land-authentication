'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { addDocument } from '@/lib/storage'

interface DocumentUploadFormProps {
  onSuccess: () => void
  handlerName: string
}

export default function DocumentUploadForm({ onSuccess, handlerName }: DocumentUploadFormProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'survey' | 'deed' | 'receipt' | 'certificate' | 'other'>('survey')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!title.trim()) {
      setError('Please enter a document title')
      setLoading(false)
      return
    }

    if (!fileName) {
      setError('Please select a file to upload')
      setLoading(false)
      return
    }

    setTimeout(() => {
      try {
        addDocument({
          title,
          type,
          uploadedBy: handlerName,
          uploadedDate: new Date(),
          status: 'pending',
        })
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } catch {
        setError('Failed to upload document')
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  if (success) {
    return (
      <Card className="p-8 text-center border-border/50 bg-green-50 dark:bg-green-950/30">
        <div className="w-16 h-16 bg-green-200 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Upload Successful</h3>
        <p className="text-green-600 dark:text-green-300">
          Document submitted for verification. You will be notified when verification is complete.
        </p>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Document Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Land Survey Plot 15, Block C"
            required
            className="w-full"
          />
          <p className="text-xs text-foreground/50 mt-1">Provide a descriptive title for the document</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Document Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-border/50 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="survey">Land Survey Certificate</option>
            <option value="deed">Deed of Assignment</option>
            <option value="receipt">Payment Receipt</option>
            <option value="certificate">Ownership Certificate</option>
            <option value="other">Other Document</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Upload File
          </label>
          <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full opacity-0 absolute cursor-pointer"
              style={{ position: 'absolute', width: '1px', height: '1px' }}
            />
            <label className="block cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-foreground/50 mt-1">PNG, JPG, or PDF (max. 10MB)</p>
            </label>
          </div>
          {fileName && (
            <div className="mt-3 p-3 bg-primary/10 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <span className="text-sm text-primary font-medium">{fileName}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? 'Uploading...' : 'Submit for Verification'}
          </Button>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 text-sm text-foreground/70">
          <p className="font-medium mb-2">Note:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Ensure all document details are legible and complete</li>
            <li>Only authorized personnel can verify documents</li>
            <li>You will receive notification once verification is complete</li>
          </ul>
        </div>
      </form>
    </Card>
  )
}
