'use client'
// src/app/admin/violations/page.tsx
import { useState } from 'react'
import Image from 'next/image'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useViolations } from '@/hooks/useData'
import { apiPatch } from '@/hooks/useData'
import { StatusBadge, FillBar, Spinner } from '@/components/ui'
import type { Violation, ViolationStatus } from '@/types'

export default function AdminViolationsPage() {
  const { data: violations, loading, refetch } = useViolations()
  const [selected, setSelected] = useState<Violation | null>(null)

  const handleStatus = async (id: string, status: ViolationStatus) => {
    await apiPatch('/api/violations', { id, status })
    refetch()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="AI Violation Detection" />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* List */}
          <div style={{ width: 320, borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--bg2)', flexShrink: 0 }}>
            <div className="panel-hdr">
              <span style={{ color: 'var(--red)' }}>⚠</span> AI DETECTIONS
              <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: 'Space Mono', color: 'var(--text3)' }}>
                {violations?.filter(v => v.status === 'pending').length ?? 0} PENDING
              </span>
            </div>

            {loading ? <Spinner /> : (violations ?? []).map((v) => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selected?.id === v.id ? 'rgba(255,61,90,0.06)' : 'transparent',
                  borderLeft: `2px solid ${selected?.id === v.id ? 'var(--red)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--red)' }}>{v.id}</span>
                  <StatusBadge status={v.status} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{v.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>{v.location} • {v.detected_at}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FillBar pct={v.confidence} />
                  <span style={{ fontSize: 10, fontFamily: 'Space Mono', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{v.confidence}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: 28 }} className="anim-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 20, color: 'var(--red)', marginBottom: 4 }}>
                    {selected.id} — {selected.type.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{selected.location} • {selected.detected_at}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selected.status === 'pending' && (
                    <button className="btn-cmd" onClick={() => handleStatus(selected.id, 'reviewed')}>MARK REVIEWED</button>
                  )}
                  {selected.status === 'reviewed' && (
                    <button className="btn-success" onClick={() => handleStatus(selected.id, 'actioned')}>MARK ACTIONED</button>
                  )}
                  <button className="btn-danger" onClick={() => handleStatus(selected.id, 'actioned')}>DISMISS</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24 }}>
                <div>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img
                      src={selected.image_url}
                      alt="violation"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: '8px 14px', background: 'rgba(255,61,90,0.07)', border: '1px solid rgba(255,61,90,0.2)', borderTop: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: 'var(--red)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5 }}>AI CONFIDENCE SCORE</span>
                    <span style={{ fontFamily: 'Space Mono', fontSize: 14, color: 'var(--red)', fontWeight: 700 }}>{selected.confidence}%</span>
                  </div>

                  <div style={{ marginTop: 20, background: 'var(--bg2)', border: '1px solid var(--border)', padding: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>DETECTION METADATA</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'MODEL', value: 'SWACHH-CV v3.1' },
                        { label: 'CAMERA ID', value: 'CAM-' + selected.id.slice(-3) },
                        { label: 'FRAME', value: '#' + Math.floor(Math.random() * 9000 + 1000) },
                        { label: 'RESOLUTION', value: '1920×1080' },
                      ].map(m => (
                        <div key={m.label} style={{ padding: '8px 10px', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>{m.label}</div>
                          <div style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--cyan)' }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {[
                    ['VIOLATION TYPE', selected.type],
                    ['LOCATION', selected.location],
                    ['DETECTED AT', selected.detected_at],
                    ['STATUS', <StatusBadge key="s" status={selected.status} />],
                    ['ASSIGNED TO', selected.assigned_officer],
                  ].map(([k, v]) => (
                    <div key={String(k)} style={{ padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>{k}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{v}</div>
                    </div>
                  ))}

                  <div style={{ marginTop: 20 }}>
                    <button className="btn-cmd" style={{ width: '100%', display: 'block', marginBottom: 8 }}>
                      SEND NOTICE →
                    </button>
                    <button className="btn-danger" style={{ width: '100%' }}>
                      ESCALATE TO PMC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 48, opacity: 0.2 }}>⚠️</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--text3)' }}>SELECT A VIOLATION TO REVIEW</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
