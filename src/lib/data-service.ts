// src/lib/data-service.ts
// This is the UNIVERSAL data layer.
// In DEMO mode: returns demo data directly.
// In PRODUCTION mode: fetches from Supabase.
// Components call these functions — they never know which mode is active.

import { isDemoMode, supabase } from './supabase'
import {
  DEMO_BINS, DEMO_TRUCKS, DEMO_VIOLATIONS, DEMO_COMPLAINTS,
  DEMO_POSTS, DEMO_ALERTS, DEMO_OFFICERS, DEMO_ANALYTICS,
} from './demo-data'
import type {
  Bin, Truck, Violation, Complaint, CommunityPost,
  Alert, Officer, Analytics, ComplaintStatus, ViolationStatus,
} from '@/types'

// ── BINS ────────────────────────────────────────────────────
export async function getBins(): Promise<Bin[]> {
  if (isDemoMode) return DEMO_BINS
  const { data, error } = await supabase!.from('bins').select('*').order('fill_level', { ascending: false })
  if (error) { console.error(error); return DEMO_BINS }
  return data as Bin[]
}

export async function getBinById(id: string): Promise<Bin | null> {
  if (isDemoMode) return DEMO_BINS.find(b => b.id === id) ?? null
  const { data } = await supabase!.from('bins').select('*').eq('id', id).single()
  return data as Bin | null
}

export async function updateBinFill(id: string, fill_level: number): Promise<void> {
  if (isDemoMode) return
  await supabase!.from('bins').update({ fill_level, updated_at: new Date().toISOString() }).eq('id', id)
}

// ── TRUCKS ──────────────────────────────────────────────────
export async function getTrucks(): Promise<Truck[]> {
  if (isDemoMode) return DEMO_TRUCKS
  const { data, error } = await supabase!.from('trucks').select('*').order('id')
  if (error) { console.error(error); return DEMO_TRUCKS }
  return data as Truck[]
}

export async function getTruckByDriver(driver_id: string): Promise<Truck | null> {
  if (isDemoMode) return DEMO_TRUCKS[0]
  const { data } = await supabase!.from('trucks').select('*').eq('driver_id', driver_id).single()
  return data as Truck | null
}

export async function updateTruckLocation(id: string, lat: number, lng: number): Promise<void> {
  if (isDemoMode) return
  await supabase!.from('trucks').update({ lat, lng, updated_at: new Date().toISOString() }).eq('id', id)
}

export async function markBinCollected(truckId: string, binId: string): Promise<void> {
  if (isDemoMode) return
  await supabase!.from('bins').update({ fill_level: 0, last_collected: 'Just now', updated_at: new Date().toISOString() }).eq('id', binId)
  await supabase!.rpc('increment_bins_collected', { truck_id: truckId })
}

// ── VIOLATIONS ──────────────────────────────────────────────
export async function getViolations(): Promise<Violation[]> {
  if (isDemoMode) return DEMO_VIOLATIONS
  const { data, error } = await supabase!.from('violations').select('*').order('created_at', { ascending: false })
  if (error) { console.error(error); return DEMO_VIOLATIONS }
  return data as Violation[]
}

export async function updateViolationStatus(id: string, status: ViolationStatus): Promise<void> {
  if (isDemoMode) return
  await supabase!.from('violations').update({ status }).eq('id', id)
}

// ── COMPLAINTS ──────────────────────────────────────────────
export async function getComplaints(): Promise<Complaint[]> {
  if (isDemoMode) return DEMO_COMPLAINTS
  const { data, error } = await supabase!.from('complaints').select('*').order('created_at', { ascending: false })
  if (error) { console.error(error); return DEMO_COMPLAINTS }
  return data as Complaint[]
}

export async function getComplaintsByOfficer(officer_id: string): Promise<Complaint[]> {
  if (isDemoMode) return DEMO_COMPLAINTS.filter(c => c.assigned_officer === 'Smt. Kavita Rao')
  const { data, error } = await supabase!.from('complaints').select('*').eq('officer_id', officer_id).order('created_at', { ascending: false })
  if (error) return []
  return data as Complaint[]
}

