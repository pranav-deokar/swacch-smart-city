'use client'
// src/components/citizen/CitizenAwareness.tsx
import type { Language } from '@/app/citizen/page'

const TIPS = [
  { icon: '🚯', title: "Don't Litter", desc: 'Littering is punishable with a fine of ₹500–₹5,000 under the Pune Municipal Act. Use designated bins at all times.', color: 'var(--red)' },
  { icon: '♻️', title: 'Segregate Waste', desc: 'Separate wet waste (green bin), dry waste (blue bin), and hazardous waste (red bin) at source every day.', color: 'var(--green)' },
  { icon: '🛍️', title: 'No Plastic Bags', desc: 'Single-use plastic bags are banned citywide. Use cloth or jute bags. Violators face a ₹5,000 fine.', color: 'var(--amber)' },
  { icon: '🌿', title: 'Composting', desc: 'Composting kitchen waste reduces landfill load by 30% and creates natural fertilizer for your garden.', color: 'var(--cyan)' },
  { icon: '💧', title: 'Water Waste', desc: 'Dumping liquid waste into storm drains is illegal and contributes to flooding. Use authorised disposal.', color: 'var(--cyan)' },
  { icon: '📱', title: 'Report Violations', desc: 'Use the SWACHH-AI Citizen Portal to report illegal dumping, open burning, and overflowing bins instantly.', color: 'var(--green)' },
]

export default function CitizenAwareness({ lang }: { lang: Language }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, marginBottom: 32 }}>
        {TIPS.map((tip) => (
          <div key={tip.title} style={{ padding: '24px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderTop: `3px solid ${tip.color}`, transition: 'all 0.2s' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{tip.icon}</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 2, color: tip.color, marginBottom: 8, textTransform: 'uppercase' }}>{tip.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{tip.desc}</div>
          </div>
        ))}
      </div>

      {/* DOs and DON'Ts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 20, borderTop: '3px solid var(--green)' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16, letterSpacing: 2, color: 'var(--green)', marginBottom: 16 }}>✅ DO THIS</div>
          {[
            'Segregate wet and dry waste daily',
            'Keep bins covered when not in use',
            'Report overflowing bins via the app',
            'Use authorized disposal sites for bulk waste',
            'Compost kitchen waste at home',
            'Carry reusable bags when shopping',
          ].map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 13, color: 'var(--text2)' }}>
              <span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span> {item}
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 20, borderTop: '3px solid var(--red)' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16, letterSpacing: 2, color: 'var(--red)', marginBottom: 16 }}>❌ AVOID THIS</div>
          {[
            'Burning waste in open spaces',
            'Dumping garbage near nalah or open plots',
            'Using single-use plastic bags',
            'Throwing waste from moving vehicles',
            'Leaving waste outside bins at night',
            'Mixing medical/hazardous waste with regular waste',
          ].map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 13, color: 'var(--text2)' }}>
              <span style={{ color: 'var(--red)', flexShrink: 0 }}>▸</span> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
