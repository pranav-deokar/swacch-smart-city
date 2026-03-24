'use client'
// src/components/admin/AdminSidebar.tsx
import { usePathname, useRouter } from 'next/navigation'
import { isDemoMode } from '@/lib/supabase'

const NAV = [
  { id: 'map',        label: 'Command Map',   icon: '🗺️',  path: '/admin' },
  { id: 'bins',       label: 'Bin Network',   icon: '🗑️',  path: '/admin/bins' },
  { id: 'trucks',     label: 'Fleet',         icon: '🚛',  path: '/admin/trucks' },
  { id: 'violations', label: 'AI Violations', icon: '⚠️',  path: '/admin/violations' },
  { id: 'complaints', label: 'Complaints',    icon: '📋',  path: '/admin/complaints' },
  { id: 'analytics',  label: 'Analytics',     icon: '📊',  path: '/admin/analytics' },
  { id: 'routing',    label: 'Smart Routes',  icon: '🧭',  path: '/admin/routing' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const now = new Date().toLocaleTimeString()

  return (
    <aside style={{
      width: 200, borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg2)', flexShrink: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => router.push('/')}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 3, color: 'var(--cyan)' }}>SWACHH-AI</div>
        <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>ADMIN COMMAND</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV.map(item => {
          const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
          return (
            <div
              key={item.id}
              className={`side-item ${active ? 'active' : ''}`}
              onClick={() => router.push(item.path)}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 12 }}>{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        {isDemoMode && (
          <div style={{ fontSize: 9, color: 'var(--amber)', fontFamily: 'Space Mono', marginBottom: 8, padding: '4px 8px', background: 'rgba(255,183,0,0.06)', border: '1px solid rgba(255,183,0,0.2)' }}>
            ⚡ DEMO MODE
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'Space Mono' }}>SYSTEM LIVE</span>
        </div>
        <button className="btn-danger" style={{ width: '100%', fontSize: 10 }} onClick={() => router.push('/')}>
          ← EXIT
        </button>
      </div>
    </aside>
  )
}
