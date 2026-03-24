'use client'
// src/components/citizen/CitizenSidebar.tsx
import type { CitizenTab, Language } from '@/app/citizen/page'
import { LABELS } from '@/app/citizen/page'
import { isDemoMode } from '@/lib/supabase'

const TABS: { id: CitizenTab; icon: string }[] = [
  { id: 'feed', icon: '🌐' },
  { id: 'awareness', icon: '📢' },
  { id: 'alerts', icon: '🔔' },
  { id: 'complaints', icon: '📋' },
  { id: 'map', icon: '🗺️' },
  { id: 'schemes', icon: '🏛️' },
]

interface Props {
  tab: CitizenTab
  setTab: (t: CitizenTab) => void
  lang: Language
  setLang: (l: Language) => void
  onExit: () => void
}

export default function CitizenSidebar({ tab, setTab, lang, setLang, onExit }: Props) {
  return (
    <aside style={{ width: 200, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0 }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={onExit}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 3, color: 'var(--amber)' }}>SWACHH-AI</div>
        <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>CITIZEN PORTAL</div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {TABS.map(t => (
          <div
            key={t.id}
            className={`side-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span style={{ fontSize: 15 }}>{t.icon}</span>
            <span style={{ fontSize: 12 }}>{LABELS[lang][t.id]}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        {isDemoMode && (
          <div style={{ fontSize: 9, color: 'var(--amber)', fontFamily: 'Space Mono', marginBottom: 8, padding: '4px 8px', background: 'rgba(255,183,0,0.06)', border: '1px solid rgba(255,183,0,0.2)' }}>⚡ DEMO</div>
        )}
        <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>Language</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {(['en', 'hi', 'mr'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                flex: 1, padding: '5px',
                background: lang === l ? 'rgba(255,183,0,0.18)' : 'var(--bg3)',
                border: `1px solid ${lang === l ? 'var(--amber)' : 'var(--border)'}`,
                color: lang === l ? 'var(--amber)' : 'var(--text3)',
                fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="btn-danger" style={{ width: '100%', fontSize: 10 }} onClick={onExit}>← EXIT</button>
      </div>
    </aside>
  )
}
