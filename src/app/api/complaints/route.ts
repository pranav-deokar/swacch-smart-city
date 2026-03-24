// src/app/api/complaints/route.ts
import { NextResponse } from 'next/server'
import { getComplaints, createComplaint, updateComplaintStatus, upvoteComplaint } from '@/lib/data-service'

export async function GET() {
  try {
    const complaints = await getComplaints()
    return NextResponse.json(complaints)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const complaint = await createComplaint(body)
    return NextResponse.json(complaint)
  } catch {
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, action } = await req.json()
    if (action === 'upvote') {
      await upvoteComplaint(id)
    } else {
      await updateComplaintStatus(id, status)
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 })
  }
}
