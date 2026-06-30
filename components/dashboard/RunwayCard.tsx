'use client'
import type { RunwayProjection } from '@/types/financial'
import { formatCurrency } from '@/lib/utils/format'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'

interface Props {
  runway?: RunwayProjection
  loading?: boolean
}

export function RunwayCard({ runway, loading }: Props) {
  if (loading) {
    return <div className="glass p-5 animate-pulse"><div className="h-32 bg-white/10 rounded" /></div>
  }

  if (!runway) {
    return (
      <div className="glass p-5">
        <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-3">Runway Prediction</div>
        <div className="flex items-center gap-3 py-4">
          <Clock size={20} className="text-[#545e72]" />
          <p className="text-sm text-[#545e72]">Enter your current cash to calculate runway</p>
        </div>
      </div>
    )
  }

  const isCritical = runway.runwayMonths < 6
  const isWarning = runway.runwayMonths < 12
  const Icon = isCritical ? AlertTriangle : isWarning ? Clock : CheckCircle
  const iconColor = isCritical ? '#ef4444' : isWarning ? '#f97316' : '#22c55e'

  return (
    <div className="glass p-5">
      <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-4">Runway Prediction</div>
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}20` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-white">{runway.runwayMonths}</span>
            <span className="text-sm text-[#8892a4]">months</span>
          </div>
          <div className="text-xs text-[#545e72] mt-0.5">
            Until {new Date(runway.runwayDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-[#545e72] uppercase tracking-wider">Monthly burn</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            {formatCurrency(runway.monthlyBurnRate)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#545e72] uppercase tracking-wider">Current cash</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            {formatCurrency(runway.currentCash)}
          </div>
        </div>
      </div>

      <div
        className="mt-3 text-xs p-3 rounded-lg"
        style={{ background: `${iconColor}12`, color: iconColor }}
      >
        {runway.suggestion}
      </div>
    </div>
  )
}
