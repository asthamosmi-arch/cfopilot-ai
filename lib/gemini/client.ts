/**
 * Gemini API client wrapper
 * Used as the live LLM backend for the CFO chat feature.
 * (CFOPilot's agent architecture was built against Anthropic's Claude API —
 * see lib/claude/client.ts — but the live hackathon demo runs on Google's
 * free-tier Gemini API to avoid requiring a funded Anthropic billing account.)
 */

const GEMINI_MODEL = 'gemini-2.5-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export interface GeminiMessage {
  role: 'user' | 'model'
  content: string
}

export interface GeminiOptions {
  system?: string
  maxTokens?: number
}

export async function callGemini(
  messages: GeminiMessage[],
  options: GeminiOptions = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment')

  const contents = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }))

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: options.maxTokens ?? 1024,
    },
  }

  if (options.system) {
    body.systemInstruction = {
      role: 'system',
      parts: [{ text: options.system }],
    }
  }

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}