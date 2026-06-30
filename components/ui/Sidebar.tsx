'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, MessageSquare, TrendingUp, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/upload', icon: Upload, label: 'Upload Files' },
  { href: '/chat', icon: MessageSquare, label: 'CFO Chat' },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 flex flex-col border-r border-white/[0.06] bg-[#161b27] shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#4f6ef7] flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight">CFOPilot</div>
            <div className="text-[10px] text-[#4f6ef7] font-medium">AI Finance Assistant</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || path.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-[#4f6ef7]/15 text-[#7b90f9] font-medium'
                  : 'text-[#8892a4] hover:text-white hover:bg-white/[0.05]'
              )}
            >
              <Icon size={16} className={active ? 'text-[#7b90f9]' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="px-3 py-2 text-[10px] text-[#545e72] font-mono">
          MVP v0.1 · Hackathon Build
        </div>
      </div>
    </aside>
  )
}
