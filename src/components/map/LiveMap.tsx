'use client'
// src/components/map/LiveMap.tsx

import { useEffect, useRef } from 'react'
import type { Bin, Truck } from '@/types'

interface LiveMapProps {
  bins: Bin[]
  trucks: Truck[]
  selectedBin?: Bin | null
  onBinClick?: (bin: Bin) => void
  height?: string
}

export default function LiveMap({ bins, trucks, selectedBin, onBinClick, height = '100%' }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return
    if (mapInstanceRef.current) return // already initialized

    import('leaflet').then((L) => {
      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [18.5204, 73.8567],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      })

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)

      mapInstanceRef.current = map
      renderMarkers(L, map)
    })
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then((L) => {
      // Clear old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      renderMarkers(L, mapInstanceRef.current)
    })
  }, [bins, trucks, selectedBin])

  function renderMarkers(L: any, map: any) {
    const statusColor = { critical: '#ff3d5a', warning: '#ffb700', normal: '#00e676' }

    bins.forEach((bin) => {
      const color = statusColor[bin.status] || '#00e676'
      const isSelected = selectedBin?.id === bin.id
      const size = isSelected ? 36 : 28

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:${size}px;height:${size}px;">
            ${bin.status === 'critical' ? `<div style="position:absolute;inset:-8px;border-radius:50%;border:1px solid ${color};opacity:0.4;animation:pulse-ring 1.5s ease-out infinite;"></div>` : ''}
            <svg viewBox="0 0 28 36" width="${size}" height="${size}">
              <rect x="4" y="0" width="20" height="28" rx="3" fill="${color}22" stroke="${color}" stroke-width="${isSelected ? 2 : 1.5}"/>
              <rect x="7" y="${28 - (bin.fill_level / 100) * 22}" width="14" height="${(bin.fill_level / 100) * 22}" rx="1.5" fill="${color}" opacity="0.8"/>
              <text x="14" y="34" text-anchor="middle" font-family="Space Mono" font-size="7" fill="${color}">${bin.id}</text>
            </svg>
          </div>
        `,
        iconSize: [size, size + 8],
        iconAnchor: [size / 2, size + 8],
      })

      const marker = L.marker([bin.lat, bin.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'Outfit',sans-serif;min-width:180px;">
            <div style="font-family:'Space Mono',monospace;font-size:13px;color:${color};font-weight:700;margin-bottom:6px;">${bin.id}</div>
            <div style="font-size:12px;color:#c8e0f0;margin-bottom:8px;">${bin.location}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a8cad;margin-bottom:4px;">
              <span>FILL LEVEL</span><span style="color:${color};font-family:'Space Mono',monospace;">${bin.fill_level}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a8cad;margin-bottom:4px;">
              <span>ZONE</span><span style="color:#c8e0f0;">${bin.zone}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a8cad;">
              <span>LAST COLLECTED</span><span style="color:#c8e0f0;">${bin.last_collected}</span>
            </div>
          </div>
        `)

      if (onBinClick) {
        marker.on('click', () => onBinClick(bin))
      }
      markersRef.current.push(marker)
    })

    // Truck markers
    trucks.filter(t => t.status !== 'maintenance').forEach((truck) => {
      const color = truck.status === 'active' ? '#00e676' : '#00b4ff'
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;">
            <div style="width:36px;height:36px;border-radius:50%;background:${color}18;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:16px;">🚛</div>
            <div style="position:absolute;top:38px;left:50%;transform:translateX(-50%);font-family:'Space Mono',monospace;font-size:9px;color:${color};white-space:nowrap;">${truck.id}</div>
          </div>
        `,
        iconSize: [36, 52],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([truck.lat, truck.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'Outfit',sans-serif;">
            <div style="font-family:'Space Mono',monospace;font-size:13px;color:${color};font-weight:700;margin-bottom:4px;">${truck.id} — ${truck.driver_name}</div>
            <div style="font-size:11px;color:#6a8cad;">ROUTE: ${truck.route_name}</div>
            <div style="font-size:11px;color:#6a8cad;">PROGRESS: ${truck.bins_collected}/${truck.total_bins} bins</div>
            <div style="font-size:11px;color:#6a8cad;">FUEL: ${truck.fuel_level}%</div>
          </div>
        `)
      markersRef.current.push(marker)
    })
  }

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .leaflet-popup-content { margin: 14px 16px !important; }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
