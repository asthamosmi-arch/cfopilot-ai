'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import type { MonthlyBurn, CategoryBreakdown } from '@/types/financial'
import { formatCurrency, formatMonthYear } from '@/lib/utils/format'

const CATEGORY_COLORS = [
  '#4f6ef7', '#7b90f9', '#a5b4fc',
  '#06b6d4', '#22d3ee', '#67e8f9',
  '#f97316', '#fb923c', '#fdba74',
  '#8b5cf6',
]

interface BurnChartProps {
  data: MonthlyBurn[]
}

export function MonthlyBurnChart({ data }: BurnChartProps) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-sm text-[#545e72]">
      No monthly data available
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis
          dataKey="month"
          tickFormatter={formatMonthYear}
          tick={{ fill: '#8892a4', fontSize: 11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
          tick={{ fill: '#8892a4', fontSize: 11 }}
          axisLine={false} tickLine={false} width={48}
        />
        <Tooltip
          formatter={(val: number) => [formatCurrency(val), 'Total spend']}
          labelFormatter={formatMonthYear}
          contentStyle={{ background: '#1e2537', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }}
          itemStyle={{ color: '#e8eaf0' }}
          labelStyle={{ color: '#8892a4' }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 1 ? '#4f6ef7' : '#2d3a5e'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface CategoryChartProps {
  data: CategoryBreakdown[]
}

export function CategoryPieChart({ data }: CategoryChartProps) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-sm text-[#545e72]">No data</div>
  )

  const top = data.slice(0, 6)
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={top} dataKey="total" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
            {top.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {top.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
            <span className="text-xs text-[#8892a4] flex-1 truncate">{item.category}</span>
            <span className="text-xs font-medium text-white">{item.percentOfTotal.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
