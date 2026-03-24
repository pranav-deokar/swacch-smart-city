'use client'
// src/app/admin/page.tsx  — Command Map
import dynamic from 'next/dynamic'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBins, useTrucks, apiPatch } from '@/hooks/useData'
import { FillBar, StatusBadge, Spinner } from '@/components/ui'
import type { Bin } from '@/types'

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false, loading: () => <Spinner /> })

export default function AdminMapPage() {
  const { data: bins, loading: binsLoading, refetch: refetchBins } = useBins()
  const { data: trucks } = useTrucks()
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)

  const handleDispatch = async (bin: Bin) => {
    // In production: creates a dispatch record
    alert(`Dispatch order created for bin ${bin.id} — Nearest available truck assigned.`)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="Command Map" />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Map */}
          <div style={{ flex: 1, position: 'relative' }}>
            {binsLoading || !bins ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
                <Spinner />
              </div>
            ) : (
              <LiveMap
                bins={bins}
                trucks={trucks ?? []}
                selectedBin={selectedBin}
                onBinClick={setSelectedBin}
                height="100%"
              />
            )}
          </div>

          {/* Right panel */}
          <div style={{ width: 288, borderLeft: '1px solid var(--border)', overflowY: 'auto', background: 'var(--bg2)', display: 'flex', flexDirection: 'column' }}>
            {selectedBin ? (
              <div className="anim-fade-up">
                <div className="panel-hdr">
                  <span style={{ color: 'var(--cyan)' }}>◆</span>
                  BIN DETAIL
                  <button
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                    onClick={() => setSelectedBin(null)}
                  >✕</button>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 22, color: 'var(--cyan)', marginBottom: 4 }}>{selectedBin.id}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>{selectedBin.location}</div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 10, color: 'var(--text3)' }}>
                      <span>FILL LEVEL</span>
                      <span style={{ fontFamily: 'Space Mono', color: selectedBin.fill_level >= 80 ? 'var(--red)' : 'var(--green)' }}>{selectedBin.fill_level}%</span>
                    </div>
                    <FillBar pct={selectedBin.fill_level} height={6} />
                  </div>

                  {[
                    ['STATUS', <StatusBadge key="s" status={selectedBin.status} />],
                    ['WASTE TYPE', selectedBin.waste_type.toUpperCase()],
                    ['ZONE', selectedBin.zone],
                    ['LAST COLLECTED', selectedBin.last_collected],
                    ['COORDINATES', `${selectedBin.lat.toFixed(4)}, ${selectedBin.lng.toFixed(4)}`],
                  ].map(([k, v]) => (
                    <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{k}</span>
                      <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'Space Mono' }}>{v}</span>
                    </div>
                  ))}

                  {selectedBin.fill_level >= 80 && (
                    <div style={{ marginTop: 14, padding: 12, background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.28)' }}>
                      <div style={{ fontSize: 10, color: 'var(--red)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>⚠ URGENT COLLECTION REQUIRED</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>Bin exceeds 80% threshold. Auto-assign to nearest route.</div>
                    </div>
                  )}

                  <button className="btn-cmd" style={{ width: '100%', marginTop: 16, padding: 11, justifyContent: 'center', display: 'block' }} onClick={() => handleDispatch(selectedBin)}>
                    DISPATCH TRUCK →
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="panel-hdr">
                  <span style={{ color: 'var(--cyan)' }}>◆</span> BIN STATUS FEED
                  <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono' }}>{bins?.length ?? 0} BINS</span>
                </div>
                {(bins ?? []).map((bin) => (
                  <div
                    key={bin.id}
                    className="data-strip"
                    style={{ padding: '10px 12px 10px 14px', borderLeft: `2px solid ${bin.status === 'critical' ? 'var(--red)' : bin.status === 'warning' ? 'var(--amber)' : 'var(--cyan)'}` }}
                    onClick={() => setSelectedBin(bin)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--cyan)' }}>{bin.id}</span>
                      <StatusBadge status={bin.status} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{bin.location}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FillBar pct={bin.fill_level} />
                      <span style={{ fontSize: 10, fontFamily: 'Space Mono', color: bin.fill_level >= 80 ? 'var(--red)' : 'var(--text3)', whiteSpace: 'nowrap' }}>{bin.fill_level}%</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
