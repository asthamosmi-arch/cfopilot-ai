'use client'
import type { FinancialInsight, CostSavingOpportunity } from '@/types/financial'
import { Sparkles, DollarSign, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

interface Props {
  insights: FinancialInsight[]
  savings: CostSavingOpportunity[]
  loading?: boolean
}

const EFFORT_COLOR = { low: '#22c55e', medium: '#f97316', high: '#ef4444' }

export function InsightsCard({ insights, savings, loading }: Props) {
  const latest = insights[0]

  return (
    <div className="glass p-5 space-y-5">
      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#4f6ef7]" />
          <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider">AI Insights</div>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-4/5" />
          </div>
        ) : latest ? (
          <div className="space-y-2">
            <p className="text-sm text-[#c4cad6]">{latest.summary}</p>
            {latest.keyFindings.map((f, i) => (
              <div key={i} className="flex gap-2 text-xs text-[#8892a4]">
                <span className="text-[#4f6ef7] shrink-0">→</span>
                {f}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#545e72]">
            Upload financial data to generate AI-powered insights from your CFO assistant.
          </p>
        )}
      </div>

      {/* Savings opportunities */}
      {savings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={14} className="text-[#22c55e]" />
            <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider">Savings opportunities</div>
          </div>
          <div className="space-y-2">
            {savings.slice(0, 3).map(opp => (
              <div key={opp.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03]">
                <div>
                  <div className="text-sm font-medium text-white">{opp.title}</div>
                  <div className="text-xs text-[#8892a4] mt-0.5">{opp.description}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-semibold text-[#22c55e]">
                      Save {formatCurrency(opp.estimatedSaving)}/mo
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: `${EFFORT_COLOR[opp.effort]}20`, color: EFFORT_COLOR[opp.effort] }}
                    >
                      {opp.effort} effort
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
