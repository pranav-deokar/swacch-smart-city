'use client'
// src/components/citizen/CitizenMap.tsx
import dynamic from 'next/dynamic'
import { useBins, useTrucks } from '@/hooks/useData'
import { Spinner, StatusBadge, FillBar } from '@/components/ui'
import { useState } from 'react'
import type { Bin } from '@/types'

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false, loading: () => <Spinner /> })

export default function CitizenMap() {
  const { data: bins, loading } = useBins()
  const { data: trucks } = useTrucks()
  const [selected, setSelected] = useState<Bin | null>(null)

  const nearbyBins = (bins ?? []).slice(0, 5).sort((a, b) => a.fill_level - b.fill_level)

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {loading ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div> : (
        <LiveMap
          bins={bins ?? []}
          trucks={trucks ?? []}
          selectedBin={selected}
          onBinClick={setSelected}
          height="100%"
        />
      )}

      {/* Nearby panel overlay */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 1000,
        background: 'rgba(7,11,16,0.92)', border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)', width: 240,
      }}>
        <div className="panel-hdr"><span style={{ color: 'var(--cyan)' }}>📍</span> NEAREST BINS</div>
        {nearbyBins.map(bin => (
          <div
            key={bin.id}
            onClick={() => setSelected(bin)}
            style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected?.id === bin.id ? 'rgba(0,180,255,0.07)' : 'transparent' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--cyan)' }}>{bin.id}</span>
              <StatusBadge status={bin.status} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5 }}>{bin.location}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FillBar pct={bin.fill_level} />
              <span style={{ fontSize: 10, fontFamily: 'Space Mono', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{bin.fill_level}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trucks panel */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16, zIndex: 1000,
        background: 'rgba(7,11,16,0.92)', border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)', width: 240,
      }}>
        <div className="panel-hdr"><span style={{ color: 'var(--green)' }}>🚛</span> ACTIVE TRUCKS</div>
        {(trucks ?? []).filter(t => t.status === 'active').map(truck => (
          <div key={truck.id} style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--cyan)', marginRight: 6 }}>{truck.id}</span>
              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{truck.route_name}</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'Space Mono' }}>{truck.bins_collected}/{truck.total_bins}</span>
          </div>
        ))}
      </div>

      {/* Selected bin detail */}
      {selected && (
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
          background: 'rgba(7,11,16,0.94)', border: '1px solid var(--border2)',
          backdropFilter: 'blur(10px)', padding: 16, width: 240,
        }} className="anim-fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'Space Mono', fontWeight: 700, color: 'var(--cyan)', fontSize: 15 }}>{selected.id}</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }} onClick={() => setSelected(null)}>✕</button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 10 }}>{selected.location}</div>
          <FillBar pct={selected.fill_level} height={6} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text3)' }}>
            <span>Fill: {selected.fill_level}%</span>
            <span>{selected.zone}</span>
          </div>
          {selected.fill_level >= 80 && (
            <div style={{ marginTop: 10, padding: 8, background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.28)', fontSize: 10, color: 'var(--red)' }}>
              ⚠ This bin needs urgent collection
            </div>
          )}
        </div>
      )}
    </div>
  )
}
