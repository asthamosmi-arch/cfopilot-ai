'use client'
import { HealthScoreCard } from '@/components/dashboard/HealthScoreCard'
import { RunwayCard } from '@/components/dashboard/RunwayCard'
import { MonthlyBurnChart, CategoryPieChart } from '@/components/dashboard/ExpenseChart'
import { AlertsCard } from '@/components/dashboard/AlertsCard'
import { InsightsCard } from '@/components/dashboard/InsightsCard'
import { formatCurrency } from '@/lib/utils/format'
import { useFinancialStore } from '@/store/financialStore'
import { TrendingUp, TrendingDown, DollarSign, Activity, Upload, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string
  icon: React.ElementType; color: string
}) {
  return (
    <div className="glass p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs text-[#8892a4] uppercase tracking-wider">{label}</div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-[#8892a4] mt-0.5">{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const profile = useFinancialStore((s) => s.profile)
  const clearFinancialData = useFinancialStore((s) => s.clearFinancialData)

  const empty = !profile

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            {profile ? profile.companyName : 'Financial Dashboard'}
          </h1>
          <p className="text-sm text-[#8892a4] mt-0.5">
            {profile
              ? `${profile.reportingPeriod.start} → ${profile.reportingPeriod.end} · ${profile.totalTransactions} transactions`
              : 'Upload your financial data to get started'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {profile && (
            <button
              onClick={clearFinancialData}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#8892a4] hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
            >
              <RefreshCw size={13} />
              Clear
            </button>
          )}
          <Link
            href="/upload"
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#4f6ef7] hover:bg-[#3b55e6] text-white rounded-lg transition-colors"
          >
            <Upload size={14} />
            {empty ? 'Upload data' : 'Upload more'}
          </Link>
        </div>
      </div>

      {/* Empty CTA */}
      {empty && (
        <div className="glass border border-dashed border-[#4f6ef7]/30 p-8 text-center mb-6 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-[#4f6ef7]/10 flex items-center justify-center mx-auto mb-3">
            <Activity size={22} className="text-[#4f6ef7]" />
          </div>
          <h2 className="text-white font-medium mb-1">No financial data loaded</h2>
          <p className="text-sm text-[#8892a4] mb-4">Upload a CSV or PDF to see your financial analysis</p>
          <Link href="/upload" className="inline-flex items-center gap-1.5 text-sm text-[#4f6ef7] hover:underline">
            Go to upload <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Total expenses" icon={DollarSign} color="#4f6ef7"
          value={profile ? formatCurrency(profile.totalExpenses) : '—'}
          sub={profile ? `${profile.totalTransactions} transactions` : 'No data'}
        />
        <StatCard
          label="Monthly burn" icon={TrendingDown} color="#f97316"
          value={profile ? formatCurrency(profile.monthlyBurnRate) : '—'}
          sub={profile ? 'Average per month' : 'No data'}
        />
        <StatCard
          label="Runway" icon={Activity} color={
            profile?.runway
              ? (profile.runway.runwayMonths < 6 ? '#ef4444' : profile.runway.runwayMonths < 12 ? '#f97316' : '#22c55e')
              : '#545e72'
          }
          value={profile?.runway ? `${profile.runway.runwayMonths}mo` : '—'}
          sub={profile?.runway ? profile.runway.confidence + ' confidence' : 'Enter cash to calculate'}
        />
        <StatCard
          label="Health score" icon={TrendingUp} color={profile?.healthScore?.color ?? '#545e72'}
          value={profile?.healthScore ? `${profile.healthScore.overall}/100` : '—'}
          sub={profile?.healthScore?.label ?? 'No data'}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left col */}
        <div className="space-y-4">
          <HealthScoreCard score={profile?.healthScore} />
          <RunwayCard runway={profile?.runway} />
        </div>

        {/* Center col */}
        <div className="space-y-4">
          <div className="glass p-5">
            <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-4">Monthly burn rate</div>
            <MonthlyBurnChart data={profile?.monthlyBurns ?? []} />
          </div>
          <div className="glass p-5">
            <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-4">Spend by category</div>
            <CategoryPieChart data={profile?.topCategories ?? []} />
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          <AlertsCard alerts={profile?.alerts ?? []} />
          <InsightsCard insights={profile?.insights ?? []} savings={profile?.savingsOpportunities ?? []} />
        </div>
      </div>
    </div>
  )
}
