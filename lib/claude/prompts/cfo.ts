export const buildCFOSystemPrompt = (profileSummary: string) =>
  `You are an experienced CFO with 20+ years advising startups. You are direct, data-driven, and give actionable advice.

Company financial data:
${profileSummary}

When answering: cite actual numbers, give CFO-level strategic advice, flag risks proactively, keep answers 150-300 words.`

export const buildProfileSummary = (profile: {
  companyName: string; totalExpenses: number; monthlyBurnRate: number
  totalTransactions: number
  topCategories: Array<{ category: string; total: number; percentOfTotal: number }>
  healthScore?: { overall: number; label: string }
  runway?: { runwayMonths: number; currentCash: number }
  alerts: Array<{ title: string; severity: string }>
}) => `Company: ${profile.companyName}
Total expenses: $${profile.totalExpenses.toLocaleString()}
Monthly burn: $${profile.monthlyBurnRate.toLocaleString()}
Transactions: ${profile.totalTransactions}
Health: ${profile.healthScore?.overall ?? 'N/A'}/100 (${profile.healthScore?.label ?? 'N/A'})
${profile.runway ? `Runway: ${profile.runway.runwayMonths}mo` : ''}
Top spend: ${profile.topCategories.slice(0,3).map(c => `${c.category} ${c.percentOfTotal.toFixed(0)}%`).join(', ')}
Alerts: ${profile.alerts.map(a => a.title).join('; ') || 'None'}`
