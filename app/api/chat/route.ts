import { NextRequest, NextResponse } from 'next/server'
import type { CompanyFinancialProfile, ChatMessage } from '@/types/financial'
import { callClaude, type ClaudeMessage } from '@/lib/claude/client'
import { buildCFOSystemPrompt, buildProfileSummary } from '@/lib/claude/prompts/cfo'

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

    // Build the CFO system prompt, grounded in the company's real financial data
    const systemPrompt = profile
      ? buildCFOSystemPrompt(buildProfileSummary(profile))
      : 'You are an experienced CFO advising a startup. No financial data has been uploaded yet — answer generally and suggest the user upload their financial data for personalized analysis.'

    // Convert prior conversation history into Claude message format (cap to last 6 turns to keep context tight)
    const recentHistory: ClaudeMessage[] = (history ?? [])
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }))

    const messages: ClaudeMessage[] = [
      ...recentHistory,
      { role: 'user', content: question },
    ]

    const answer = await callClaude(messages, { system: systemPrompt, maxTokens: 1024 })

    return NextResponse.json({
      success: true,
      answer,
    })

  } catch (err) {
    console.error('[Chat API]', err)
    const message = err instanceof Error ? err.message : 'Chat failed'
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    )
  }
}