// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/data-service'

export async function GET() {
  try {
    const analytics = await getAnalytics()
    return NextResponse.json(analytics)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
