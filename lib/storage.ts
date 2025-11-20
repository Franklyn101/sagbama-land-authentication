// lib/storage.ts
export interface Document {
  id: string
  counselName: string
  counselAddress: string
  counselContact: string
  documentType: string
  vendorName: string
  vendorAddress: string
  purchaserName: string
  purchaserAddress: string
  subjectMatter: string
  purchaseValue: string
  legalFee: string
  branchCommission: string
  executionDate: string
  bainNumber: string
  counselPhoto: string
  createdAt: string
  updatedAt: string
  status: 'pending' | 'verified' | 'rejected' // Add status field
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}

// Add document function
export async function addDocument(document: Document): Promise<void> {
  return saveDocument(document)
}

export async function saveDocument(document: Document): Promise<void> {
  if (typeof window === 'undefined') return
  
  const documents = getDocumentsFromStorage()
  documents.set(document.id, document)
  localStorage.setItem('documents', JSON.stringify(Array.from(documents.entries())))
}

export async function updateDocument(id: string, updates: Partial<Document>): Promise<void> {
  if (typeof window === 'undefined') return
  
  const documents = getDocumentsFromStorage()
  const existingDocument = documents.get(id)
  
  if (existingDocument) {
    const updatedDocument = {
      ...existingDocument,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    documents.set(id, updatedDocument)
    localStorage.setItem('documents', JSON.stringify(Array.from(documents.entries())))
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  if (typeof window === 'undefined') return null
  
  const documents = getDocumentsFromStorage()
  return documents.get(id) || null
}

export async function getDocuments(): Promise<Document[]> {
  if (typeof window === 'undefined') return []
  
  const documents = getDocumentsFromStorage()
  return Array.from(documents.values())
}

export async function getPendingDocuments(): Promise<Document[]> {
  if (typeof window === 'undefined') return []
  
  const documents = getDocumentsFromStorage()
  return Array.from(documents.values()).filter(doc => doc.status === 'pending')
}

export async function getVerifiedDocuments(): Promise<Document[]> {
  if (typeof window === 'undefined') return []
  
  const documents = getDocumentsFromStorage()
  return Array.from(documents.values()).filter(doc => doc.status === 'verified')
}

export async function getRejectedDocuments(): Promise<Document[]> {
  if (typeof window === 'undefined') return []
  
  const documents = getDocumentsFromStorage()
  return Array.from(documents.values()).filter(doc => doc.status === 'rejected')
}

// Delete document function
export async function deleteDocument(id: string): Promise<void> {
  if (typeof window === 'undefined') return
  
  const documents = getDocumentsFromStorage()
  documents.delete(id)
  localStorage.setItem('documents', JSON.stringify(Array.from(documents.entries())))
}

// Verify document function
export async function verifyDocument(id: string, verifiedBy: string): Promise<void> {
  await updateDocument(id, {
    status: 'verified',
    verifiedBy,
    verifiedAt: new Date().toISOString()
  })
}

// Reject document function
export async function rejectDocument(id: string, rejectedBy: string, reason: string): Promise<void> {
  await updateDocument(id, {
    status: 'rejected',
    verifiedBy: rejectedBy,
    verifiedAt: new Date().toISOString(),
    rejectionReason: reason
  })
}

function getDocumentsFromStorage(): Map<string, Document> {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const stored = localStorage.getItem('documents')
    if (!stored) return new Map()
    
    const entries = JSON.parse(stored) as [string, Document][]
    return new Map(entries)
  } catch {
    return new Map()
  }
}

// Initialize with some sample data if empty
export async function initializeSampleData(): Promise<void> {
  if (typeof window === 'undefined') return
  
  const documents = getDocumentsFromStorage()
  if (documents.size === 0) {
    const sampleDocuments: Document[] = [
      {
        id: 'doc_1',
        counselName: 'John Doe',
        counselAddress: '123 Legal Street, Abuja',
        counselContact: '+2348012345678',
        documentType: 'Deed of Conveyance',
        vendorName: 'ABC Properties Ltd',
        vendorAddress: '456 Business Ave, Lagos',
        purchaserName: 'Jane Smith',
        purchaserAddress: '789 Residential Rd, Port Harcourt',
        subjectMatter: 'Plot 123, GRA Phase 2',
        purchaseValue: '₦50,000,000',
        legalFee: '₦2,500,000',
        branchCommission: '₦500,000',
        executionDate: '2024-01-15',
        bainNumber: 'BAIN12345',
        counselPhoto: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc_2',
        counselName: 'Sarah Johnson',
        counselAddress: '321 Law Chambers, Lagos',
        counselContact: '+2348098765432',
        documentType: 'Assignment',
        vendorName: 'XYZ Holdings',
        vendorAddress: '789 Corporate Way, Abuja',
        purchaserName: 'Michael Brown',
        purchaserAddress: '123 Home Street, Ibadan',
        subjectMatter: 'Block 45, Commercial Layout',
        purchaseValue: '₦75,000,000',
        legalFee: '₦3,750,000',
        branchCommission: '₦750,000',
        executionDate: '2024-01-20',
        bainNumber: 'BAIN67890',
        counselPhoto: '',
        status: 'verified',
        verifiedBy: 'admin@nba.org',
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]

    sampleDocuments.forEach(doc => {
      documents.set(doc.id, doc)
    })
    
    localStorage.setItem('documents', JSON.stringify(Array.from(documents.entries())))
  }
}