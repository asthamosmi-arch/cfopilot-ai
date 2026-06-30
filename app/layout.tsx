import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/ui/Sidebar'

export const metadata: Metadata = {
  title: 'CFOPilot AI — Your Autonomous Finance Assistant',
  description: 'AI-powered CFO assistant for startups and growing companies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#0f1117]">
          {children}
        </main>
      </body>
    </html>
  )
}
