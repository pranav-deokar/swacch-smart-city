// src/hooks/useData.ts
'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Bin, Truck, Violation, Complaint, CommunityPost, Alert, Officer, Analytics, RouteOptimization } from '@/types'

type FetchState<T> = { data: T | null; loading: boolean; error: string | null; refetch: () => void }

function usePolling<T>(url: string, interval = 30000): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, interval)
    return () => clearInterval(timer)
  }, [fetchData, interval])

  return { data, loading, error, refetch: fetchData }
}

export function useBins() {
  return usePolling<Bin[]>('/api/bins', 20000)
}
export function useTrucks() {
  return usePolling<Truck[]>('/api/trucks', 15000)
}
export function useViolations() {
  return usePolling<Violation[]>('/api/violations', 30000)
}
export function useComplaints() {
  return usePolling<Complaint[]>('/api/complaints', 30000)
}
export function usePosts() {
  return usePolling<CommunityPost[]>('/api/community', 60000)
}
export function useAlerts() {
  return usePolling<Alert[]>('/api/alerts', 60000)
}
export function useOfficers() {
  return usePolling<Officer[]>('/api/officers', 120000)
}
export function useAnalytics() {
  return usePolling<Analytics>('/api/analytics', 30000)
}
export function useRoutes() {
  return usePolling<RouteOptimization[]>('/api/routes', 60000)
}

// Mutation helpers
export async function apiPatch(url: string, body: object) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function apiPost(url: string, body: object) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}
