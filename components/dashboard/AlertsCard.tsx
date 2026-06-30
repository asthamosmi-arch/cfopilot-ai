'use client'
import type { Alert } from '@/types/financial'
import { AlertTriangle, Info, XCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/format'

interface Props {
  alerts: Alert[]
}

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Critical' },
  warning: { icon: AlertTriangle, color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: 'Warning' },
  info: { icon: Info, color: '#4f6ef7', bg: 'rgba(79,110,247,0.1)', label: 'Info' },
}

export function AlertsCard({ alerts }: Props) {
  if (!alerts.length) {
    return (
      <div className="glass p-5">
        <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-3">Smart Alerts</div>
        <div className="flex items-center gap-2.5 py-4 text-sm text-[#545e72]">
          <CheckCircle2 size={16} className="text-[#22c55e]" />
          No alerts detected — looking clean
        </div>
      </div>
    )
  }

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider">Smart Alerts</div>
        <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded-full">
          {alerts.length} active
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity]
          const Icon = cfg.icon
          return (
            <div
              key={alert.id}
              className="flex gap-3 p-3 rounded-lg"
              style={{ background: cfg.bg }}
            >
              <Icon size={15} style={{ color: cfg.color }} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium" style={{ color: cfg.color }}>{alert.title}</div>
                <div className="text-xs text-[#8892a4] mt-0.5">{alert.description}</div>
                {alert.amount && (
                  <div className="text-xs font-mono mt-1" style={{ color: cfg.color }}>
                    {formatCurrency(alert.amount)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
