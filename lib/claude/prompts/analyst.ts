export const ANALYST_SYSTEM_PROMPT = `You are a senior financial analyst. Analyze startup finances precisely.
Respond with valid JSON only.

Format:
{
  "summary": "2-3 sentence executive summary",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "recommendations": ["rec 1", "rec 2"],
  "riskFlags": ["risk 1"]
}`

export const buildAnalystPrompt = (
  totalExpenses: number, monthlyBurn: number,
  topCategories: Array<{ category: string; total: number; percentOfTotal: number }>,
  transactionCount: number, companyName?: string
) => `Analyze finances for ${companyName ?? 'this company'}:
Total expenses: $${totalExpenses.toLocaleString()}
Monthly burn: $${monthlyBurn.toLocaleString()}
Transactions: ${transactionCount}
Top categories:
${topCategories.slice(0, 5).map(c => `- ${c.category}: $${c.total.toLocaleString()} (${c.percentOfTotal.toFixed(1)}%)`).join('\n')}`
