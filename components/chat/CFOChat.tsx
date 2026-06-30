'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react'
import type { ChatMessage, CompanyFinancialProfile } from '@/types/financial'
import { STARTER_QUESTIONS } from '@/agents/cfo-assistant-agent'
import { cn } from '@/lib/utils/cn'

interface Props {
  profile: CompanyFinancialProfile | null
}

export function CFOChat({ profile }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: question.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, profile, history: messages }),
      })
      const data = await res.json()

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: data.answer ?? data.error ?? 'Something went wrong',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#4f6ef7]/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={22} className="text-[#4f6ef7]" />
              </div>
              <h3 className="text-white font-medium">Your AI CFO is ready</h3>
              <p className="text-sm text-[#8892a4] mt-1">
                {profile
                  ? `Loaded ${profile.totalTransactions} transactions — ask me anything`
                  : 'Upload financial data first for best results'}
              </p>
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              {STARTER_QUESTIONS.slice(0, 4).map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs text-[#8892a4] p-3 rounded-lg border border-white/[0.06] hover:border-[#4f6ef7]/50 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                msg.role === 'user' ? 'bg-[#4f6ef7]/20' : 'bg-[#1e2537]'
              )}
            >
              {msg.role === 'user'
                ? <User size={13} className="text-[#7b90f9]" />
                : <Bot size={13} className="text-[#4f6ef7]" />
              }
            </div>
            <div
              className={cn(
                'max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'bg-[#4f6ef7]/20 text-[#c4d0ff] ml-auto'
                  : 'bg-[#1e2537] text-[#c4cad6]'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#1e2537] flex items-center justify-center">
              <Bot size={13} className="text-[#4f6ef7]" />
            </div>
            <div className="bg-[#1e2537] px-4 py-3 rounded-xl flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-[#4f6ef7]" />
              <span className="text-xs text-[#8892a4]">CFO is analyzing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            placeholder="Ask your CFO anything about your finances..."
            className="flex-1 bg-[#1e2537] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#545e72] focus:outline-none focus:border-[#4f6ef7]/50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="px-3 py-2.5 rounded-lg bg-[#4f6ef7] hover:bg-[#3b55e6] disabled:opacity-40 text-white transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
