/**
 * Document Intelligence Agent
 * Reads CSV and PDF files, extracts structured financial transactions
 * using Claude as the reasoning engine.
 */

import type { DocumentExtractionResult, AgentResult, Transaction, ExpenseCategory } from '@/types/financial'

export interface DocIntelInput {
  fileName: string
  fileType: 'csv' | 'pdf'
  rawContent: string // text content of the file
}

// Canonical category mapping for Claude's output normalization
export const VALID_CATEGORIES: ExpenseCategory[] = [
  'Cloud & Infrastructure',
  'Marketing & Ads',
  'Payroll & HR',
  'Operations',
  'Software & SaaS',
  'Legal & Finance',
  'Sales',
  'Research & Development',
  'Other',
]

export async function runDocIntelAgent(
  input: DocIntelInput
): Promise<AgentResult<DocumentExtractionResult>> {
  // Implemented in Phase 2 — Claude API integration
  // Will: parse raw text → call Claude with extraction prompt → return structured transactions
  console.log('[DocIntel] Agent called for:', input.fileName)

  return {
    success: false,
    error: 'Agent not yet implemented — Phase 2',
  }
}

// Utility: normalize a raw category string to our enum
export function normalizeCategory(raw: string): ExpenseCategory {
  const lower = raw.toLowerCase()
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('infra')) return 'Cloud & Infrastructure'
  if (lower.includes('market') || lower.includes('ads') || lower.includes('advertis')) return 'Marketing & Ads'
  if (lower.includes('payroll') || lower.includes('salary') || lower.includes('hr')) return 'Payroll & HR'
  if (lower.includes('saas') || lower.includes('software') || lower.includes('subscription')) return 'Software & SaaS'
  if (lower.includes('legal') || lower.includes('finance') || lower.includes('audit')) return 'Legal & Finance'
  if (lower.includes('sales') || lower.includes('crm')) return 'Sales'
  if (lower.includes('research') || lower.includes('r&d')) return 'Research & Development'
  if (lower.includes('office') || lower.includes('operation')) return 'Operations'
  return 'Other'
}
