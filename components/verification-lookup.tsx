'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDocuments, saveDocument, type Document } from '@/lib/storage'

export default function VerificationLookup() {
  const [form, setForm] = useState({
    counselName: '',
    counselAddress: '',
    counselContact: '',
    documentType: '',
    vendorName: '',
    vendorAddress: '',
    purchaserName: '',
    purchaserAddress: '',
    subjectMatter: '',
    purchaseValue: '',
    legalFee: '',
    branchCommission: '',
    executionDate: '',
    bainNumber: '',
    counselPhoto: '',
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [documentId, setDocumentId] = useState<string>('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const certRef = useRef<HTMLDivElement | null>(null)
  const [qrData, setQrData] = useState<string>('')

  const generateDocumentId = () => {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setPhotoFile(file)
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, counselPhoto: String(reader.result) }))
    }
    reader.readAsDataURL(file)
  }

  // Generate QR code with document URL
  const generateQr = async (docId: string) => {
    if (!docId) {
      setQrData('')
      return
    }
    
    // Create a URL that will display the document
    const documentUrl = `${window.location.origin}/documents/${docId}`
    
    try {
      const qrcodeModule = await import('qrcode')
      const dataUrl = await qrcodeModule.toDataURL(documentUrl, { margin: 1, width: 200 })
      setQrData(dataUrl)
    } catch (err) {
      console.error('QR generation error:', err)
      // Fallback to Google Charts QR
      const fallback = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(documentUrl)}`
      setQrData(fallback)
    }
  }

  const handleSubmit = async () => {
    // Generate unique document ID
    const docId = generateDocumentId()
    setDocumentId(docId)
    
    // Save document data to storage
    const documentData: Document = {
      id: docId,
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    await saveDocument(documentData)
    
    // Generate QR code with document URL
    await generateQr(docId)
    setSubmitted(true)
  }

  const downloadPDF = async () => {
    if (!certRef.current) {
      console.error('Certificate ref not found')
      return
    }
    
    try {
      setIsGeneratingPDF(true)
      
      // Create a simplified clone of the certificate for PDF generation
      const certificateClone = certRef.current.cloneNode(true) as HTMLElement;
      
      // Remove problematic elements
      const svgBackgrounds = certificateClone.querySelectorAll('[style*="backgroundImage"]');
      svgBackgrounds.forEach(el => {
        el.removeAttribute('style');
        (el as HTMLElement).style.backgroundColor = '#ffffff';
        (el as HTMLElement).style.border = '2px solid #000000';
      });

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.appendChild(certificateClone);
      document.body.appendChild(tempContainer);

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      console.log('Starting PDF generation...')
      
      // Use simpler html2canvas configuration
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false, // Disable logging to avoid extra errors
        removeContainer: true // Clean up temporary container
      })

      // Remove temporary container
      document.body.removeChild(tempContainer);

      console.log('Canvas created, converting to PDF...')
      
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Calculate dimensions to fit the page
      const imgWidth = pageWidth - 40
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Center on page
      const x = (pageWidth - imgWidth) / 2
      const y = (pageHeight - imgHeight) / 2
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)

      const fileName = `${form.vendorName || 'certificate'}_${documentId}.pdf`.replace(/[^a-zA-Z0-9-_]/g, '_')
      pdf.save(fileName)
      
      console.log('PDF downloaded successfully')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to simple PDF generation without styling
      await downloadSimplePDF();
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Simple PDF fallback without complex styling
  const downloadSimplePDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font and basic styling
      pdf.setFont('helvetica');
      pdf.setFontSize(20);
      pdf.text('DEED OF CONVEYANCE', 105, 30, { align: 'center' });

      pdf.setFontSize(12);
      pdf.text('BETWEEN', 105, 50, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(form.vendorName || '—', 105, 60, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('(VENDORS)', 105, 67, { align: 'center' });

      pdf.setFontSize(12);
      pdf.text('AND', 105, 80, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(form.purchaserName || '—', 105, 90, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('(PURCHASER)', 105, 97, { align: 'center' });

      pdf.setFontSize(10);
      pdf.text(`IN RESPECT OF A PARCEL OF LAND MEASURING ${form.subjectMatter || '—'}`, 105, 110, { align: 'center' });

      pdf.setFontSize(12);
      pdf.text('Prepared by:', 105, 130, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(form.counselName || '—', 105, 140, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(form.counselAddress || '', 105, 147, { align: 'center' });
      pdf.text(form.counselContact || '', 105, 154, { align: 'center' });

      // Add document ID
      pdf.setFontSize(8);
      pdf.text(`Document ID: ${documentId}`, 20, 280);

      const fileName = `${form.vendorName || 'certificate'}_${documentId}.pdf`.replace(/[^a-zA-Z0-9-_]/g, '_');
      pdf.save(fileName);

    } catch (error) {
      console.error('Simple PDF generation failed:', error);
      alert('PDF generation failed. Please use the Print function instead.');
    }
  }

  const resetForm = () => {
    setForm({
      counselName: '',
      counselAddress: '',
      counselContact: '',
      documentType: '',
      vendorName: '',
      vendorAddress: '',
      purchaserName: '',
      purchaserAddress: '',
      subjectMatter: '',
      purchaseValue: '',
      legalFee: '',
      branchCommission: '',
      executionDate: '',
      bainNumber: '',
      counselPhoto: '',
    })
    setPhotoFile(null)
    setSubmitted(false)
    setDocumentId('')
    setQrData('')
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border-border/50 p-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-lg font-bold mb-2">Document Information Form</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input name="counselName" value={form.counselName} onChange={handleChange} placeholder="Name of Counsel" />
            <Input name="counselContact" value={form.counselContact} onChange={handleChange} placeholder="Contact Number" />
            <Input name="counselAddress" value={form.counselAddress} onChange={handleChange} placeholder="Address of Counsel" />
            <Input name="documentType" value={form.documentType} onChange={handleChange} placeholder="Document Type" />
            <Input name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="Vendor Name" />
            <Input name="vendorAddress" value={form.vendorAddress} onChange={handleChange} placeholder="Vendor Address" />
            <Input name="purchaserName" value={form.purchaserName} onChange={handleChange} placeholder="Purchaser Name" />
            <Input name="purchaserAddress" value={form.purchaserAddress} onChange={handleChange} placeholder="Purchaser Address" />
            <Input name="subjectMatter" value={form.subjectMatter} onChange={handleChange} placeholder="Details of Subject Matter" />
            <Input name="purchaseValue" value={form.purchaseValue} onChange={handleChange} placeholder="Purchase Value" />
            <Input name="legalFee" value={form.legalFee} onChange={handleChange} placeholder="Legal Fee" />
            <Input name="branchCommission" value={form.branchCommission} onChange={handleChange} placeholder="Branch Commission" />
            <Input name="executionDate" type="date" value={form.executionDate} onChange={handleChange} />
            <Input name="bainNumber" value={form.bainNumber} onChange={handleChange} placeholder="BAIN Number" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Counsel Photograph</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="w-full border border-border/50 rounded-lg p-2 bg-background text-foreground" />
            {form.counselPhoto && (
              <img src={form.counselPhoto} alt="preview" className="w-28 h-28 object-cover rounded-lg mt-3" />
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground">
              Preview Certificate
            </Button>
            <Button type="button" onClick={resetForm} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {submitted && (
        <div className="flex flex-col items-center">
          {/* Certificate Preview - Simplified for PDF generation */}
          <div 
            ref={certRef} 
            className="relative bg-white p-6 certificate-container pdf-optimized"
            style={{ 
              width: '794px',
              minHeight: '1123px',
              border: '6px solid #000000',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff'
            }}
          >
            {/* Simple border instead of SVG pattern */}
            <div style={{ 
              padding: 18, 
              border: '12px double #000000',
              height: '100%',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff'
            }}>

              <div className="bg-white p-6 border border-black relative h-full" style={{ backgroundColor: '#ffffff' }}>
                <h1 className="text-center font-bold text-2xl" style={{ color: '#000000' }}>DEED OF CONVEYANCE</h1>

                <p className="text-center mt-4 font-semibold" style={{ color: '#000000' }}>BETWEEN</p>
                <p className="text-center mt-2 text-lg uppercase font-bold" style={{ color: '#000000' }}>{form.vendorName || '—'}</p>
                <p className="text-center font-semibold" style={{ color: '#000000' }}>(VENDORS)</p>

                <p className="text-center font-semibold mt-6" style={{ color: '#000000' }}>AND</p>
                <p className="text-center mt-2 text-lg uppercase font-bold" style={{ color: '#000000' }}>{form.purchaserName || '—'}</p>
                <p className="text-center font-semibold" style={{ color: '#000000' }}>(PURCHASER)</p>

                <div className="mt-6 text-center text-sm" style={{ color: '#000000' }}>
                  IN RESPECT OF A PARCEL OF LAND MEASURING {form.subjectMatter || '—'}
                </div>

                <div className="mt-6 flex flex-col items-center">
                  {form.counselPhoto && (
                    <img 
                      src={form.counselPhoto} 
                      alt="Counsel" 
                      className="w-28 h-28 object-cover rounded-full border mb-3"
                      style={{ borderColor: '#000000' }}
                    />
                  )}

                  <p className="font-bold mt-2" style={{ color: '#000000' }}>Prepared by:</p>
                  <p className="mt-2 font-semibold uppercase" style={{ color: '#000000' }}>{form.counselName || '—'}</p>
                  <p className="text-sm" style={{ color: '#000000' }}>{form.counselAddress}</p>
                  <p className="text-sm" style={{ color: '#000000' }}>{form.counselContact}</p>
                </div>

                <div className="mt-6 text-center font-bold" style={{ color: '#000000' }}>DEED OF CONVEYANCE</div>

                {/* QR code bottom-left */}
                <div className="absolute left-6 bottom-6">
                  {qrData ? (
                    <img 
                      src={qrData} 
                      alt="QR code" 
                      className="w-24 h-24 border"
                      style={{ borderColor: '#000000' }}
                    />
                  ) : (
                    <div className="w-24 h-24 border flex items-center justify-center text-xs" style={{ borderColor: '#000000', color: '#000000' }}>QR</div>
                  )}
                </div>

                {/* Document ID for reference */}
                <div className="absolute left-6 top-6 text-xs" style={{ color: '#666666' }}>
                  ID: {documentId}
                </div>

                {/* Simple seal instead of SVG */}
                <div className="absolute right-6 bottom-6 flex items-center">
                  <div style={{
                    width: '120px',
                    height: '120px',
                    border: '2px solid #000000',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f8f8',
                    textAlign: 'center',
                    padding: '10px',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>SAGBAMA</div>
                    <div style={{ fontSize: '8px', marginBottom: '2px' }}>LOCAL GOVERNMENT</div>
                    <div style={{ fontSize: '8px', marginBottom: '2px' }}>LAND AUTH</div>
                    <div style={{ fontSize: '7px' }}>CERTIFIED TRUE COPY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              onClick={downloadPDF} 
              disabled={isGeneratingPDF}
              className="bg-primary text-primary-foreground"
            >
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
            <Button onClick={() => window.print()} variant="outline">Print</Button>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>If PDF download fails, use the Print button and select "Save as PDF"</p>
          </div>
        </div>
      )}
    </div>
  )
}