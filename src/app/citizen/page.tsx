'use client'
// src/app/citizen/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CitizenSidebar from '@/components/citizen/CitizenSidebar'
import CitizenFeed from '@/components/citizen/CitizenFeed'
import CitizenAwareness from '@/components/citizen/CitizenAwareness'
import CitizenAlerts from '@/components/citizen/CitizenAlerts'
import CitizenComplaints from '@/components/citizen/CitizenComplaints'
import CitizenMap from '@/components/citizen/CitizenMap'
import CitizenSchemes from '@/components/citizen/CitizenSchemes'

export type CitizenTab = 'feed' | 'awareness' | 'alerts' | 'complaints' | 'map' | 'schemes'
export type Language = 'en' | 'hi' | 'mr'

export const LABELS: Record<Language, Record<CitizenTab, string>> = {
  en: { feed: 'Community Feed', awareness: 'Awareness', alerts: 'Alerts', complaints: 'Complaints', map: 'Bin Map', schemes: 'Schemes' },
  hi: { feed: 'सामुदायिक फ़ीड', awareness: 'जागरूकता', alerts: 'सूचनाएं', complaints: 'शिकायतें', map: 'बिन मानचित्र', schemes: 'योजनाएं' },
  mr: { feed: 'समुदाय फीड', awareness: 'जनजागृती', alerts: 'सूचना', complaints: 'तक्रारी', map: 'बिन नकाशा', schemes: 'योजना' },
}

export default function CitizenPage() {
  const router = useRouter()
  const [tab, setTab] = useState<CitizenTab>('feed')
  const [lang, setLang] = useState<Language>('en')

  const tabComponents: Record<CitizenTab, React.ReactNode> = {
    feed: <CitizenFeed lang={lang} />,
    awareness: <CitizenAwareness lang={lang} />,
    alerts: <CitizenAlerts lang={lang} />,
    complaints: <CitizenComplaints lang={lang} />,
    map: <CitizenMap />,
    schemes: <CitizenSchemes lang={lang} />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <CitizenSidebar
        tab={tab}
        setTab={setTab}
        lang={lang}
        setLang={setLang}
        onExit={() => router.push('/')}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          padding: '12px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', letterSpacing: 2, textTransform: 'uppercase' }}>
            {LABELS[lang][tab]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 11, fontFamily: 'Space Mono, monospace', color: 'var(--green)' }}>PUNE LIVE</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tabComponents[tab]}
        </div>
      </div>
    </div>
  )
}
