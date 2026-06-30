import type { HealthScoreBreakdown, Transaction, CategoryBreakdown } from '@/types/financial'

export function calculateHealthScore(
  transactions: Transaction[],
  monthlyBurnRate: number,
  topCategories: CategoryBreakdown[],
  currentCash?: number
): HealthScoreBreakdown {
  // Spending efficiency: reward diverse, controlled spend (not dominated by one category)
  const topCategoryPercent = topCategories[0]?.percentOfTotal ?? 100
  const spendingEfficiency = Math.max(0, Math.min(100, 100 - (topCategoryPercent - 30)))

  // Duplicate/anomaly ratio
  const anomalyCount = transactions.filter(t => t.isAnomaly).length
  const anomalyRatio = anomalyCount / Math.max(transactions.length, 1)
  const budgetControl = Math.max(0, Math.min(100, 100 - anomalyRatio * 200))

  // Cash flow health (needs currentCash)
  const runwayMonths = currentCash ? currentCash / monthlyBurnRate : 6
  const cashFlowHealth = Math.min(100, (runwayMonths / 18) * 100)

  // Expense diversity: penalize if 1-2 categories dominate
  const categoryCount = topCategories.length
  const expenseDiversity = Math.min(100, categoryCount * 14)

  const overall = Math.round(
    spendingEfficiency * 0.25 +
    budgetControl * 0.30 +
    cashFlowHealth * 0.30 +
    expenseDiversity * 0.15
  )

  let label: HealthScoreBreakdown['label']
  let color: string
  if (overall >= 80) { label = 'Excellent'; color = '#22c55e' }
  else if (overall >= 65) { label = 'Good'; color = '#84cc16' }
  else if (overall >= 50) { label = 'Fair'; color = '#eab308' }
  else if (overall >= 35) { label = 'At Risk'; color = '#f97316' }
  else { label = 'Critical'; color = '#ef4444' }

  return {
    overall,
    spendingEfficiency: Math.round(spendingEfficiency),
    budgetControl: Math.round(budgetControl),
    cashFlowHealth: Math.round(cashFlowHealth),
    expenseDiversity: Math.round(expenseDiversity),
    label,
    color,
  }
}

export function calculateRunway(currentCash: number, monthlyBurnRate: number) {
  const runwayMonths = currentCash / monthlyBurnRate
  const runwayDate = new Date()
  runwayDate.setMonth(runwayDate.getMonth() + Math.floor(runwayMonths))

  return {
    currentCash,
    monthlyBurnRate,
    runwayMonths: Math.round(runwayMonths * 10) / 10,
    runwayDate: runwayDate.toISOString().split('T')[0],
    confidence: runwayMonths > 12 ? 'high' as const : runwayMonths > 6 ? 'medium' as const : 'low' as const,
    suggestion: runwayMonths < 6
      ? 'Critical: Raise funding or cut burn rate immediately.'
      : runwayMonths < 12
      ? 'Start fundraising conversations within 3 months.'
      : 'Healthy runway. Consider strategic growth investments.',
  }
}
