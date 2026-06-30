import type { Transaction } from '@/types/financial'
import { normalizeCategory } from '@/agents/doc-intel-agent'

export interface CSVParseResult {
  transactions: Transaction[]
  rowCount: number
  errors: string[]
}

export function parseFinancialCSV(content: string, fileName: string): CSVParseResult {
  const errors: string[] = []
  const transactions: Transaction[] = []

  const lines = content.trim().split('\n')
  if (lines.length < 2) {
    return { transactions: [], rowCount: 0, errors: ['CSV has no data rows'] }
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const colIndex = {
    date: headers.indexOf('date'),
    vendor: headers.indexOf('vendor'),
    category: headers.indexOf('category'),
    amount: headers.indexOf('amount'),
    currency: headers.indexOf('currency'),
    description: headers.indexOf('description'),
  }

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim())
    if (row.length < 3) continue

    try {
      const amount = parseFloat(row[colIndex.amount] ?? '0')
      if (isNaN(amount)) {
        errors.push(`Row ${i + 1}: invalid amount "${row[colIndex.amount]}"`)
        continue
      }

      const rawCategory = colIndex.category >= 0 ? row[colIndex.category] : ''
      const transaction: Transaction = {
        id: `txn-${i}-${Date.now()}`,
        date: row[colIndex.date] ?? new Date().toISOString().split('T')[0],
        vendor: row[colIndex.vendor] ?? 'Unknown',
        category: normalizeCategory(rawCategory),
        amount,
        currency: colIndex.currency >= 0 ? row[colIndex.currency] : 'USD',
        description: colIndex.description >= 0 ? row[colIndex.description] : undefined,
        confidence: 0.95,
      }
      transactions.push(transaction)
    } catch (e) {
      errors.push(`Row ${i + 1}: ${e}`)
    }
  }

  return { transactions, rowCount: lines.length - 1, errors }
}
