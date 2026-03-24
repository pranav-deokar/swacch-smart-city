// src/app/api/alerts/route.ts
import { NextResponse } from 'next/server'
import { getAlerts } from '@/lib/data-service'

export async function GET() {
  try {
    const alerts = await getAlerts()
    return NextResponse.json(alerts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}
