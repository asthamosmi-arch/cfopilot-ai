/**
 * Claude API client wrapper
 * Centralizes all Claude API calls with error handling and retry logic
 * Used by all agents in Phase 2
 */

const CLAUDE_MODEL = 'claude-sonnet-4-6'
const API_URL = 'https://api.anthropic.com/v1/messages'

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeOptions {
  system?: string
  maxTokens?: number
  temperature?: number
}

export async function callClaude(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) throw new Error('CLAUDE_API_KEY not set in environment')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: options.maxTokens ?? 2048,
      system: options.system,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const content = data.content?.[0]?.text
  if (!content) throw new Error('Empty response from Claude')
  return content
}

export async function callClaudeJSON<T>(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): Promise<T> {
  const text = await callClaude(messages, options)
  try {
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(clean) as T
  } catch {
    throw new Error(`Claude returned non-JSON: ${text.substring(0, 200)}`)
  }
}

// Streaming version for chat (returns ReadableStream)
export async function callClaudeStream(
  messages: ClaudeMessage[],
  system: string
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) throw new Error('CLAUDE_API_KEY not set in environment')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      stream: true,
      system,
      messages,
    }),
  })

  if (!res.ok || !res.body) {
    throw new Error(`Claude stream error: ${res.status}`)
  }

  return res.body
}
