export const DOC_INTEL_SYSTEM_PROMPT = `You are a financial document parser. Extract structured transaction data from financial documents.
Respond with valid JSON only. No explanations, no markdown, just JSON.

Response format:
{
  "transactions": [
    { "date": "YYYY-MM-DD", "vendor": "Name", "category": "Software & SaaS", "amount": 5000, "currency": "USD", "description": "optional" }
  ],
  "confidence": 0.95
}

Valid categories: Cloud & Infrastructure, Marketing & Ads, Payroll & HR, Operations, Software & SaaS, Legal & Finance, Sales, Research & Development, Other`

export const DOC_INTEL_USER_PROMPT = (content: string, fileType: string) =>
  `Parse this ${fileType.toUpperCase()} and extract all financial transactions:\n\n${content}`
