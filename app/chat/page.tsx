'use client'
import { CFOChat } from '@/components/chat/CFOChat'
import { useFinancialStore } from '@/store/financialStore'
import { Info } from 'lucide-react'

export default function ChatPage() {
  const profile = useFinancialStore((s) => s.profile)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-5 py-3 flex items-center gap-3 shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-white">AI CFO Assistant</h1>
          <p className="text-xs text-[#8892a4]">
            {profile
              ? `Loaded: ${profile.companyName} · ${profile.totalTransactions} transactions`
              : 'No data loaded — answers will be general'}
          </p>
        </div>
        {!profile && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-[#f97316] bg-[#f97316]/10 px-2.5 py-1 rounded-full">
            <Info size={11} />
            Upload data for personalized analysis
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <CFOChat profile={profile} />
      </div>
    </div>
  )
}
