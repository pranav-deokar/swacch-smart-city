'use client'
// src/app/admin/routing/page.tsx
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBins, useTrucks } from '@/hooks/useData'
import { StatusBadge, Spinner } from '@/components/ui'

export default function AdminRoutingPage() {
  const { data: bins } = useBins()
  const { data: trucks } = useTrucks()
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [routes, setRoutes] = useState<any[]>([])

  const criticalBins = (bins ?? []).filter(b => b.fill_level >= 80)
  const warningBins = (bins ?? []).filter(b => b.fill_level >= 60 && b.fill_level < 80)
  const availableTrucks = (trucks ?? []).filter(t => t.status === 'active' || t.status === 'idle')

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1400))
    const res = await fetch('/api/routes')
    const data = await res.json()
    setRoutes(data)
    setGenerated(true)
    setGenerating(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="Smart Route Optimizer" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 20, letterSpacing: 2, color: 'var(--text)', marginBottom: 4 }}>
                AI-POWERED ROUTE GENERATION
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                Automatically assigns critical bins (&gt;80% fill) to nearest available trucks with fuel-optimized routing.
              </div>
            </div>
            <button
              className="btn-cmd"
              style={{ padding: '12px 28px', fontSize: 13 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? '⟳ COMPUTING...' : '⚡ GENERATE ROUTES'}
            </button>
          </div>

          {/* Status grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 20 }}>

            {/* Critical Bins */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="panel-hdr" style={{ borderLeft: '3px solid var(--red)' }}>
                <span style={{ color: 'var(--red)' }}>⚠</span>
                HIGH PRIORITY BINS ({criticalBins.length})
              </div>
              {criticalBins.length === 0 ? (
                <div style={{ padding: 20, fontSize: 12, color: 'var(--text3)', fontFamily: 'Space Mono' }}>No critical bins</div>
              ) : criticalBins.map(bin => (
                <div key={bin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--cyan)', marginRight: 8 }}>{bin.id}</span>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{bin.location}</span>
                  </div>
                  <span style={{ fontFamily: 'Space Mono', fontSize: 14, color: 'var(--red)', fontWeight: 700 }}>{bin.fill_level}%</span>
                </div>
              ))}

              {warningBins.length > 0 && (
                <>
                  <div className="panel-hdr" style={{ borderLeft: '3px solid var(--amber)', marginTop: 1 }}>
                    <span style={{ color: 'var(--amber)' }}>◈</span> WARNING BINS ({warningBins.length})
                  </div>
                  {warningBins.map(bin => (
                    <div key={bin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--cyan)', marginRight: 8 }}>{bin.id}</span>
                        <span style={{ fontSize: 12, color: 'var(--text)' }}>{bin.location}</span>
                      </div>
                      <span style={{ fontFamily: 'Space Mono', fontSize: 13, color: 'var(--amber)' }}>{bin.fill_level}%</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Trucks */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="panel-hdr" style={{ borderLeft: '3px solid var(--green)' }}>
                <span style={{ color: 'var(--green)' }}>🚛</span>
                AVAILABLE TRUCKS ({availableTrucks.length})
              </div>
              {availableTrucks.map(truck => (
                <div key={truck.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--cyan)', marginRight: 8 }}>{truck.id}</span>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{truck.driver_name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono' }}>{truck.fuel_level}% ⛽</span>
                    <StatusBadge status={truck.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated routes */}
          {generated && (
            <div className="anim-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div className="live-dot" />
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, letterSpacing: 2, color: 'var(--green)' }}>
                  OPTIMAL ROUTES GENERATED — READY TO DISPATCH
                </span>
              </div>

              {routes.map((route, i) => (
                <div key={route.truck_id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--green)', padding: 20, marginBottom: 1, animation: 'fade-up 0.4s ease both', animationDelay: `${i * 0.15}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <span style={{ fontFamily: 'Space Mono', fontWeight: 700, color: 'var(--cyan)', fontSize: 16 }}>{route.truck_id}</span>
                      <span style={{ fontSize: 14, color: 'var(--text)', marginLeft: 12 }}>{route.driver_name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      {[
                        ['DISTANCE', `${route.distance_km} km`],
                        ['ETA', `${Math.floor(route.eta_minutes / 60)}h ${route.eta_minutes % 60}m`],
                        ['FUEL SAVING', `${route.fuel_saving_pct}%`],
                      ].map(([l, v]) => (
                        <div key={String(l)} style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                          <div style={{ fontFamily: 'Space Mono', fontSize: 13, color: 'var(--green)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {(route.bins as string[]).map((bin: string, j: number) => (
                      <div key={bin} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {j > 0 && <span style={{ color: 'var(--text3)', fontSize: 14 }}>→</span>}
                        <div style={{ padding: '4px 12px', background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.35)', fontSize: 11, fontFamily: 'Space Mono', color: 'var(--red)' }}>
                          {bin}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn-cmd" style={{ padding: '9px 22px' }}>
                    DISPATCH ROUTE →
                  </button>
                </div>
              ))}
            </div>
          )}

          {generating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <Spinner />
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, color: 'var(--cyan)', letterSpacing: 2 }}>COMPUTING OPTIMAL ROUTES...</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Running Dijkstra + fuel optimization algorithm across {criticalBins.length} priority bins and {availableTrucks.length} trucks</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
