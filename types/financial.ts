// ─── Core financial primitives ────────────────────────────────────────────────

export interface Transaction {
  id: string
  date: string
  vendor: string
  category: ExpenseCategory
  amount: number
  currency: string
  description?: string
  isAnomaly?: boolean
  confidence?: number
}

export type ExpenseCategory =
  | 'Cloud & Infrastructure'
  | 'Marketing & Ads'
  | 'Payroll & HR'
  | 'Operations'
  | 'Software & SaaS'
  | 'Legal & Finance'
  | 'Sales'
  | 'Research & Development'
  | 'Other'

export interface Expense extends Transaction {
  month: string
  percentOfTotal?: number
}

export interface CategoryBreakdown {
  category: ExpenseCategory
  total: number
  count: number
  percentOfTotal: number
  trend: 'up' | 'down' | 'stable'
  trendPercent?: number
}

export interface MonthlyBurn {
  month: string
  total: number
  byCategory: Partial<Record<ExpenseCategory, number>>
}

export interface RunwayProjection {
  currentCash: number
  monthlyBurnRate: number
  runwayMonths: number
  runwayDate: string
  confidence: 'high' | 'medium' | 'low'
  suggestion: string
}

export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertType = 'spike' | 'anomaly' | 'duplicate' | 'budget_breach' | 'trend' | 'runway'

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  amount?: number
  category?: ExpenseCategory
  detectedAt: string
  acknowledged?: boolean
}

export interface CostSavingOpportunity {
  id: string
  title: string
  description: string
  estimatedSaving: number
  effort: 'low' | 'medium' | 'high'
  category: ExpenseCategory
  action: string
}

export interface FinancialInsight {
  id: string
  generatedAt: string
  summary: string
  keyFindings: string[]
  recommendations: string[]
  rawAnalysis?: string
}

export interface HealthScoreBreakdown {
  overall: number
  spendingEfficiency: number
  budgetControl: number
  cashFlowHealth: number
  expenseDiversity: number
  label: 'Critical' | 'At Risk' | 'Fair' | 'Good' | 'Excellent'
  color: string
}

export interface CompanyFinancialProfile {
  companyName: string
  reportingPeriod: { start: string; end: string }
  totalExpenses: number
  totalTransactions: number
  monthlyBurnRate: number
  averageMonthlyExpense: number
  topCategories: CategoryBreakdown[]
  monthlyBurns: MonthlyBurn[]
  transactions: Transaction[]
  runway?: RunwayProjection
  healthScore?: HealthScoreBreakdown
  alerts: Alert[]
  insights: FinancialInsight[]
  savingsOpportunities: CostSavingOpportunity[]
}

export interface DocumentExtractionResult {
  transactions: Transaction[]
  metadata: {
    sourceFile: string
    fileType: 'csv' | 'pdf'
    rowsProcessed: number
    extractionConfidence: number
  }
}

export interface AgentResult<T> {
  success: boolean
  data?: T
  error?: string
  tokensUsed?: number
  durationMs?: number
}

export interface SimulationScenario {
  description: string
  type: 'hire' | 'cut_expense' | 'new_investment' | 'revenue_change' | 'custom'
  parameters: Record<string, number | string>
}

export interface SimulationResult {
  scenario: SimulationScenario
  currentBurnRate: number
  projectedBurnRate: number
  currentRunway: number
  projectedRunway: number
  monthlyImpact: number
  annualImpact: number
  narrative: string
  risks: string[]
  opportunities: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface CFOChatContext {
  profile: CompanyFinancialProfile | null
  conversationHistory: ChatMessage[]
}
