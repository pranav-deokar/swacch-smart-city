import { NextResponse } from 'next/server'
import { updateBinFill } from '@/lib/data-service'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { fill_level } = await req.json()

    await updateBinFill(id, fill_level)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update bin' },
      { status: 500 }
    )
  }
}