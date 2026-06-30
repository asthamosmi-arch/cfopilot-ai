'use client'
import type { HealthScoreBreakdown } from '@/types/financial'

interface Props {
  score?: HealthScoreBreakdown
  loading?: boolean
}

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width="110" height="110" className="rotate-[-90deg]">
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

function SubScore({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#8892a4]">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function HealthScoreCard({ score, loading }: Props) {
  if (loading) {
    return (
      <div className="glass p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-24 bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  const placeholder = !score

  const display = score ?? {
    overall: 0, label: 'No Data' as const, color: '#545e72',
    spendingEfficiency: 0, budgetControl: 0, cashFlowHealth: 0, expenseDiversity: 0,
  }

  return (
    <div className="glass p-5">
      <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-4">
        Financial Health Score
      </div>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <ScoreRing value={display.overall} color={display.color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white" style={{ color: display.color }}>
              {placeholder ? '—' : display.overall}
            </span>
            <span className="text-[10px]" style={{ color: display.color }}>{display.label}</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <SubScore label="Spending efficiency" value={display.spendingEfficiency} color={display.color} />
          <SubScore label="Budget control" value={display.budgetControl} color={display.color} />
          <SubScore label="Cash flow health" value={display.cashFlowHealth} color={display.color} />
          <SubScore label="Expense diversity" value={display.expenseDiversity} color={display.color} />
        </div>
      </div>
      {placeholder && (
        <p className="text-xs text-[#545e72] mt-3">Upload financial data to calculate your score</p>
      )}
    </div>
  )
}
