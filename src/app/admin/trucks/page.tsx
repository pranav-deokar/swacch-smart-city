'use client'
// src/app/admin/trucks/page.tsx
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useTrucks } from '@/hooks/useData'
import { FillBar, StatusBadge, Spinner } from '@/components/ui'

export default function AdminTrucksPage() {
  const { data: trucks, loading } = useTrucks()

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="Fleet Management" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {loading ? <Spinner /> : (
            <>
              {/* Summary strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 24 }}>
                {[
                  { label: 'TOTAL FLEET', value: trucks?.length ?? 0, color: 'var(--cyan)' },
                  { label: 'ACTIVE', value: trucks?.filter(t => t.status === 'active').length ?? 0, color: 'var(--green)' },
                  { label: 'IDLE', value: trucks?.filter(t => t.status === 'idle').length ?? 0, color: 'var(--cyan)' },
                  { label: 'MAINTENANCE', value: trucks?.filter(t => t.status === 'maintenance').length ?? 0, color: 'var(--amber)' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '16px 20px' }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 28, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 1 }}>
                {(trucks ?? []).map((truck, i) => {
                  const borderColor = truck.status === 'active' ? 'var(--green)' : truck.status === 'idle' ? 'var(--cyan)' : 'var(--amber)'
                  const progress = Math.round((truck.bins_collected / truck.total_bins) * 100)
                  return (
                    <div
                      key={truck.id}
                      className="anim-fade-up"
                      style={{
                        background: 'var(--bg2)', border: '1px solid var(--border)',
                        borderLeft: `3px solid ${borderColor}`, padding: 20,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 20, color: 'var(--cyan)' }}>{truck.id}</div>
                        <StatusBadge status={truck.status} />
                      </div>

                      <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{truck.driver_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 18, fontFamily: 'Space Mono' }}>ROUTE: {truck.route_name}</div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 18 }}>
                        {[
                          { label: 'COLLECTED', value: `${truck.bins_collected}/${truck.total_bins}`, color: 'var(--cyan)' },
                          { label: 'FUEL', value: `${truck.fuel_level}%`, color: truck.fuel_level < 25 ? 'var(--red)' : 'var(--green)' },
                          { label: 'PROGRESS', value: `${progress}%`, color: borderColor },
                        ].map(s => (
                          <div key={s.label}>
                            <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontFamily: 'Space Mono', fontSize: 16, color: s.color }}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>
                          <span>ROUTE PROGRESS</span><span>{progress}%</span>
                        </div>
                        <FillBar pct={progress} height={6} />
                      </div>

                      {truck.fuel_level < 25 && (
                        <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.3)', fontSize: 10, color: 'var(--red)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1 }}>
                          ⚠ LOW FUEL — REFUEL REQUIRED
                        </div>
                      )}

                      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                        <button className="btn-cmd" style={{ flex: 1, justifyContent: 'center' }}>TRACK LIVE</button>
                        {truck.status !== 'active' && <button className="btn-success" style={{ flex: 1 }}>ACTIVATE</button>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
