// src/app/api/trucks/route.ts
import { NextResponse } from 'next/server'
import { getTrucks } from '@/lib/data-service'

export async function GET() {
  try {
    const trucks = await getTrucks()
    return NextResponse.json(trucks)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trucks' }, { status: 500 })
  }
}
