// src/app/api/community/route.ts
import { NextResponse } from 'next/server'
import { getCommunityPosts, createPost, likePost } from '@/lib/data-service'

export async function GET() {
  try {
    const posts = await getCommunityPosts()
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, id, ...postData } = body
    if (action === 'like') {
      await likePost(id)
      return NextResponse.json({ success: true })
    }
    const post = await createPost(postData)
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
