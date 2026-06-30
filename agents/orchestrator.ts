/**
 * Agent Orchestrator
 * Coordinates the multi-agent pipeline:
 *   1. DocIntel (sequential, must run first)
 *   2. FinancialAnalyst + ExpenseOptimizer (parallel)
 *   3. CFOAssistant synthesis
 *
 * In Phase 2 this will use Lemma SDK for workflow management.
 * For now, exposes the interface and pipeline shape.
 */

import type { CompanyFinancialProfile, AgentResult } from '@/types/financial'
import { runDocIntelAgent, type DocIntelInput } from './doc-intel-agent'
import { runFinancialAnalystAgent } from './financial-analyst-agent'
import { runExpenseOptimizerAgent } from './expense-optimizer-agent'

export interface OrchestratorInput {
  fileName: string
  fileType: 'csv' | 'pdf'
  rawContent: string
  companyName?: string
  currentCash?: number
}

export interface OrchestratorProgress {
  stage: 'extracting' | 'analyzing' | 'optimizing' | 'synthesizing' | 'complete' | 'error'
  message: string
  percentComplete: number
}

export type ProgressCallback = (progress: OrchestratorProgress) => void

export async function runAnalysisPipeline(
  input: OrchestratorInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<CompanyFinancialProfile>> {
  const start = Date.now()

  try {
    // ── Stage 1: Document extraction ──────────────────────────────────
    onProgress?.({ stage: 'extracting', message: 'Reading and extracting financial data...', percentComplete: 10 })

    const docResult = await runDocIntelAgent({
      fileName: input.fileName,
      fileType: input.fileType,
      rawContent: input.rawContent,
    })

    if (!docResult.success || !docResult.data) {
      return { success: false, error: `Document extraction failed: ${docResult.error}` }
    }

    const { transactions } = docResult.data

    // ── Stage 2: Parallel analysis ────────────────────────────────────
    onProgress?.({ stage: 'analyzing', message: 'Analyzing spending patterns and burn rate...', percentComplete: 40 })

    const [analystResult, optimizerResult] = await Promise.all([
      runFinancialAnalystAgent({ transactions, companyName: input.companyName, currentCash: input.currentCash }),
      runExpenseOptimizerAgent({
        transactions,
        monthlyBurnRate: 0, // will be filled by analyst
        topCategories: [],
      }),
    ])

    onProgress?.({ stage: 'synthesizing', message: 'Generating CFO report...', percentComplete: 80 })

    // ── Stage 3: Synthesize into CompanyFinancialProfile ─────────────
    // Full implementation in Phase 2
    onProgress?.({ stage: 'complete', message: 'Analysis complete', percentComplete: 100 })

    return {
      success: false,
      error: 'Pipeline not fully implemented — Phase 2',
      durationMs: Date.now() - start,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    onProgress?.({ stage: 'error', message, percentComplete: 0 })
    return { success: false, error: message }
  }
}
