'use client'
// src/components/ui/index.tsx — shared atomic UI components

import { type ReactNode } from 'react'
import type { BinStatus, ComplaintStatus, TruckStatus, ViolationStatus } from '@/types'

// ── Fill Bar ─────────────────────────────────────────────────
export function FillBar({ pct, height = 4 }: { pct: number; height?: number }) {
  const color = pct >= 80 ? 'var(--red)' : pct >= 60 ? 'var(--amber)' : 'var(--green)'
  return (
    <div className="fill-bar-track" style={{ height }}>
      <div className="fill-bar-inner" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ── Status Badge ─────────────────────────────────────────────
type BadgeStatus = BinStatus | ComplaintStatus | TruckStatus | ViolationStatus | 'high' | 'medium' | 'low'
const BADGE_CFG: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: 'rgba(255,61,90,0.15)', color: 'var(--red)', label: 'CRITICAL' },
  warning:  { bg: 'rgba(255,183,0,0.15)', color: 'var(--amber)', label: 'WARNING' },
  normal:   { bg: 'rgba(0,230,118,0.12)', color: 'var(--green)', label: 'NORMAL' },
  open:     { bg: 'rgba(255,61,90,0.15)', color: 'var(--red)', label: 'OPEN' },
  'in-review': { bg: 'rgba(255,183,0,0.15)', color: 'var(--amber)', label: 'IN REVIEW' },
  resolved: { bg: 'rgba(0,230,118,0.12)', color: 'var(--green)', label: 'RESOLVED' },
  pending:  { bg: 'rgba(255,61,90,0.15)', color: 'var(--red)', label: 'PENDING' },
  reviewed: { bg: 'rgba(255,183,0,0.15)', color: 'var(--amber)', label: 'REVIEWED' },
  actioned: { bg: 'rgba(0,230,118,0.12)', color: 'var(--green)', label: 'ACTIONED' },
  active:   { bg: 'rgba(0,230,118,0.12)', color: 'var(--green)', label: 'ACTIVE' },
  idle:     { bg: 'rgba(0,180,255,0.15)', color: 'var(--cyan)', label: 'IDLE' },
  maintenance: { bg: 'rgba(255,183,0,0.15)', color: 'var(--amber)', label: 'MAINT.' },
  high:     { bg: 'rgba(255,61,90,0.15)', color: 'var(--red)', label: 'HIGH' },
  medium:   { bg: 'rgba(255,183,0,0.15)', color: 'var(--amber)', label: 'MEDIUM' },
  low:      { bg: 'rgba(100,150,200,0.15)', color: 'var(--text2)', label: 'LOW' },
}
export function StatusBadge({ status }: { status: BadgeStatus }) {
  const c = BADGE_CFG[status] ?? BADGE_CFG.normal
  return (
    <span className="badge" style={{ background: c.bg, color: c.color }}>{c.label}</span>
  )
}

// ── Metric Card ──────────────────────────────────────────────
export function Metric({ label, value, unit = '', accent = 'cyan' }: { label: string; value: string | number; unit?: string; accent?: 'cyan' | 'red' | 'amber' | 'green' }) {
  const color = { cyan: 'var(--cyan)', red: 'var(--red)', amber: 'var(--amber)', green: 'var(--green)' }[accent]
  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 18px' }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontFamily: 'Space Mono, monospace', fontWeight: 700, color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 13, marginLeft: 5, color: 'var(--text2)' }}>{unit}</span>
      </div>
    </div>
  )
}

// ── Panel Header ─────────────────────────────────────────────
export function PanelHeader({ icon, title, right }: { icon?: ReactNode; title: string; right?: ReactNode }) {
  return (
    <div className="panel-hdr">
      {icon && <span>{icon}</span>}
      <span>{title}</span>
      {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
    </div>
  )
}

// ── Spinner ──────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 120 }}>
      <div style={{ width: 36, height: 36, border: '2px solid var(--border2)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────
export function Empty({ text = 'No data available' }: { text?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, color: 'var(--text3)', fontFamily: 'Space Mono', fontSize: 12 }}>
      {text}
    </div>
  )
}

// ── Demo Mode Banner ─────────────────────────────────────────
export function DemoModeBanner() {
  return (
    <div style={{ background: 'rgba(255,183,0,0.08)', border: '1px solid rgba(255,183,0,0.3)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--amber)', fontFamily: 'Space Mono' }}>
      <span>⚡</span>
      <span>DEMO MODE — Using simulated data. Set Supabase env vars to enable live data.</span>
    </div>
  )
}

// ── Top bar stat chip ─────────────────────────────────────────
export function StatChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 12px', borderLeft: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 17, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}
