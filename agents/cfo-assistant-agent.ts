/**
 * AI CFO Assistant Agent
 * Answers natural language questions about company finances.
 * Has full context of the company's financial profile and conversation history.
 */

import type { CompanyFinancialProfile, ChatMessage, AgentResult } from '@/types/financial'

export interface CFOAssistantInput {
  question: string
  profile: CompanyFinancialProfile
  conversationHistory: ChatMessage[]
}

export interface CFOAssistantOutput {
  answer: string
  citations?: string[] // references to specific data points used
  followUpQuestions?: string[]
}

export async function runCFOAssistantAgent(
  input: CFOAssistantInput
): Promise<AgentResult<CFOAssistantOutput>> {
  // Implemented in Phase 2 — Claude API with streaming
  // Will: inject financial context into system prompt → stream Claude response
  console.log('[CFOAssistant] Question received:', input.question)

  return {
    success: false,
    error: 'Agent not yet implemented — Phase 2',
  }
}

// Suggested starter questions shown in the chat UI
export const STARTER_QUESTIONS = [
  'What is our current financial health and biggest risks?',
  'Where are we spending the most and how does it compare to industry norms?',
  'How can we extend our runway by 6 months?',
  'Are there any unusual or duplicate transactions I should know about?',
  'What would happen if we hired 5 more engineers?',
  'Which expenses should we cut first if we need to reduce burn rate?',
]
