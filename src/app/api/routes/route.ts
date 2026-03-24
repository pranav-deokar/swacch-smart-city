// src/app/api/routes/route.ts
import { NextResponse } from 'next/server'
import { generateOptimalRoutes } from '@/lib/data-service'
import { getOfficers } from '@/lib/data-service'

export async function GET() {
  try {
    const routes = await generateOptimalRoutes()
    return NextResponse.json(routes)
  } catch {
    return NextResponse.json({ error: 'Failed to generate routes' }, { status: 500 })
  }
}
