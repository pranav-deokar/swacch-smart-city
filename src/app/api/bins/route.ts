// src/app/api/bins/route.ts
import { NextResponse } from 'next/server'
import { getBins, updateBinFill } from '@/lib/data-service'

export async function GET() {
  try {
    const bins = await getBins()
    return NextResponse.json(bins)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bins' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, fill_level } = await req.json()
    await updateBinFill(id, fill_level)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update bin' }, { status: 500 })
  }
}
