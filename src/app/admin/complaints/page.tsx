'use client'
// src/app/admin/complaints/page.tsx
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useComplaints } from '@/hooks/useData'
import { apiPatch } from '@/hooks/useData'
import { StatusBadge, Spinner } from '@/components/ui'
import type { Complaint, ComplaintStatus } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const FILTERS: { label: string; value: ComplaintStatus | 'all' }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'OPEN', value: 'open' },
  { label: 'IN REVIEW', value: 'in-review' },
  { label: 'RESOLVED', value: 'resolved' },
]

export default function AdminComplaintsPage() {
  const { data: complaints, loading, refetch } = useComplaints()
  const [filter, setFilter] = useState<ComplaintStatus | 'all'>('all')
  const [selected, setSelected] = useState<Complaint | null>(null)

  const filtered = (complaints ?? []).filter(c => filter === 'all' || c.status === filter)

  const handleStatus = async (id: string, status: ComplaintStatus) => {
    await apiPatch('/api/complaints', { id, status })
    refetch()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const priorityColor = (p: string) => p === 'high' ? 'var(--red)' : p === 'medium' ? 'var(--amber)' : 'var(--text3)'

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <div className="scan-line" />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar title="Complaint Management" />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* List */}
          <div style={{ width: 400, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 4, flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)' }}>
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  style={{
                    padding: '4px 12px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10,
                    letterSpacing: 1.5, cursor: 'pointer', border: '1px solid var(--border)',
                    background: filter === f.value ? 'rgba(0,180,255,0.12)' : 'transparent',
                    color: filter === f.value ? 'var(--cyan)' : 'var(--text2)', transition: 'all 0.2s',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? <Spinner /> : filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  style={{
                    padding: '14px 16px', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${selected?.id === c.id ? 'var(--cyan)' : priorityColor(c.priority)}`,
                    background: selected?.id === c.id ? 'rgba(0,180,255,0.05)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--cyan)' }}>{c.id}</span>
                      <StatusBadge status={c.priority} />
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, marginBottom: 3 }}>{c.citizen_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.issue}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)' }}>
                    <span>📍 {c.location}</span>
                    <span style={{ fontFamily: 'Space Mono' }}>👍 {c.votes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          {selected ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: 28 }} className="anim-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 18, color: 'var(--cyan)' }}>{selected.id}</span>
                    <StatusBadge status={selected.status} />
                    <StatusBadge status={selected.priority} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>Filed by {selected.citizen_name} • {selected.location}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selected.status === 'open' && (
                    <button className="btn-cmd" onClick={() => handleStatus(selected.id, 'in-review')}>START REVIEW</button>
                  )}
                  {selected.status === 'in-review' && (
                    <button className="btn-success" onClick={() => handleStatus(selected.id, 'resolved')}>MARK RESOLVED</button>
                  )}
                </div>
              </div>

              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '18px 20px', marginBottom: 20, borderLeft: `3px solid ${priorityColor(selected.priority)}` }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>COMPLAINT DETAILS</div>
                <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{selected.issue}</p>
              </div>

              {selected.image_url && (
                <div style={{ marginBottom: 20 }}>
                  <img src={selected.image_url} alt="complaint" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', border: '1px solid var(--border)', display: 'block' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 20 }}>
                {[
                  ['CITIZEN', selected.citizen_name],
                  ['LOCATION', selected.location],
                  ['ASSIGNED OFFICER', selected.assigned_officer],
                  ['COMMUNITY VOTES', `👍 ${selected.votes}`],
                ].map(([k, v]) => (
                  <div key={String(k)} style={{ padding: '14px 16px', background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>{k}</div>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Action timeline */}
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 16 }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>ACTION TIMELINE</div>
                {[
                  { status: 'Complaint Filed', time: 'Citizen', done: true },
                  { status: 'Officer Assigned', time: selected.assigned_officer, done: true },
                  { status: 'Under Review', time: 'PMC Operations', done: selected.status !== 'open' },
                  { status: 'Action Taken', time: 'Field Team', done: selected.status === 'resolved' },
                  { status: 'Resolved & Closed', time: 'System', done: selected.status === 'resolved' },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: step.done ? 'var(--green)' : 'var(--bg3)', border: `1px solid ${step.done ? 'var(--green)' : 'var(--border2)'}`, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 12, color: step.done ? 'var(--text)' : 'var(--text3)' }}>{step.status}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 48, opacity: 0.2 }}>📋</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: 12, color: 'var(--text3)' }}>SELECT A COMPLAINT TO MANAGE</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
