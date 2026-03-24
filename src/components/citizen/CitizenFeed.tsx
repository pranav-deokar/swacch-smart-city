'use client'
// src/components/citizen/CitizenFeed.tsx
import { useState } from 'react'
import { usePosts } from '@/hooks/useData'
import { apiPost } from '@/hooks/useData'
import { Spinner } from '@/components/ui'
import type { Language } from '@/app/citizen/page'
import type { CommunityPost } from '@/types'

const POST_TYPE_COLOR: Record<string, string> = {
  alert: 'var(--red)',
  official: 'var(--cyan)',
  initiative: 'var(--green)',
  general: 'var(--border)',
}

const POST_TYPE_LABEL: Record<string, string> = {
  alert: '🚨 ALERT',
  official: '🏛️ OFFICIAL',
  initiative: '🌿 INITIATIVE',
  general: '',
}

interface Props { lang: Language }

export default function CitizenFeed({ lang }: Props) {
  const { data: posts, loading, refetch } = usePosts()
  const [newContent, setNewContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  const handlePost = async () => {
    if (!newContent.trim()) return
    setPosting(true)
    await apiPost('/api/community', {
      user_name: 'Citizen User',
      avatar: 'CU',
      content: newContent,
      post_type: 'general',
      created_at: new Date().toISOString(),
    })
    setNewContent('')
    setPosting(false)
    refetch()
  }

  const handleLike = async (post: CommunityPost) => {
    if (likedIds.has(post.id)) return
    await apiPost('/api/community', { action: 'like', id: post.id })
    setLikedIds(prev => new Set([...prev, post.id]))
    refetch()
  }

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      const diff = Date.now() - d.getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 60) return `${mins}m ago`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `${hours}h ago`
      return `${Math.floor(hours / 24)}d ago`
    } catch { return 'recently' }
  }

  return (
    <div style={{ padding: 20, maxWidth: 680, margin: '0 auto' }}>
      {/* Post composer */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 16, marginBottom: 20 }}>
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          className="inp"
          placeholder="Report an issue, share an update, or post a community initiative..."
          style={{ resize: 'none', height: 76, marginBottom: 10 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['📷 PHOTO', '📍 LOCATION', '⚠️ ALERT'].map(label => (
              <button key={label} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text3)', padding: '5px 10px', fontSize: 10, cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1 }}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn-cmd" style={{ padding: '7px 18px' }} onClick={handlePost} disabled={posting || !newContent.trim()}>
            {posting ? 'POSTING...' : 'POST →'}
          </button>
        </div>
      </div>

      {/* Feed */}
      {loading ? <Spinner /> : (posts ?? []).map((post, i) => (
        <div
          key={post.id}
          className="anim-fade-up"
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${POST_TYPE_COLOR[post.post_type] ?? 'var(--border)'}`,
            padding: 16,
            marginBottom: 1,
            animationDelay: `${i * 0.07}s`,
          }}
        >
          {/* Post header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--cyan), var(--bg3))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontFamily: 'Space Mono', color: 'var(--cyan)', flexShrink: 0,
            }}>
              {post.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{post.user_name}</span>
                {post.post_type !== 'general' && (
                  <span style={{ fontSize: 9, padding: '1px 7px', background: `${POST_TYPE_COLOR[post.post_type]}18`, color: POST_TYPE_COLOR[post.post_type], border: `1px solid ${POST_TYPE_COLOR[post.post_type]}40`, fontFamily: 'Space Mono' }}>
                    {POST_TYPE_LABEL[post.post_type]}
                  </span>
                )}
              </div>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono', whiteSpace: 'nowrap' }}>
              {formatTime(post.created_at)}
            </span>
          </div>

          {/* Content */}
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: post.image_url ? 12 : 0 }}>
            {post.content}
          </p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block', marginBottom: 10, border: '1px solid var(--border)' }}
            />
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => handleLike(post)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
                color: likedIds.has(post.id) ? 'var(--cyan)' : 'var(--text3)',
                fontFamily: 'Outfit', display: 'flex', gap: 5, alignItems: 'center',
                transition: 'color 0.2s',
              }}
            >
              👍 {post.likes + (likedIds.has(post.id) ? 1 : 0)}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text3)', fontFamily: 'Outfit' }}>
              💬 {post.comments}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text3)', fontFamily: 'Outfit' }}>
              ↗ Share
            </button>
            {post.post_type === 'alert' && (
              <button style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(255,61,90,0.3)', color: 'var(--red)', padding: '3px 10px', cursor: 'pointer', fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 1 }}>
                REPORT TO PMC
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
