import { NextRequest, NextResponse } from 'next/server'
import { parseFinancialCSV } from '@/lib/parsers/csv-parser'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name
    const fileType = fileName.endsWith('.csv') ? 'csv' : 'pdf'
    const allowedTypes = ['text/csv', 'application/pdf', 'text/plain']
    
    if (!allowedTypes.some(t => file.type.includes(t.split('/')[1])) && 
        !fileName.endsWith('.csv') && !fileName.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only CSV and PDF files are supported' }, { status: 400 })
    }

    const rawContent = await file.text()

    // For CSV files, we can parse immediately on the server side
    if (fileType === 'csv') {
      const parseResult = parseFinancialCSV(rawContent, fileName)
      
      return NextResponse.json({
        success: true,
        fileName,
        fileType,
        rowsExtracted: parseResult.rowCount,
        transactionCount: parseResult.transactions.length,
        transactions: parseResult.transactions,
        parseErrors: parseResult.errors,
        rawContent, // pass through so agent can re-process with Claude if needed
        message: `Successfully extracted ${parseResult.transactions.length} transactions from ${fileName}`,
      })
    }

    // PDF: return raw content for Claude to extract in Phase 2
    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      rawContent,
      message: `PDF uploaded. AI extraction will process ${fileName} in Phase 2.`,
    })

  } catch (err) {
    console.error('[Upload API]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
