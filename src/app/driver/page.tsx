'use client'
// src/app/driver/page.tsx
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBins, useTrucks, apiPatch } from '@/hooks/useData'
import { FillBar, StatusBadge, Spinner } from '@/components/ui'
import { DEMO_TRUCKS } from '@/lib/demo-data'
import type { Bin } from '@/types'

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false, loading: () => <Spinner /> })

export default function DriverPage() {
  const router = useRouter()
  const { data: bins, refetch: refetchBins } = useBins()
  const { data: trucks } = useTrucks()
  const [collected, setCollected] = useState<Set<string>>(new Set())
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)
  const [time, setTime] = useState('')

  // Use first truck as this driver's truck (in prod: get from auth)
  const myTruck = (trucks ?? DEMO_TRUCKS)[0]
  const assignedBins = (bins ?? [])
    .filter(b => b.zone === 'Zone A' || b.zone === 'Zone B')
    .sort((a, b) => b.fill_level - a.fill_level)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleCollect = async (bin: Bin) => {
    await apiPatch('/api/bins', { id: bin.id, fill_level: 0 })
    setCollected(prev => new Set([...prev, bin.id]))
    refetchBins()
  }

  const collectedCount = collected.size
  const totalAssigned = assignedBins.filter(b => b.fill_level >= 60).length

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <style>{`@keyframes fade-up { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <div className="scan-line" />

      {/* Sidebar */}
      <aside style={{ width: 260, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 3, color: 'var(--green)' }}>DRIVER HUB</div>
          <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>FIELD OPERATIONS PANEL</div>
        </div>

        {/* Driver info */}
        <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green), var(--bg3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid rgba(0,230,118,0.3)' }}>👤</div>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{myTruck?.driver_name ?? 'Rajesh Kumar'}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono, monospace' }}>TRUCK {myTruck?.id ?? 'T01'}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ['ROUTE', myTruck?.route_name ?? 'R-Alpha'],
              ['ZONE', 'A + B'],
              ['FUEL', `${myTruck?.fuel_level ?? 72}%`],
              ['PROGRESS', `${collectedCount}/${totalAssigned}`],
            ].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--bg3)', padding: '8px 10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, color: 'var(--cyan)' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>
              <span>SHIFT PROGRESS</span>
              <span>{totalAssigned > 0 ? Math.round((collectedCount / totalAssigned) * 100) : 0}%</span>
            </div>
            <FillBar pct={totalAssigned > 0 ? (collectedCount / totalAssigned) * 100 : 0} height={6} />
          </div>
        </div>

        {/* Bin list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="panel-hdr">
            <span style={{ color: 'var(--green)' }}>🗑️</span> ASSIGNED BINS
            <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: 'Space Mono', color: 'var(--text3)' }}>PRIORITY ORDER</span>
          </div>

          {assignedBins.map(bin => {
            const done = collected.has(bin.id)
            const skip = bin.fill_level < 60
            return (
              <div
                key={bin.id}
                style={{
                  padding: '11px 14px', marginBottom: 1,
                  background: done ? 'rgba(0,230,118,0.04)' : skip ? 'transparent' : 'var(--bg3)',
                  border: `1px solid ${done ? 'rgba(0,230,118,0.18)' : 'var(--border)'}`,
                  opacity: skip ? 0.4 : 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setSelectedBin(bin)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: done ? 'var(--green)' : 'var(--cyan)' }}>{bin.id}</span>
                    {skip && <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700 }}>SKIP</span>}
                  </div>
                  <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: bin.fill_level >= 80 ? 'var(--red)' : bin.fill_level >= 60 ? 'var(--amber)' : 'var(--text3)' }}>
                    {bin.fill_level}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{bin.location}</div>
                <FillBar pct={bin.fill_level} />

                {!done && !skip && (
                  <button
                    className="btn-success"
                    style={{ width: '100%', marginTop: 8, padding: '6px', fontSize: 10 }}
                    onClick={e => { e.stopPropagation(); handleCollect(bin) }}
                  >
                    ✓ MARK COLLECTED
                  </button>
                )}
                {done && (
                  <div style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'Space Mono', marginTop: 6, textAlign: 'center' }}>✓ COLLECTED</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono', marginBottom: 8, textAlign: 'center' }}>{time}</div>
          <button className="btn-danger" style={{ width: '100%', fontSize: 10 }} onClick={() => router.push('/')}>← EXIT</button>
        </div>
      </aside>

      {/* Map */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ padding: '10px 18px', background: 'rgba(7,11,16,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="live-dot" />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 2, color: 'var(--green)' }}>
              ROUTE {myTruck?.route_name ?? 'R-ALPHA'} — LIVE NAVIGATION
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { icon: '🗑️', label: `${collectedCount} COLLECTED` },
              { icon: '⏱', label: 'EST. 45 MIN LEFT' },
              { icon: '📍', label: 'ZONE A + B' },
            ].map(s => (
              <span key={s.label} style={{ fontSize: 11, color: 'var(--text2)' }}>{s.icon} {s.label}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <LiveMap
            bins={bins ?? []}
            trucks={trucks ?? []}
            selectedBin={selectedBin}
            onBinClick={setSelectedBin}
            height="100%"
          />
        </div>
      </main>
    </div>
  )
}
