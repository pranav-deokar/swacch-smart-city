// src/types/index.ts

export type BinStatus = 'critical' | 'warning' | 'normal'
export type TruckStatus = 'active' | 'idle' | 'maintenance'
export type ComplaintStatus = 'open' | 'in-review' | 'resolved'
export type ViolationStatus = 'pending' | 'reviewed' | 'actioned'
export type WasteType = 'wet' | 'dry' | 'mixed'
export type UserRole = 'admin' | 'driver' | 'citizen'
export type PostType = 'alert' | 'initiative' | 'official' | 'general'

export interface Bin {
  id: string
  location: string
  lat: number
  lng: number
  fill_level: number
  status: BinStatus
  waste_type: WasteType
  last_collected: string
  zone: string
  created_at?: string
  updated_at?: string
}

export interface Truck {
  id: string
  driver_name: string
  driver_id?: string
  lat: number
  lng: number
  status: TruckStatus
  route_name: string
  bins_collected: number
  total_bins: number
  fuel_level: number
  created_at?: string
  updated_at?: string
}

export interface Violation {
  id: string
  type: string
  location: string
  lat: number
  lng: number
  detected_at: string
  confidence: number
  image_url: string
  status: ViolationStatus
  assigned_officer: string
  officer_id?: string
  created_at?: string
}

export interface Officer {
  id: string
  name: string
  zone: string
  email: string
  active_complaints: number
  resolved_complaints: number
}

export interface Complaint {
  id: string
  citizen_name: string
  citizen_id?: string
  issue: string
  location: string
  lat?: number
  lng?: number
  status: ComplaintStatus
  priority: 'high' | 'medium' | 'low'
  assigned_officer: string
  officer_id?: string
  created_at: string
  votes: number
  image_url?: string
}

export interface CommunityPost {
  id: string
  user_name: string
  user_id?: string
  avatar: string
  content: string
  image_url?: string
  likes: number
  comments: number
  post_type: PostType
  created_at: string
}

export interface Alert {
  id: string
  title: string
  description: string
  alert_type: 'warning' | 'info' | 'success' | 'danger'
  created_at: string
  is_active: boolean
}

export interface RouteOptimization {
  truck_id: string
  driver_name: string
  bins: string[]
  distance_km: number
  eta_minutes: number
  fuel_saving_pct: number
}

export interface Analytics {
  today_collected_kg: number
  bins_critical: number
  trucks_active: number
  violations_today: number
  compliance_rate: number
  weekly_trend: number[]
  bins_by_status: { critical: number; warning: number; normal: number }
  waste_by_type: { wet: number; dry: number; mixed: number }
}
