import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SWACHH-AI | Smart Waste Ecosystem — Pune',
  description: 'AI + IoT powered smart city waste management platform for Pune Municipal Corporation',
  keywords: 'smart waste management, IoT bins, Pune, PMC, SWACHH-AI',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100vh', background: '#070b10' }}>
        {children}
      </body>
    </html>
  )
}
