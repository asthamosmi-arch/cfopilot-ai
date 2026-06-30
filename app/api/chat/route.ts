import { NextRequest, NextResponse } from 'next/server'
import type { CompanyFinancialProfile, ChatMessage } from '@/types/financial'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { question, profile, history } = body as {
      question: string
      profile: CompanyFinancialProfile | null
      history: ChatMessage[]
    }

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // Phase 2: Replace with actual Claude streaming API call
    // For now, return a structured placeholder that shows what the response will look like
    const contextSummary = profile
      ? `Company has $${(profile.totalExpenses / 1000).toFixed(0)}K in total expenses, ${profile.totalTransactions} transactions.`
      : 'No financial data loaded yet.'

    return NextResponse.json({
      success: true,
      answer: `[Claude CFO Agent — Phase 2 Integration Pending]\n\nContext received: ${contextSummary}\nQuestion: "${question}"\n\nOnce the Claude API is connected in Phase 2, I will analyze your complete financial data and provide CFO-grade insights here.`,
      phase: 'placeholder',
    })

  } catch (err) {
    console.error('[Chat API]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chat failed' },
      { status: 500 }
    )
  }
}
