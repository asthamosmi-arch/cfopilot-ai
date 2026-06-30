'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CompanyFinancialProfile } from '@/types/financial'
import { saveProfile } from '@/lib/store/profileStore'

interface Props {
  onAnalysisComplete: (profile: CompanyFinancialProfile) => void
}

type Status = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'

export function FileUpload({ onAnalysisComplete }: Props) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [currentCash, setCurrentCash] = useState('')
  const [companyName, setCompanyName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith('.csv') && !f.name.endsWith('.pdf')) {
      setStatus('error')
      setMessage('Only CSV and PDF files are supported')
      return
    }
    setFile(f)
    setStatus('idle')
    setMessage('')
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setStatus('uploading')
    setMessage('Uploading file...')

    try {
      // Step 1: Upload and extract
      const formData = new FormData()
      formData.append('file', file)
      const upRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const upData = await upRes.json()

      if (!upData.success) throw new Error(upData.error ?? 'Upload failed')

      setStatus('analyzing')
      setMessage('Analyzing your financial data...')

      // Step 2: Run analysis pipeline
      const anaRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: upData.transactions,
          rawContent: upData.rawContent,
          fileName: file.name,
          currentCash: currentCash ? parseFloat(currentCash) : undefined,
          companyName: companyName || 'My Company',
        }),
      })
      const anaData = await anaRes.json()
      if (!anaData.success) throw new Error(anaData.error ?? 'Analysis failed')

      setStatus('done')
      setMessage(`Analyzed ${anaData.profile.totalTransactions} transactions successfully`)
      saveProfile(anaData.profile)
      onAnalysisComplete(anaData.profile)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      {/* Optional context fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8892a4] mb-1.5">Company name</label>
          <input
            type="text"
            placeholder="Acme Inc."
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            className="w-full bg-[#1e2537] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#545e72] focus:outline-none focus:border-[#4f6ef7]/50"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8892a4] mb-1.5">Current cash (for runway)</label>
          <input
            type="number"
            placeholder="e.g. 1500000"
            value={currentCash}
            onChange={e => setCurrentCash(e.target.value)}
            className="w-full bg-[#1e2537] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#545e72] focus:outline-none focus:border-[#4f6ef7]/50"
          />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          dragging ? 'border-[#4f6ef7] bg-[#4f6ef7]/10' : 'border-white/10 hover:border-white/20',
          file ? 'cursor-default' : 'cursor-pointer'
        )}
      >
        <input
          ref={inputRef} type="file" accept=".csv,.pdf" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={24} className="text-[#4f6ef7]" />
            <div className="text-left">
              <div className="text-sm font-medium text-white">{file.name}</div>
              <div className="text-xs text-[#8892a4]">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setFile(null); setStatus('idle') }}
              className="ml-auto text-[#545e72] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <Upload size={28} className="mx-auto text-[#545e72] mb-3" />
            <p className="text-sm text-white font-medium">Drop your financial file here</p>
            <p className="text-xs text-[#545e72] mt-1">CSV expense sheets or PDF invoices</p>
          </div>
        )}
      </div>

      {/* Status message */}
      {message && (
        <div className={cn(
          'flex items-center gap-2 text-xs p-3 rounded-lg',
          status === 'error' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#4f6ef7]/10 text-[#7b90f9]'
        )}>
          {status === 'error' && <AlertCircle size={14} />}
          {status === 'done' && <CheckCircle2 size={14} className="text-[#22c55e]" />}
          {(status === 'uploading' || status === 'analyzing') && <Loader2 size={14} className="animate-spin" />}
          {message}
        </div>
      )}

      {/* Analyze button */}
      {file && status !== 'done' && (
        <button
          onClick={handleAnalyze}
          disabled={status === 'uploading' || status === 'analyzing'}
          className="w-full py-2.5 rounded-lg bg-[#4f6ef7] hover:bg-[#3b55e6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {(status === 'uploading' || status === 'analyzing') && <Loader2 size={14} className="animate-spin" />}
          {status === 'uploading' ? 'Uploading...' : status === 'analyzing' ? 'Analyzing...' : 'Analyze Financial Data'}
        </button>
      )}
    </div>
  )
}
