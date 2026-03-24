'use client'
// src/components/citizen/CitizenSchemes.tsx
import type { Language } from '@/app/citizen/page'

const SCHEMES = [
  {
    icon: '🇮🇳', title: 'Swachh Bharat Mission',
    desc: 'National cleanliness mission targeting ODF status and solid waste management in urban and rural areas.',
    status: 'ACTIVE', ministry: 'Ministry of Housing & Urban Affairs',
    link: 'https://swachhbharatmission.gov.in',
    benefits: ['Free toilet construction', 'Waste-to-energy plants', 'Community awareness drives'],
  },
  {
    icon: '🏛️', title: 'PMC Solid Waste Management',
    desc: 'Pune Municipal Corporation\'s comprehensive door-to-door dry and wet waste collection program.',
    status: 'ACTIVE', ministry: 'Pune Municipal Corporation',
    link: '#',
    benefits: ['Daily doorstep collection', 'Segregation support', 'Bulk generator compliance'],
  },
  {
    icon: '♻️', title: 'Plastic-Free Pune Campaign',
    desc: 'City-wide drive to eliminate single-use plastics with 5,000+ registered volunteers and 200+ shops enrolled.',
    status: 'ACTIVE', ministry: 'PMC Environment Dept.',
    link: '#',
    benefits: ['Free cloth bags', 'Vendor registration', 'Penalty exemptions for early adopters'],
  },
  {
    icon: '🌱', title: 'Green City Initiative — Composting',
    desc: 'Subsidized composting kits and training for housing societies. Reduce wet waste by up to 60% at source.',
    status: 'ENROLLMENT OPEN', ministry: 'PMC Solid Waste Dept.',
    link: '#',
    benefits: ['50% subsidy on composting units', 'Free training workshops', 'Rebate on property tax'],
  },
  {
    icon: '💡', title: 'Waste-to-Energy Program',
    desc: 'Converting non-recyclable waste into electricity. 3 plants operational in Pune with 80MW combined capacity.',
    status: 'ACTIVE', ministry: 'Maharashtra Urban Development',
    link: '#',
    benefits: ['Reduced landfill dependence', 'Power for 40,000 homes', 'Carbon credits for PMC'],
  },
  {
    icon: '🎓', title: 'School Cleanliness Champions',
    desc: 'Training students to be cleanliness ambassadors in their neighborhoods. 340+ schools enrolled across Pune.',
    status: 'ENROLLMENT OPEN', ministry: 'PMC Education Dept.',
    link: '#',
    benefits: ['Certificate for students', 'School ranking incentives', 'Eco-lab grants'],
  },
]

export default function CitizenSchemes({ lang }: { lang: Language }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1 }}>
        {SCHEMES.map((scheme, i) => (
          <div
            key={scheme.title}
            className="anim-fade-up"
            style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              padding: 22, animationDelay: `${i * 0.08}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 36 }}>{scheme.icon}</div>
              <span style={{
                fontSize: 9, padding: '2px 8px', fontFamily: 'Space Mono', fontWeight: 700,
                background: scheme.status === 'ACTIVE' ? 'rgba(0,230,118,0.12)' : 'rgba(0,180,255,0.12)',
                color: scheme.status === 'ACTIVE' ? 'var(--green)' : 'var(--cyan)',
                border: `1px solid ${scheme.status === 'ACTIVE' ? 'rgba(0,230,118,0.3)' : 'rgba(0,180,255,0.3)'}`,
              }}>
                {scheme.status}
              </span>
            </div>

            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1.5, color: 'var(--text)', marginBottom: 4, textTransform: 'uppercase' }}>
              {scheme.title}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'Space Mono', marginBottom: 10 }}>
              {scheme.ministry}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 14 }}>
              {scheme.desc}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>KEY BENEFITS</div>
              {scheme.benefits.map(b => (
                <div key={b} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5, fontSize: 12, color: 'var(--text2)' }}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span> {b}
                </div>
              ))}
            </div>

            <a
              href={scheme.link}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              <button className="btn-cmd" style={{ padding: '7px 18px', fontSize: 11 }}>
                LEARN MORE →
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
