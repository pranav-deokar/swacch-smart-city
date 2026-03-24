'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isDemoMode } from '@/lib/supabase'
import { DemoModeBanner } from '@/components/ui'

const FEATURES = [
  { icon: '🗑️', title: 'Smart Bin Network', desc: 'IoT-enabled bins transmit real-time fill levels, location, and contamination data across the city grid.' },
  { icon: '🤖', title: 'AI Violation Detection', desc: 'Computer vision models identify plastic bag misuse, open burning, and illegal dumping in real-time.' },
  { icon: '🚛', title: 'Intelligent Routing', desc: 'ML-optimized truck routes prioritize critical bins, cutting fuel use by 34% and collection time by 42%.' },
  { icon: '📊', title: 'Command Analytics', desc: 'Operational dashboards surface trends, predict overflow events, and drive data-backed policy decisions.' },
  { icon: '🗺️', title: 'Live City Map', desc: 'Every bin, truck, violation, and complaint on a single real-time Leaflet-powered control surface.' },
  { icon: '👥', title: 'Citizen Engagement', desc: 'Community reporting, complaint tracking, and public awareness in English, Hindi, and Marathi.' },
]

const STATS = [
  { value: '847', label: 'Smart Bins' },
  { value: '23', label: 'GPS Trucks' },
  { value: '94.2%', label: 'Uptime' },
  { value: '2,840kg', label: 'Daily Collected' },
]

export default function LandingPage() {
  const router = useRouter()
  const [tick, setTick] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 60)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: 'var(--bg)' }}>
      <div className="scan-line" />

      {/* HEADER */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(7,11,16,0.95)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="clip-hex" style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--cyan), #004488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>♻</div>
          <div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: 3, color: 'var(--cyan)', lineHeight: 1 }}>SWACHH-AI</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 2 }}>SMART WASTE ECOSYSTEM</div>
          </div>
        </div>
        {isDemoMode && (
          <div style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'Space Mono', border: '1px solid rgba(255,183,0,0.3)', padding: '4px 10px', background: 'rgba(255,183,0,0.06)' }}>
            ⚡ DEMO MODE
          </div>
        )}
        <nav style={{ display: 'flex', gap: 8 }}>
          {([['🏛️ ADMIN', '/admin'], ['🚛 DRIVER', '/driver'], ['👤 CITIZEN', '/citizen']] as [string, string][]).map(([label, path]) => (
            <button key={path} className="btn-cmd" style={{ fontSize: 11 }} onClick={() => router.push(path)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', padding: '60px 40px', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 28% 50%, rgba(0,100,200,0.12) 0%, transparent 55%), radial-gradient(ellipse at 72% 80%, rgba(0,60,130,0.07) 0%, transparent 50%)' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <svg width="100%" height="100%" opacity="0.035">
            {Array.from({ length: 24 }, (_, i) => <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="100%" stroke="var(--cyan)" strokeWidth="1" />)}
            {Array.from({ length: 18 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 60} x2="100%" y2={i * 60} stroke="var(--cyan)" strokeWidth="1" />)}
          </svg>
        </div>
        {/* Floating SVG map overlay */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '52%', opacity: 0.18, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="180" fill="none" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="8 6" />
            <circle cx="250" cy="250" r="120" fill="none" stroke="var(--cyan)" strokeWidth="0.5" strokeDasharray="4 8" />
            {[[200, 200], [300, 180], [160, 280], [330, 300], [250, 350], [270, 230]].map(([x, y], i) => (
              <g key={i}>
                <rect x={x - 8} y={y - 11} width={16} height={20} rx={2} fill="rgba(0,180,255,0.2)" stroke="var(--cyan)" strokeWidth="1.5" />
                <line x1={x} y1={y + 9} x2={250} y2={250} stroke="rgba(0,180,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              </g>
            ))}
            <circle cx="250" cy="250" r="6" fill="var(--cyan)" opacity="0.8" />
          </svg>
        </div>

        <div style={{ maxWidth: 680, position: 'relative', zIndex: 1, animation: 'fade-up 0.8s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 11, fontFamily: 'Space Mono, monospace', color: 'var(--green)', letterSpacing: 2 }}>
              SYSTEM ONLINE — PUNE METROPOLITAN REGION
            </span>
          </div>

          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(46px, 6vw, 82px)', lineHeight: 1, color: 'var(--text)', marginBottom: 16, letterSpacing: 2 }}>
            SMART CITY<br />
            <span style={{ color: 'var(--cyan)', textShadow: '0 0 40px rgba(0,180,255,0.45)' }}>WASTE COMMAND</span>
          </h1>

          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
            A unified AI + IoT platform integrating 847 smart bins, 23 GPS-tracked vehicles,
            real-time violation detection, and citizen engagement — on one intelligent control surface.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <button className="btn-cmd" style={{ fontSize: 13, padding: '13px 30px' }} onClick={() => router.push('/admin')}>
              COMMAND CENTER →
            </button>
            <button className="btn-cmd" style={{ background: 'transparent', color: 'var(--text2)', borderColor: 'var(--border2)', fontSize: 13, padding: '13px 24px' }} onClick={() => router.push('/citizen')}>
              CITIZEN PORTAL
            </button>
          </div>

          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 22, color: 'var(--cyan)' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: 'var(--text3)', letterSpacing: 3, marginBottom: 8 }}>PLATFORM CAPABILITIES</div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 40, color: 'var(--text)', letterSpacing: 2 }}>SYSTEM MODULES</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '28px 24px',
                background: hovered === i ? 'rgba(0,180,255,0.06)' : 'var(--bg2)',
                border: '1px solid var(--border)',
                borderColor: hovered === i ? 'var(--border2)' : 'var(--border)',
                transition: 'all 0.22s',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 2, color: hovered === i ? 'var(--cyan)' : 'var(--text)', marginBottom: 8, textTransform: 'uppercase' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: '64px 40px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: 'var(--text3)', letterSpacing: 3, marginBottom: 6 }}>BUILT WITH</div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, color: 'var(--text)', letterSpacing: 2 }}>TECHNOLOGY STACK</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[
            ['Next.js 14', 'App Router + RSC'],
            ['Supabase', 'Postgres + Auth + Realtime'],
            ['TypeScript', 'End-to-end typed'],
            ['Tailwind CSS', 'Utility-first styling'],
            ['Leaflet', 'Interactive city map'],
            ['Framer Motion', 'Animations'],
          ].map(([tech, desc]) => (
            <div key={tech} style={{ padding: '14px 20px', border: '1px solid var(--border)', background: 'var(--bg3)', minWidth: 180 }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--cyan)', marginBottom: 3 }}>{tech}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 32, color: 'var(--text)', letterSpacing: 2, marginBottom: 6 }}>ENTER THE CONTROL CENTER</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Select your role to access the system.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {([['🏛️ ADMIN', '/admin'], ['🚛 DRIVER', '/driver'], ['👤 CITIZEN', '/citizen']] as [string, string][]).map(([label, path]) => (
            <button key={path} className="btn-cmd" style={{ padding: '13px 22px', fontSize: 12 }} onClick={() => router.push(path)}>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '20px 40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)' }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono, monospace' }}>© 2025 SWACHH-AI | PUNE MUNICIPAL CORPORATION | v2.4.1</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {isDemoMode && <div style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'Space Mono' }}>⚡ DEMO MODE ACTIVE</div>}
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono' }}>Next.js + Supabase</div>
        </div>
      </footer>
    </div>
  )
}
