'use client'
// src/app/admin/bins/page.tsx
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBins } from '@/hooks/useData'
import { FillBar, StatusBadge, Spinner, PanelHeader } from '@/components/ui'
import type { BinStatus } from '@/types'

const FILTERS: { label: string; value: BinStatus | 'all' }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'CRITICAL', value: 'critical' },
  { label: 'WARNING', value: 'warning' },
  { label: 'NORMAL', value: 'normal' },
]

const COLS = ['ID', 'LOCATION', 'STATUS', 'FILL LEVEL', 'TYPE', 'LAST COLL.', 'ZONE']
const GRID = '80px 1fr 110px 140px 80px 110px 80px'

export default function AdminBinsPage() {
  const { data: bins, loading } = useBins()
  const [filter, setFilter] = useState<BinStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = (bins ?? []).filter(b => {
    const matchStatus = filter === 'all' || b.status === filter
    const matchSearch = b.location.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="Bin Network" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  style={{
                    padding: '6px 16px',
                    fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 1.5,
                    cursor: 'pointer', border: '1px solid var(--border)',
                    background: filter === f.value ? 'rgba(0,180,255,0.12)' : 'transparent',
                    color: filter === f.value ? 'var(--cyan)' : 'var(--text2)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.label}
                  {bins && f.value !== 'all' && (
                    <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.7 }}>
                      ({bins.filter(b => b.status === f.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              className="inp"
              style={{ maxWidth: 220, height: 34 }}
              placeholder="Search by ID or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono' }}>
              {filtered.length} / {bins?.length ?? 0} BINS
            </span>
          </div>

          {/* Table */}
          {loading ? <Spinner /> : (
            <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
              {/* Header */}
              <div className="tbl-row" style={{ gridTemplateColumns: GRID, background: 'rgba(0,0,0,0.4)', borderTop: 'none' }}>
                {COLS.map(col => (
                  <div key={col} style={{ fontSize: 9, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 2, color: 'var(--text3)', textTransform: 'uppercase' }}>{col}</div>
                ))}
              </div>

              {filtered.map((bin, i) => (
                <div
                  key={bin.id}
                  className="tbl-row anim-fade-up"
                  style={{ gridTemplateColumns: GRID, animationDelay: `${i * 0.04}s` }}
                >
                  <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--cyan)' }}>{bin.id}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{bin.location}</span>
                  <StatusBadge status={bin.status} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <FillBar pct={bin.fill_level} />
                    <span style={{ fontSize: 9, fontFamily: 'Space Mono', color: 'var(--text3)' }}>{bin.fill_level}%</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'capitalize' }}>{bin.waste_type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'Space Mono' }}>{bin.last_collected}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{bin.zone}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
