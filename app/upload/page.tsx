'use client'
import { useState } from 'react'
import { FileUpload } from '@/components/upload/FileUpload'
import type { CompanyFinancialProfile } from '@/types/financial'
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format'
import { useFinancialStore } from '@/store/financialStore'

export default function UploadPage() {
  const [profile, setProfile] = useState<CompanyFinancialProfile | null>(null)
  const setFinancialData = useFinancialStore((s) => s.setFinancialData)

  const handleAnalysisComplete = (data: CompanyFinancialProfile) => {
    setFinancialData(data)   // → Zustand (persisted to localStorage)
    setProfile(data)         // → local state for the success card below
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Upload financial data</h1>
        <p className="text-sm text-[#8892a4] mt-1">
          Upload CSV expense sheets or PDF invoices. CFOPilot will extract and analyze your transactions.
        </p>
      </div>

      <FileUpload onAnalysisComplete={handleAnalysisComplete} />

      {/* Supported formats */}
      <div className="mt-6">
        <div className="text-xs text-[#545e72] uppercase tracking-wider mb-3">Supported formats</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'CSV Expense sheets', desc: 'Date, Vendor, Category, Amount columns', ext: '.csv' },
            { name: 'PDF Invoices', desc: 'Scanned or digital invoices (Phase 2)', ext: '.pdf' },
          ].map(f => (
            <div key={f.ext} className="glass p-3 flex items-start gap-3">
              <FileText size={16} className="text-[#4f6ef7] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-white">{f.name}</div>
                <div className="text-xs text-[#545e72]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample data hint */}
      <div className="mt-4 p-3 rounded-lg bg-[#4f6ef7]/10 border border-[#4f6ef7]/20">
        <p className="text-xs text-[#7b90f9]">
          💡 Try the sample file at <code className="font-mono bg-[#4f6ef7]/20 px-1 rounded">data/sample-finance.csv</code> to demo the full pipeline
        </p>
      </div>

      {/* Success result */}
      {profile && (
        <div className="mt-6 glass p-5 border border-[#22c55e]/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-[#22c55e]" />
            <span className="text-sm font-medium text-[#22c55e]">Analysis complete</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Transactions', value: profile.totalTransactions.toString() },
              { label: 'Total expenses', value: formatCurrency(profile.totalExpenses) },
              { label: 'Monthly burn', value: formatCurrency(profile.monthlyBurnRate) },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-xs text-[#8892a4]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="flex-1 py-2 text-center text-sm bg-[#4f6ef7] hover:bg-[#3b55e6] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              View dashboard <ArrowRight size={13} />
            </Link>
            <Link
              href="/chat"
              className="flex-1 py-2 text-center text-sm bg-white/[0.05] hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Ask CFO assistant
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
