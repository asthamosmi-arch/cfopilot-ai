# CFOPilot AI

> Autonomous AI CFO assistant for startups and small companies — Hackathon MVP

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local and add your CLAUDE_API_KEY

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

## What works in Phase 1 (this build)

- ✅ Full project structure with TypeScript
- ✅ Dashboard UI with all cards (Health Score, Runway, Burn Chart, Alerts, Insights)
- ✅ File upload page with drag-and-drop
- ✅ CSV parsing and local financial analysis (no AI yet)
- ✅ Chat interface ready for Claude integration
- ✅ API routes: /api/upload, /api/analyze, /api/chat
- ✅ Agent interfaces for all 4 agents
- ✅ Prompt templates for Claude
- ✅ Sample financial data

## What comes in Phase 2

- 🔲 Claude API integration in all agents
- 🔲 Lemma SDK orchestration
- 🔲 PDF extraction via Claude
- 🔲 Streaming chat responses
- 🔲 AI-generated insights and savings recommendations
- 🔲 What-if simulator

## Project Structure

```
cfopilot-ai/
├── app/              # Next.js App Router pages
│   ├── dashboard/    # Main CFO dashboard
│   ├── upload/       # File upload flow
│   ├── chat/         # AI chat interface
│   └── api/          # Backend API routes
├── agents/           # AI agent definitions
├── components/       # React components
├── lib/
│   ├── claude/       # Claude API client + prompts
│   ├── parsers/      # CSV/PDF parsers
│   └── utils/        # Format, score utilities
├── types/            # TypeScript types
└── data/             # Sample financial data
```

## Testing with sample data

1. Navigate to `/upload`
2. Upload `data/sample-finance.csv`
3. Enter current cash (e.g. `1500000`) for runway calculation
4. Click "Analyze Financial Data"
5. Navigate to `/dashboard` to see results
6. Go to `/chat` to ask questions (placeholder in Phase 1)

## Environment Variables

```env
CLAUDE_API_KEY=sk-ant-...     # Required for Phase 2 AI features
LEMMA_API_KEY=...             # Required for Phase 2 agent orchestration
```
