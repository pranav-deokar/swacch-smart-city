// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isDemoMode = !supabaseUrl || supabaseUrl === ''

export const supabase = isDemoMode
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (for API routes)
export function getServiceClient() {
  if (isDemoMode) return null
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}
