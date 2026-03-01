# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is TravelPro

A SaaS platform for Israeli event producers who organize group trips, team-building days, and retreats. Core features: client-facing quote builder, supplier database management, and project pipeline tracking. The entire UI is **Hebrew RTL** (`dir="rtl"`).

Originally scaffolded from **Figma Make** (code bundle export). The Figma design source: `figma:asset/...` imports resolve via a custom Vite plugin to placeholder SVGs in local dev.

## Commands

```bash
bun install          # Install dependencies (bun.lock is the lockfile)
bun run dev          # Start Vite dev server
bun run build        # Production build
npx playwright test  # Run Playwright e2e tests (config not yet created)
```

## Architecture

### Frontend (Vite + React 18 + TypeScript)

- **Entry**: `src/main.tsx` → `src/app/App.tsx`
- **Routing**: React Router v7 (`src/app/routes.ts`) — Layout wraps all authenticated pages, `/quote/:id` is a public route (no auth)
- **Auth**: Supabase Auth via `src/app/components/AuthContext.tsx` — provides `useAuth()` hook with `login`, `signup`, `logout`
- **API client**: `src/app/components/api.ts` — all backend calls go through a `request<T>()` wrapper that hits a Supabase Edge Function. API modules: `suppliersApi`, `projectsApi`, `clientsApi`, `quoteItemsApi`, `timelineApi`, `calendarApi`, `kanbanApi`, `dashboardApi`, `publicApi`
- **Data types**: `src/app/components/data.ts` — `Supplier`, `Project`, `Client`, `CalendarEvent`, `QuoteVersion` interfaces + seed data
- **UI components**: `src/app/components/ui/` — 50+ shadcn/ui components (Radix + Tailwind + CVA)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Styles in `src/styles/` (index.css imports fonts.css, tailwind.css, theme.css). Font: Assistant (Hebrew/Latin)
- **Path alias**: `@` maps to `./src` (configured in `vite.config.ts`)

### Backend (Supabase Edge Function)

- **Server**: `supabase/functions/server/index.tsx` — Hono framework running on Deno, serves REST API at `/make-server-0045c7fc/...`
- **Storage**: Simple KV store (`supabase/functions/server/kv_store.tsx`) backed by a `kv_store_0045c7fc` Postgres table. Not a relational schema — all entities stored as JSON blobs by key
- **Supabase config**: `utils/supabase/info.tsx` has the project ID and public anon key. Client initialized in `src/app/components/supabaseClient.ts`

### Convex (early stage)

- `convex/` directory has auth config but no application functions yet. Convex is being evaluated as a potential backend addition/replacement.

## Key Patterns

- **Seed on startup**: `App.tsx` calls `ensureSeeded()` on mount which POSTs to `/seed` to populate initial data if empty
- **Toast notifications**: Use `appToast.success()` / `appToast.error()` from `src/app/components/AppToast.tsx` (wraps Sonner)
- **Forms**: `react-hook-form` with custom `FormField` / `FormSelect` components and validation rules from `src/app/components/FormField.tsx`
- **Maps**: Leaflet via `react-leaflet` for supplier location maps
- **Drag & drop**: `react-dnd` for Kanban board and timeline
- **Charts**: Recharts for dashboard analytics

## MCP Integrations

Configured in `.mcp.json`: Playwright (testing), Miro (diagrams), Vercel (deployment), Clerk (auth evaluation), Supabase (database).

## Project Status

~60-65% of MVP spec built. Core CRUD works. Missing "smart" features: PDF export, WhatsApp/email sending, supplier recommendation engine, duplicate detection, profit distribution, travel time calculation, Google Calendar sync. See `docs/project-status.md` for details.
