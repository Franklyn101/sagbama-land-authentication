// Mock document storage
export interface Document {
  counselName: ReactNode;
  counselAddress: ReactNode;
  counselContact: ReactNode;
  vendorName: ReactNode;
  vendorAddress: ReactNode;
  purchaserName: ReactNode;
  purchaserAddress: ReactNode;
  subjectMatter: ReactNode;
  purchaseValue: ReactNode;
  legalFee: ReactNode;
  branchCommission: ReactNode;
  executionDate: ReactNode;
  bainNumber: ReactNode;
  counselPhoto: any;
  id: string;
  title: string;
  type: 'survey' | 'deed' | 'receipt' | 'certificate' | 'other';
  uploadedBy: string;
  uploadedDate: Date;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationDate?: Date;
  notes?: string;
  reference?: string;
}

let documents: Document[] = [];

export function addDocument(doc: Omit<Document, 'id'>) {
  const newDoc: Document = {
    ...doc,
    id: Math.random().toString(36).substring(7),
  };
  documents.push(newDoc);
  return newDoc;
}

export function getDocuments() {
  return documents;
}

export function getDocumentById(id: string) {
  return documents.find(d => d.id === id);
}

export function updateDocument(id: string, updates: Partial<Document>) {
  const doc = documents.find(d => d.id === id);
  if (doc) {
    Object.assign(doc, updates);
  }
  return doc;
}

export function getPendingDocuments() {
  return documents.filter(d => d.status === 'pending');
}

export function getVerifiedDocuments() {
  return documents.filter(d => d.status === 'verified');
}
