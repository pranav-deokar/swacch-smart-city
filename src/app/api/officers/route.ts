// src/app/api/officers/route.ts
import { NextResponse } from 'next/server'
import { getOfficers } from '@/lib/data-service'

export async function GET() {
  try {
    const officers = await getOfficers()
    return NextResponse.json(officers)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch officers' }, { status: 500 })
  }
}
