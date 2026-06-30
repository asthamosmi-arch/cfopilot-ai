/**
 * Financial Analyst Agent
 * Analyzes structured transactions to produce burn rate, trends,
 * category breakdowns, and a narrative financial report.
 */

import type {
  Transaction,
  CategoryBreakdown,
  MonthlyBurn,
  FinancialInsight,
  AgentResult,
} from '@/types/financial'

export interface FinancialAnalystInput {
  transactions: Transaction[]
  companyName?: string
  currentCash?: number
}

export interface FinancialAnalystOutput {
  totalExpenses: number
  monthlyBurnRate: number
  averageMonthlyExpense: number
  topCategories: CategoryBreakdown[]
  monthlyBurns: MonthlyBurn[]
  insight: FinancialInsight
}

export async function runFinancialAnalystAgent(
  input: FinancialAnalystInput
): Promise<AgentResult<FinancialAnalystOutput>> {
  // Implemented in Phase 2 — Claude API integration
  // Will: aggregate transactions → call Claude with analyst prompt → return structured report
  console.log('[FinancialAnalyst] Agent called with', input.transactions.length, 'transactions')

  return {
    success: false,
    error: 'Agent not yet implemented — Phase 2',
  }
}
