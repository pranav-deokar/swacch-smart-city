'use client'
// src/components/citizen/CitizenAlerts.tsx
import { useAlerts } from '@/hooks/useData'
import { Spinner } from '@/components/ui'
import type { Language } from '@/app/citizen/page'

const ALERT_CONFIG = {
  warning: { icon: '⚠️', color: 'var(--amber)', label: 'WARNING' },
  info:    { icon: 'ℹ️', color: 'var(--cyan)',  label: 'INFO' },
  success: { icon: '✅', color: 'var(--green)', label: 'RESOLVED' },
  danger:  { icon: '🚨', color: 'var(--red)',   label: 'URGENT' },
}

function formatTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  } catch { return 'recently' }
}

export default function CitizenAlerts({ lang }: { lang: Language }) {
  const { data: alerts, loading } = useAlerts()

  return (
    <div style={{ padding: 20, maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div className="live-dot" />
        <span style={{ fontSize: 11, fontFamily: 'Space Mono, monospace', color: 'var(--green)', letterSpacing: 2 }}>
          LIVE MUNICIPAL ALERTS
        </span>
      </div>

      {loading ? <Spinner /> : (alerts ?? []).map((alert, i) => {
        const cfg = ALERT_CONFIG[alert.alert_type] ?? ALERT_CONFIG.info
        return (
          <div
            key={alert.id}
            className="anim-fade-up"
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${cfg.color}`,
              padding: '16px 18px',
              marginBottom: 1,
              animationDelay: `${i * 0.09}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{cfg.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 1.5, color: cfg.color, textTransform: 'uppercase' }}>
                      {alert.title}
                    </div>
                    <span style={{ fontSize: 9, padding: '1px 7px', background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30`, fontFamily: 'Space Mono' }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{alert.description}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {formatTime(alert.created_at)}
              </div>
            </div>
          </div>
        )
      })}

      {!loading && (!alerts || alerts.length === 0) && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)', fontFamily: 'Space Mono', fontSize: 12 }}>
          No active alerts at this time
        </div>
      )}
    </div>
  )
}
