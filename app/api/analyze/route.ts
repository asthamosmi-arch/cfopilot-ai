import { NextRequest, NextResponse } from 'next/server'
import { parseFinancialCSV } from '@/lib/parsers/csv-parser'
import { calculateHealthScore, calculateRunway } from '@/lib/utils/financial-score'
import type { CompanyFinancialProfile, CategoryBreakdown, MonthlyBurn, Alert, ExpenseCategory } from '@/types/financial'

// This route runs the local analysis pipeline (no Claude yet).
// Phase 2 will swap in the full agent orchestrator.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { transactions: inputTransactions, fileName, rawContent, currentCash, companyName } = body

    let transactions = inputTransactions
    if (!transactions && rawContent) {
      const parsed = parseFinancialCSV(rawContent, fileName ?? 'upload.csv')
      transactions = parsed.transactions
    }

    if (!transactions?.length) {
      return NextResponse.json({ error: 'No transactions to analyze' }, { status: 400 })
    }

    // ── Aggregate by category ─────────────────────────────────────────────────
    const totalExpenses = transactions.reduce((s: number, t: any) => s + t.amount, 0)
    const categoryMap: Record<string, { total: number; count: number }> = {}
    transactions.forEach((t: any) => {
      if (!categoryMap[t.category]) categoryMap[t.category] = { total: 0, count: 0 }
      categoryMap[t.category].total += t.amount
      categoryMap[t.category].count++
    })

    const topCategories: CategoryBreakdown[] = Object.entries(categoryMap)
      .map(([category, { total, count }]) => ({
        category: category as ExpenseCategory,
        total,
        count,
        percentOfTotal: (total / totalExpenses) * 100,
        trend: 'stable' as const,
      }))
      .sort((a, b) => b.total - a.total)

    // ── Monthly burn ──────────────────────────────────────────────────────────
    const monthlyMap: Record<string, number> = {}
    transactions.forEach((t: any) => {
      const month = t.date.substring(0, 7) // YYYY-MM
      monthlyMap[month] = (monthlyMap[month] ?? 0) + t.amount
    })

    const monthlyBurns: MonthlyBurn[] = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total, byCategory: {} }))

    const monthlyBurnRate = monthlyBurns.length
      ? monthlyBurns.reduce((s, m) => s + m.total, 0) / monthlyBurns.length
      : totalExpenses

    // ── Duplicate detection (basic heuristic) ────────────────────────────────
    const seen = new Map<string, boolean>()
    const alerts: Alert[] = []
    transactions.forEach((t: any) => {
      const key = `${t.vendor}-${t.amount}-${t.date.substring(0, 7)}`
      if (seen.has(key)) {
        // Check if we already added this alert
        const exists = alerts.some(a => a.title.includes(t.vendor) && a.type === 'duplicate')
        if (!exists) {
          alerts.push({
            id: `alert-dup-${t.id}`,
            type: 'duplicate',
            severity: 'warning',
            title: `Possible duplicate: ${t.vendor}`,
            description: `Found multiple charges from ${t.vendor} for $${t.amount.toLocaleString()} in the same month. Review for duplicates.`,
            amount: t.amount,
            category: t.category,
            detectedAt: new Date().toISOString(),
          })
        }
      }
      seen.set(key, true)
    })

    // ── Health score ──────────────────────────────────────────────────────────
    const markedTransactions = transactions.map((t: any) => ({
      ...t,
      isAnomaly: alerts.some(a => a.title.includes(t.vendor) && a.type === 'duplicate'),
    }))
    const healthScore = calculateHealthScore(markedTransactions, monthlyBurnRate, topCategories, currentCash)
    const runway = currentCash ? calculateRunway(currentCash, monthlyBurnRate) : undefined

    if (runway && runway.runwayMonths < 6) {
      alerts.unshift({
        id: 'alert-runway',
        type: 'runway',
        severity: 'critical',
        title: `Runway critical: ${runway.runwayMonths.toFixed(1)} months remaining`,
        description: runway.suggestion,
        detectedAt: new Date().toISOString(),
      })
    }

    const profile: CompanyFinancialProfile = {
      companyName: companyName ?? 'Your Company',
      reportingPeriod: {
        start: transactions[0]?.date ?? '',
        end: transactions[transactions.length - 1]?.date ?? '',
      },
      totalExpenses,
      totalTransactions: transactions.length,
      monthlyBurnRate,
      averageMonthlyExpense: monthlyBurnRate,
      topCategories,
      monthlyBurns,
      transactions: markedTransactions,
      runway,
      healthScore,
      alerts,
      insights: [], // populated by Claude in Phase 2
      savingsOpportunities: [], // populated by Claude in Phase 2
    }

    return NextResponse.json({ success: true, profile })

  } catch (err) {
    console.error('[Analyze API]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
