'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDocuments } from '@/lib/storage'
import type { Document } from '@/lib/storage'

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
  const certRef = useRef<HTMLDivElement | null>(null)
  const [qrData, setQrData] = useState<string>('')

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

  // generate QR code with dynamic import of 'qrcode' if available, else fall back to Google Chart API URL
  const generateQr = async (text: string) => {
    if (!text) {
      setQrData('')
      return
    }
    try {
      const qrcodeModule = await import('qrcode')
      const dataUrl = await qrcodeModule.toDataURL(text, { margin: 1, width: 200 })
      setQrData(dataUrl)
    } catch (err) {
      // fallback to Google Charts QR (no install required) — note: depends on external service
      const fallback = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(text)}`
      setQrData(fallback)
    }
  }

  useEffect(() => {
    // whenever form values that we want encoded change, regenerate QR
    if (submitted) {
      const payload = JSON.stringify({ vendor: form.vendorName, purchaser: form.purchaserName, ref: form.bainNumber || form.executionDate })
      generateQr(payload)
    }
  }, [submitted, form.vendorName, form.purchaserName, form.bainNumber, form.executionDate])

  const downloadPDF = async () => {
    if (!certRef.current) return
    // dynamic import to keep bundle small; assumes html2canvas and jspdf are installed
    if (typeof window === 'undefined') return
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])

    const canvas = await html2canvas(certRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgProps = (pdf as any).getImageProperties(imgData)
    const imgRatio = imgProps.width / imgProps.height
    const imgWidth = pageWidth - 40
    const imgHeight = imgWidth / imgRatio
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight)
    pdf.save(`${form.vendorName || 'certificate'}.pdf`)
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
            <Button type="button" onClick={() => setSubmitted(true)} className="flex-1 bg-primary text-primary-foreground">Preview Certificate</Button>
            <Button type="button" onClick={() => { setForm({
              counselName: '', counselAddress: '', counselContact: '', documentType: '', vendorName: '', vendorAddress: '', purchaserName: '', purchaserAddress: '', subjectMatter: '', purchaseValue: '', legalFee: '', branchCommission: '', executionDate: '', bainNumber: '', counselPhoto: '' })
              setPhotoFile(null)
              setSubmitted(false)
            }} variant="outline" className="flex-1">Reset</Button>
          </div>
        </form>
      </Card>

      {submitted && (
        <div className="flex flex-col items-center">
          <div ref={certRef} className="relative bg-white w-[794px] p-6" style={{ boxShadow: '0 0 0 6px rgba(0,0,0,0.85), inset 0 0 0 6px rgba(0,0,0,0.85)' }}>
            {/* SVG patterned inner border */}
            <div style={{ padding: 18, border: '12px solid transparent', backgroundImage: 'url("data:image/svg+xml;utf8,' + encodeURIComponent(`
              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"> 
                <defs>
                  <pattern id=\"p\" width=\"24\" height=\"24\" patternUnits=\"userSpaceOnUse\"> 
                    <rect width=\"24\" height=\"24\" fill=\"white\"/> 
                    <path d=\"M0 12 L24 12 M12 0 L12 24\" stroke=\"black\" stroke-width=\"1\"/> 
                  </pattern>
                </defs>
                <rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" fill=\"url(#p)\"/> 
              </svg>` ) + '")' }}>

              <div className="bg-white p-6 border border-black relative">
                <h1 className="text-center font-bold text-2xl">DEED OF CONVEYANCE</h1>

                <p className="text-center mt-4 font-semibold">BETWEEN</p>
                <p className="text-center mt-2 text-lg uppercase font-bold">{form.vendorName || '—'}</p>
                <p className="text-center font-semibold">(VENDORS)</p>

                <p className="text-center font-semibold mt-6">AND</p>
                <p className="text-center mt-2 text-lg uppercase font-bold">{form.purchaserName || '—'}</p>
                <p className="text-center font-semibold">(PURCHASER)</p>

                <div className="mt-6 text-center text-sm">IN RESPECT OF A PARCEL OF LAND MEASURING {form.subjectMatter || '—'}</div>

                <div className="mt-6 flex flex-col items-center">
                  {form.counselPhoto && (
                    <img src={form.counselPhoto} alt="Counsel" className="w-28 h-28 object-cover rounded-full border mb-3" />
                  )}

                  <p className="font-bold mt-2">Prepared by:</p>
                  <p className="mt-2 font-semibold uppercase">{form.counselName || '—'}</p>
                  <p className="text-sm">{form.counselAddress}</p>
                  <p className="text-sm">{form.counselContact}</p>
                </div>

                <div className="mt-6 text-center font-bold">DEED OF CONVEYANCE</div>

                {/* QR code bottom-left */}
                <div className="absolute left-6 bottom-6">
                  {qrData ? (
                    // either data URL from qrcode lib or fallback google chart URL
                    <img src={qrData} alt="QR code" className="w-24 h-24 border" />
                  ) : (
                    <div className="w-24 h-24 border flex items-center justify-center text-xs">QR</div>
                  )}
                </div>

                {/* Round seal / stamp bottom-right */}
                <div className="absolute right-6 bottom-6 flex items-center">
                  <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="drop-shadow">
                    <defs>
                      <radialGradient id="g" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#eee" />
                      </radialGradient>
                    </defs>
                    <circle cx="60" cy="60" r="56" fill="url(#g)" stroke="black" strokeWidth="2" />
                    <circle cx="60" cy="60" r="42" fill="none" stroke="black" strokeWidth="2" />
                    <text x="60" y="34" fontSize="10" textAnchor="middle" fontWeight="bold">SAGBAMA</text>
                    <text x="60" y="50" fontSize="8" textAnchor="middle">LOCAL GOVERNMENT</text>
                    <text x="60" y="70" fontSize="8" textAnchor="middle">LAND AUTH</text>
                    <text x="60" y="88" fontSize="7" textAnchor="middle">CERTIFIED TRUE COPY</text>
                  </svg>
                </div>

              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={downloadPDF} className="bg-primary text-primary-foreground">Download PDF</Button>
            <Button onClick={() => window.print()} variant="outline">Print</Button>
          </div>
        </div>
      )}
    </div>
  )
}
