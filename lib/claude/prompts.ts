import { Transaction } from '@/types/financial'

export const DOC_INTEL_PROMPT = `You are a Document Intelligence Agent specializing in financial data extraction.
Your job is to analyze financial data and return clean, structured JSON.
Always respond with valid JSON only — no explanation, no markdown.`

export const FINANCIAL_ANALYST_PROMPT = `You are a Financial Analyst Agent for CFOPilot AI.
You analyze expense data to produce actionable financial intelligence.
You identify patterns, trends, anomalies, and insights for startup founders and CFOs.
Always respond with valid JSON only.`

export const EXPENSE_OPTIMIZER_PROMPT = `You are an Expense Optimization Agent.
You detect waste, anomalies, duplicate payments, and cost reduction opportunities.
You produce specific, actionable savings recommendations with dollar amounts.
Always respond with valid JSON only.`

export const CFO_ASSISTANT_SYSTEM = `You are CFOPilot AI — an experienced CFO and financial advisor for startups.
You have deep expertise in startup finance, burn rate management, fundraising, and cost optimization.
You speak directly and confidently like a seasoned CFO advising a founder.
You have access to the company's full financial data and use it in every answer.
Be specific with numbers. Give concrete recommendations. Avoid generic advice.
Format responses in clean paragraphs — no bullet lists unless specifically helpful.`

export function buildAnalystUserPrompt(transactions: Transaction[]): string {
  const summary = {
    totalTransactions: transactions.length,
    totalAmount: transactions.reduce((s, t) => s + t.amount, 0),
    categories: Array.from(new Set(transactions.map((t) => t.category))),
    dateRange: {
      from: transactions.map((t) => t.date).sort()[0],
      to: transactions.map((t) => t.date).sort().reverse()[0],
    },
    transactions: transactions.slice(0, 50), // cap for token efficiency
  }

  return `Analyze these financial transactions and return a JSON object with this exact structure:
{
  "healthScore": <integer 0-100>,
  "expensesByCategory": [{"category": string, "total": number, "count": number, "percentage": number}],
  "monthlyTrend": [{"month": string, "amount": number}],
  "topVendors": [{"vendor": string, "total": number, "count": number, "category": string}],
  "burnRate": <monthly burn rate as number>,
  "insights": {
    "summary": <2-3 sentence executive summary>,
    "keyFindings": [<3-5 key findings as strings>],
    "recommendations": [<3-5 specific recommendations as strings>],
    "riskFactors": [<2-3 risk factors as strings>]
  }
}

Financial Data:
${JSON.stringify(summary, null, 2)}`
}

export function buildOptimizerUserPrompt(transactions: Transaction[]): string {
  return `Analyze these transactions for waste, anomalies, and savings opportunities.
Return JSON with this exact structure:
{
  "alerts": [
    {"id": string, "type": "warning"|"danger"|"info", "title": string, "description": string, "category": string}
  ],
  "anomalies": [<transaction ids that look anomalous>],
  "savingsOpportunities": [
    {"category": string, "currentSpend": number, "potentialSavings": number, "action": string}
  ],
  "duplicateRisks": [<descriptions of potential duplicate payments>]
}

Transactions:
${JSON.stringify(transactions.slice(0, 50), null, 2)}`
}

export function buildCFOContextPrompt(profile: {
  totalExpenses: number
  healthScore: number
  burnRate: number
  runwayMonths: number
  topCategories: string[]
  alerts: number
  period: string
}): string {
  return `You have access to this company's financial data:
- Period: ${profile.period}
- Total Expenses: $${profile.totalExpenses.toLocaleString()}
- Financial Health Score: ${profile.healthScore}/100
- Monthly Burn Rate: $${profile.burnRate.toLocaleString()}
- Runway: ${profile.runwayMonths.toFixed(1)} months
- Top Spending Categories: ${profile.topCategories.join(', ')}
- Active Alerts: ${profile.alerts}

Answer the user's question as their trusted CFO. Be direct, specific, and use the numbers above.`
}