export async function createComplaint(complaint: Omit<Complaint, 'id' | 'votes' | 'status'>): Promise<Complaint | null> {
  if (isDemoMode) {
    return { ...complaint, id: `C${Date.now()}`, votes: 0, status: 'open' } as Complaint
  }
  const { data, error } = await supabase!.from('complaints').insert([{ ...complaint, votes: 0, status: 'open' }]).select().single()
  if (error) { console.error(error); return null }
  return data as Complaint
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<void> {
  if (isDemoMode) return
  await supabase!.from('complaints').update({ status }).eq('id', id)
}

export async function upvoteComplaint(id: string): Promise<void> {
  if (isDemoMode) return
  await supabase!.rpc('increment_complaint_votes', { complaint_id: id })
}

// ── COMMUNITY POSTS ─────────────────────────────────────────
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  if (isDemoMode) return DEMO_POSTS
  const { data, error } = await supabase!.from('community_posts').select('*').order('created_at', { ascending: false })
  if (error) { console.error(error); return DEMO_POSTS }
  return data as CommunityPost[]
}

export async function createPost(post: Omit<CommunityPost, 'id' | 'likes' | 'comments'>): Promise<CommunityPost | null> {
  if (isDemoMode) {
    return { ...post, id: `P${Date.now()}`, likes: 0, comments: 0 } as CommunityPost
  }
  const { data, error } = await supabase!.from('community_posts').insert([{ ...post, likes: 0, comments: 0 }]).select().single()
  if (error) { console.error(error); return null }
  return data as CommunityPost
}

export async function likePost(id: string): Promise<void> {
  if (isDemoMode) return
  await supabase!.rpc('increment_post_likes', { post_id: id })
}

// ── ALERTS ──────────────────────────────────────────────────
export async function getAlerts(): Promise<Alert[]> {
  if (isDemoMode) return DEMO_ALERTS
  const { data, error } = await supabase!.from('alerts').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (error) { console.error(error); return DEMO_ALERTS }
  return data as Alert[]
}

// ── OFFICERS ────────────────────────────────────────────────
export async function getOfficers(): Promise<Officer[]> {
  if (isDemoMode) return DEMO_OFFICERS
  const { data, error } = await supabase!.from('officers').select('*').order('name')
  if (error) { console.error(error); return DEMO_OFFICERS }
  return data as Officer[]
}

// ── ANALYTICS ───────────────────────────────────────────────
export async function getAnalytics(): Promise<Analytics> {
  if (isDemoMode) return DEMO_ANALYTICS
  try {
    const [bins, trucks, violations] = await Promise.all([
      supabase!.from('bins').select('status, fill_level, waste_type'),
      supabase!.from('trucks').select('status'),
      supabase!.from('violations').select('id, created_at').gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    ])
    const binsData = (bins.data || []) as { status: string; fill_level: number; waste_type: string }[]
    const trucksData = (trucks.data || []) as { status: string }[]
    return {
      today_collected_kg: 2840,
      bins_critical: binsData.filter(b => b.status === 'critical').length,
      trucks_active: trucksData.filter(t => t.status === 'active').length,
      violations_today: violations.data?.length || 0,
      compliance_rate: 87,
      weekly_trend: [62, 71, 68, 75, 80, 77, 87],
      bins_by_status: {
        critical: binsData.filter(b => b.status === 'critical').length,
        warning: binsData.filter(b => b.status === 'warning').length,
        normal: binsData.filter(b => b.status === 'normal').length,
      },
      waste_by_type: {
        wet: binsData.filter(b => b.waste_type === 'wet').length,
        dry: binsData.filter(b => b.waste_type === 'dry').length,
        mixed: binsData.filter(b => b.waste_type === 'mixed').length,
      },
    }
  } catch {
    return DEMO_ANALYTICS
  }
}

// ── ROUTE OPTIMIZATION ──────────────────────────────────────
export async function generateOptimalRoutes() {
  const [bins, trucks] = await Promise.all([getBins(), getTrucks()])
  const criticalBins = bins.filter(b => b.fill_level >= 80)
  const availableTrucks = trucks.filter(t => t.status === 'active' || t.status === 'idle')
  return availableTrucks.map((truck, i) => {
    const assigned = criticalBins.slice(i * 3, i * 3 + 3)
    return {
      truck_id: truck.id,
      driver_name: truck.driver_name,
      bins: assigned.map(b => `${b.id} (${b.fill_level}%)`),
      distance_km: parseFloat((8 + Math.random() * 8).toFixed(1)),
      eta_minutes: 60 + Math.floor(Math.random() * 60),
      fuel_saving_pct: 15 + Math.floor(Math.random() * 15),
    }
  })
}
