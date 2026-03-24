# SWACHH-AI — Smart Waste Ecosystem

> AI + IoT powered smart city waste management platform for Pune Municipal Corporation

A full-stack Next.js + Supabase web application with Admin Command Center, Driver Hub, and Citizen Portal.

---

## 🚀 Quick Start (3 steps)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/swachh-ai.git
cd swachh-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

**DEMO MODE** (works immediately, no backend needed):
- Leave `NEXT_PUBLIC_SUPABASE_URL` empty in `.env.local`
- Run `npm run dev` → visit http://localhost:3000

**PRODUCTION MODE** (real database):
- Fill in your Supabase credentials in `.env.local`
- Run the SQL migration in Supabase (see step 3)
- Run `npm run dev`

### 3. Set up Supabase (Production only)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase/migrations/001_initial_schema.sql` → Run
3. Copy your **Project URL** and **Anon Key** from Settings → API → paste in `.env.local`

---

## 🌐 Deploy to Vercel

```bash
# Push to GitHub, then:
vercel --prod
# Or connect your GitHub repo in Vercel dashboard
```

Set environment variables in Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 👥 User Roles

| Role | URL | Description |
|------|-----|-------------|
| 🏛️ Admin | `/admin` | Full command center with map, bins, trucks, violations, complaints, analytics, routing |
| 🚛 Driver | `/driver` | Field operator view with assigned bins and collection workflow |
| 👤 Citizen | `/citizen` | Community feed, complaints, alerts, map, awareness, schemes |

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── admin/                # Admin panel (7 sub-pages)
│   │   ├── page.tsx          # Command map
│   │   ├── bins/page.tsx     # Bin network table
│   │   ├── trucks/page.tsx   # Fleet management
│   │   ├── violations/page.tsx # AI violations
│   │   ├── complaints/page.tsx # Complaint management
│   │   ├── analytics/page.tsx  # Analytics dashboard
│   │   └── routing/page.tsx    # Smart route optimizer
│   ├── driver/page.tsx       # Driver panel
│   ├── citizen/page.tsx      # Citizen portal
│   └── api/                  # API routes (auto-switch demo/prod)
│       ├── bins/
│       ├── trucks/
│       ├── violations/
│       ├── complaints/
│       ├── community/
│       ├── analytics/
│       ├── routes/
│       ├── officers/
│       └── alerts/
├── components/
│   ├── ui/index.tsx          # Shared UI atoms
│   ├── map/LiveMap.tsx       # Leaflet map component
│   ├── admin/                # Admin-specific components
│   └── citizen/              # Citizen-specific components
├── hooks/useData.ts          # Data fetching hooks with polling
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── demo-data.ts          # Complete demo dataset
│   └── data-service.ts       # Universal data layer (auto-switches)
└── types/index.ts            # TypeScript types
```

---

## ⚙️ How Demo/Production Switching Works

The `src/lib/data-service.ts` file acts as a universal data gateway:

```typescript
// If NEXT_PUBLIC_SUPABASE_URL is empty → returns demo data
// If NEXT_PUBLIC_SUPABASE_URL is set  → queries Supabase
export async function getBins(): Promise<Bin[]> {
  if (isDemoMode) return DEMO_BINS          // Demo
  const { data } = await supabase.from('bins').select('*')  // Production
  return data as Bin[]
}
```

**No code changes required** — only environment variables.

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | Full-stack React framework |
| TypeScript | End-to-end type safety |
| Supabase | PostgreSQL + Auth + Realtime + Storage |
| Tailwind CSS | Utility-first styling |
| Leaflet + React Leaflet | Interactive city map |
| Framer Motion | Animations |

---

## 📊 Features

### Admin Command Center
- 🗺️ **Live Map** — Real-time bin and truck positions with Leaflet
- 🗑️ **Bin Network** — Filter, search, and monitor all bins with fill levels
- 🚛 **Fleet Management** — Track all trucks, routes, fuel, progress
- ⚠️ **AI Violations** — Review computer-vision detected violations with confidence scores
- 📋 **Complaints** — Full complaint lifecycle management with officer assignment
- 📊 **Analytics** — Weekly compliance trends, bin distribution, waste types
- 🧭 **Smart Routing** — AI-powered optimal route generation for critical bins

### Driver Hub
- Priority-sorted bin list (skip low-fill bins automatically)
- One-tap mark-as-collected with live map
- Route progress tracking
- Real-time navigation overlay

### Citizen Portal
- 🌐 Community feed with post/like/share
- 📢 Awareness tips and DOs & DON'Ts
- 🔔 Live municipal alerts and announcements
- 📋 Complaint filing with officer selection and status tracking
- 🗺️ Nearest bin finder on interactive map
- 🏛️ Government schemes and programs
- 🌍 Multi-language: English, Hindi, Marathi

---

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for bins, trucks, alerts
- Authenticated write for complaints and posts
- Service role key used server-side only (never exposed to client)

---

## 📄 License

MIT — Built for smart city innovation.
