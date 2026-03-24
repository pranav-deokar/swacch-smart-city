'use client'
// src/components/admin/AdminTopBar.tsx
import { useAnalytics } from '@/hooks/useData'
import { StatChip } from '@/components/ui'

export default function AdminTopBar({ title }: { title: string }) {
  const { data: analytics } = useAnalytics()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 20px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg2)', flexShrink: 0, height: 52,
    }}>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: 2, textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StatChip label="BINS CRITICAL" value={analytics?.bins_critical ?? '—'} color="var(--red)" />
        <StatChip label="TRUCKS ACTIVE" value={analytics?.trucks_active ?? '—'} color="var(--green)" />
        <StatChip label="VIOLATIONS" value={analytics?.violations_today ?? '—'} color="var(--amber)" />
        <StatChip label="COMPLIANCE" value={analytics ? `${analytics.compliance_rate}%` : '—'} color="var(--cyan)" />
      </div>
    </div>
  )
}
