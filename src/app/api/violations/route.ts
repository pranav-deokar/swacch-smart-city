// src/app/api/violations/route.ts
import { NextResponse } from 'next/server'
import { getViolations, updateViolationStatus } from '@/lib/data-service'

export async function GET() {
  try {
    const violations = await getViolations()
    return NextResponse.json(violations)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch violations' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    await updateViolationStatus(id, status)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update violation' }, { status: 500 })
  }
}
