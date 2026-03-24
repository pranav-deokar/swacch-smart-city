'use client'
// src/app/admin/analytics/page.tsx
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useAnalytics, useBins, useViolations } from '@/hooks/useData'
import { Spinner, FillBar } from '@/components/ui'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function AdminAnalyticsPage() {
  const { data: analytics, loading } = useAnalytics()
  const { data: bins } = useBins()

  if (loading || !analytics) return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>
    </div>
  )

  const maxTrend = Math.max(...analytics.weekly_trend)

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="Analytics" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 20 }}>
            {[
              { label: 'WASTE COLLECTED TODAY', value: analytics.today_collected_kg.toLocaleString(), unit: 'kg', color: 'var(--cyan)' },
              { label: 'COMPLIANCE RATE', value: analytics.compliance_rate, unit: '%', color: 'var(--green)' },
              { label: 'VIOLATIONS TODAY', value: analytics.violations_today, unit: '', color: 'var(--red)' },
              { label: 'BINS ABOVE THRESHOLD', value: analytics.bins_critical, unit: '', color: 'var(--amber)' },
            ].map(m => (
              <div key={m.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '18px 20px' }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{m.label}</div>
                <div style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 34, color: m.color, lineHeight: 1 }}>
                  {m.value}<span style={{ fontSize: 14, color: 'var(--text2)', marginLeft: 4 }}>{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, marginBottom: 20 }}>

            {/* Weekly Compliance Trend */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 24 }}>
                WEEKLY COMPLIANCE TREND (%)
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130 }}>
                {analytics.weekly_trend.map((val, i) => {
                  const isLast = i === analytics.weekly_trend.length - 1
                  const h = Math.round((val / maxTrend) * 100)
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 9, fontFamily: 'Space Mono', color: isLast ? 'var(--cyan)' : 'var(--text3)' }}>{val}%</span>
                      <div
                        style={{
                          width: '100%', height: `${h}%`,
                          background: isLast ? 'var(--cyan)' : 'rgba(0,180,255,0.18)',
                          border: `1px solid ${isLast ? 'var(--cyan)' : 'rgba(0,180,255,0.3)'}`,
                          transition: 'height 1s ease',
                          boxShadow: isLast ? 'var(--glow-cyan)' : 'none',
                        }}
                      />
                      <span style={{ fontSize: 9, color: isLast ? 'var(--cyan)' : 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1 }}>{DAYS[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Donut-style distribution */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 20 }}>
                BIN STATUS DISTRIBUTION
              </div>
              {[
                { label: 'CRITICAL', count: analytics.bins_by_status.critical, total: 12, color: 'var(--red)' },
                { label: 'WARNING', count: analytics.bins_by_status.warning, total: 12, color: 'var(--amber)' },
                { label: 'NORMAL', count: analytics.bins_by_status.normal, total: 12, color: 'var(--green)' },
              ].map(b => (
                <div key={b.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 10, color: b.color, fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5 }}>
                    <span>{b.label}</span>
                    <span>{b.count} / {b.total} bins</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(b.count / b.total) * 100}%`, background: b.color, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16 }}>
                  WASTE TYPE BREAKDOWN
                </div>
                {[
                  { label: 'DRY WASTE', pct: analytics.waste_by_type.dry, color: 'var(--cyan)' },
                  { label: 'WET WASTE', pct: analytics.waste_by_type.wet, color: 'var(--green)' },
                  { label: 'MIXED', pct: analytics.waste_by_type.mixed, color: 'var(--amber)' },
                ].map(b => (
                  <div key={b.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, color: 'var(--text2)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1 }}>
                      <span>{b.label}</span>
                      <span style={{ color: b.color, fontFamily: 'Space Mono' }}>{b.pct}%</span>
                    </div>
                    <FillBar pct={b.pct} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Per-bin analytics */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '20px 24px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16 }}>
              BIN FILL LEVEL OVERVIEW
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
              {(bins ?? []).map(bin => {
                const color = bin.fill_level >= 80 ? 'var(--red)' : bin.fill_level >= 60 ? 'var(--amber)' : 'var(--green)'
                return (
                  <div key={bin.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', height: `${bin.fill_level}%`, background: `${color}33`, border: `1px solid ${color}66`, position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${bin.fill_level}%`, background: color, opacity: 0.4 }} />
                    </div>
                    <span style={{ fontSize: 7, fontFamily: 'Space Mono', color: 'var(--text3)', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{bin.id}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
