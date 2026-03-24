'use client'
// src/components/citizen/CitizenComplaints.tsx
import { useState } from 'react'
import { useComplaints, useOfficers, apiPost, apiPatch } from '@/hooks/useData'
import { StatusBadge, Spinner } from '@/components/ui'
import type { Language } from '@/app/citizen/page'

interface FormState {
  citizen_name: string
  issue: string
  location: string
  officer_id: string
  priority: 'high' | 'medium' | 'low'
}

const INITIAL_FORM: FormState = {
  citizen_name: '',
  issue: '',
  location: '',
  officer_id: '',
  priority: 'medium',
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

export default function CitizenComplaints({ lang }: { lang: Language }) {
  const { data: complaints, loading: complaintsLoading, refetch } = useComplaints()
  const { data: officers, loading: officersLoading } = useOfficers()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

  const handleSubmit = async () => {
    if (!form.issue.trim() || !form.location.trim() || !form.citizen_name.trim()) return
    setSubmitting(true)
    const selectedOfficer = officers?.find(o => o.id === form.officer_id)
    const payload = {
      ...form,
      assigned_officer: selectedOfficer?.name ?? 'PMC Auto-Assign',
      created_at: new Date().toISOString(),
    }
    const result = await apiPost('/api/complaints', payload)
    setTicketId(result?.id ?? `C${Date.now()}`)
    setSubmitting(false)
    setSubmitted(true)
    refetch()
  }

  const handleUpvote = async (id: string) => {
    if (votedIds.has(id)) return
    await apiPatch('/api/complaints', { id, action: 'upvote' })
    setVotedIds(prev => new Set([...prev, id]))
    refetch()
  }

  const priorityColor = (p: string) => p === 'high' ? 'var(--red)' : p === 'medium' ? 'var(--amber)' : 'var(--text3)'

  if (submitted) {
    return (
      <div style={{ padding: 20, maxWidth: 560, margin: '0 auto' }}>
        <div className="anim-fade-up" style={{ background: 'var(--bg2)', border: '1px solid rgba(0,230,118,0.3)', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 26, letterSpacing: 2, color: 'var(--green)', marginBottom: 8 }}>COMPLAINT SUBMITTED</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.7 }}>
            Your complaint has been registered and assigned to the relevant municipal officer.
            You will receive status updates as the complaint progresses.
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 15, color: 'var(--cyan)', marginBottom: 28, padding: '10px 20px', background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.3)', display: 'inline-block' }}>
            TICKET: {ticketId}
          </div>
          <br />
          <button className="btn-cmd" onClick={() => { setSubmitted(false); setForm(INITIAL_FORM) }}>
            FILE ANOTHER COMPLAINT →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, height: '100%' }}>
      {/* Form */}
      <div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 22, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: 2, color: 'var(--cyan)', marginBottom: 20, textTransform: 'uppercase' }}>
            File a Complaint
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Your Name *</label>
              <input className="inp" placeholder="Full name" value={form.citizen_name} onChange={e => setForm(p => ({ ...p, citizen_name: e.target.value }))} />
            </div>

            <div>
              <label style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Complaint / Issue *</label>
              <textarea
                className="inp"
                placeholder="Describe the issue in detail — what, where, since when, and any evidence..."
                value={form.issue}
                onChange={e => setForm(p => ({ ...p, issue: e.target.value }))}
                style={{ resize: 'none', height: 100 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Location *</label>
              <input className="inp" placeholder="e.g. Baner Road, near Pump House" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>

            <div>
              <label style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Priority Level</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['high', 'medium', 'low'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    style={{
                      flex: 1, padding: '7px 0',
                      background: form.priority === p ? `${priorityColor(p)}18` : 'transparent',
                      border: `1px solid ${form.priority === p ? priorityColor(p) : 'var(--border)'}`,
                      color: form.priority === p ? priorityColor(p) : 'var(--text3)',
                      fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5,
                      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
                Assign to Municipal Officer
              </label>
              {officersLoading ? (
                <div style={{ fontSize: 11, color: 'var(--text3)', padding: '8px 0' }}>Loading officers...</div>
              ) : (
                <select className="inp" value={form.officer_id} onChange={e => setForm(p => ({ ...p, officer_id: e.target.value }))}>
                  <option value="">Auto-assign (recommended)</option>
                  {(officers ?? []).map(o => (
                    <option key={o.id} value={o.id}>{o.name} — {o.zone}</option>
                  ))}
                </select>
              )}
            </div>

            <button
              className="btn-cmd"
              style={{ padding: 14, fontSize: 13, width: '100%', marginTop: 4 }}
              onClick={handleSubmit}
              disabled={submitting || !form.issue.trim() || !form.location.trim() || !form.citizen_name.trim()}
            >
              {submitting ? '⟳ SUBMITTING...' : 'SUBMIT COMPLAINT →'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent complaints list */}
      <div>
        <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          RECENT COMPLAINTS — UPVOTE TO PRIORITIZE
        </div>
        {complaintsLoading ? <Spinner /> : (complaints ?? []).slice(0, 8).map((c) => (
          <div
            key={c.id}
            style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              padding: '12px 14px', marginBottom: 1,
              borderLeft: `2px solid ${priorityColor(c.priority)}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--cyan)' }}>{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <button
                onClick={() => handleUpvote(c.id)}
                style={{
                  background: votedIds.has(c.id) ? 'rgba(0,180,255,0.12)' : 'none',
                  border: '1px solid var(--border)',
                  color: votedIds.has(c.id) ? 'var(--cyan)' : 'var(--text3)',
                  padding: '2px 8px', cursor: 'pointer', fontSize: 11,
                  fontFamily: 'Space Mono', transition: 'all 0.2s',
                }}
              >
                👍 {c.votes + (votedIds.has(c.id) ? 1 : 0)}
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 3, fontWeight: 500 }}>{c.citizen_name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5, lineHeight: 1.4 }}>
              {c.issue.length > 80 ? c.issue.slice(0, 80) + '...' : c.issue}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)' }}>
              <span>📍 {c.location}</span>
              <span style={{ fontFamily: 'Space Mono' }}>{formatTime(c.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
