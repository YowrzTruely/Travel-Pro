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
npx convex dev       # Start Convex dev server (syncs schema + functions)
npx convex run seed:seedAll  # Seed initial data (idempotent)
npx playwright test  # Run Playwright e2e tests (config not yet created)
```

## Architecture

### Frontend (Vite + React 18 + TypeScript)

- **Entry**: `src/main.tsx` → `src/app/App.tsx`
- **Routing**: React Router v7 (`src/app/routes.ts`) — Layout wraps all authenticated pages, `/quote/:id` is a public route (no auth)
- **Auth**: Convex Auth via `src/app/components/AuthContext.tsx` — provides `useAuth()` hook with `login`, `signup`, `logout`. Uses `@convex-dev/auth` with email/password provider
- **Backend calls**: All pages use `useQuery` / `useMutation` hooks from `convex/react` directly — no API client layer. Data is real-time reactive
- **Data types**: `src/app/components/data.ts` — `Supplier`, `Project`, `Client`, `CalendarEvent`, `QuoteVersion` interfaces
- **UI components**: `src/app/components/ui/` — 50+ shadcn/ui components (Radix + Tailwind + CVA)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Styles in `src/styles/` (index.css imports fonts.css, tailwind.css, theme.css). Font: Assistant (Hebrew/Latin)
- **Path alias**: `@` maps to `./src` (configured in `vite.config.ts`)

### Backend (Convex)

- **Deployment**: `unique-ermine-475.convex.cloud`
- **Schema**: `convex/schema.ts` — 11 domain tables + metadata + authTables. All entities use `_id` (Convex internal) with `legacyId` for backward-compatible URL routing
- **Functions** (in `convex/`):
  - `suppliers.ts` — list, get, getByLegacyId, summaries, create, update, remove, archive, bulkImport, bulkRollback
  - `supplierContacts.ts`, `supplierProducts.ts`, `supplierDocuments.ts` — sub-resources by supplierId
  - `projects.ts` — CRUD with legacyId format `{seq}-{YY}` (e.g., "4829-24")
  - `quoteItems.ts`, `timelineEvents.ts`, `projectDocuments.ts` — sub-resources by projectId
  - `clients.ts`, `calendarEvents.ts`, `kanbanTasks.ts` — standard CRUD
  - `dashboard.ts` — aggregated stats query
  - `publicQuote.ts` — public queries/mutations (no auth) for client-facing quote page
  - `images.ts` — `generateUploadUrl` for Convex file storage
  - `seed.ts` — idempotent `seedAll` mutation
- **Auth**: `convex/auth.ts` — Password provider via `@convex-dev/auth`
- **ID mapping**: Convex uses `_id` internally. All queries map `id: doc._id` in return values so frontend uses `.id`. Projects also have `legacyId` for URL routing
- **Image storage**: Convex file storage. Upload flow: `generateUploadUrl()` → `fetch(url, { method: "POST", body: file })` → store `storageId`. Hook: `src/app/components/hooks/useImageUpload.ts`

### Convex Provider

- `src/app/components/ConvexProvider.tsx` — wraps app in `ConvexAuthProvider` with `ConvexReactClient`
- `src/app/components/AuthContext.tsx` — wraps `useConvexAuth()` + `useAuthActions()` in familiar `useAuth()` interface

## Key Patterns

- **Real-time data**: All pages use `useQuery(api.module.fn)` — data auto-updates across tabs. `useQuery` returns `undefined` while loading
- **Conditional queries**: Use `"skip"` parameter: `useQuery(api.foo.bar, condition ? { id } : "skip")`
- **Optimistic updates**: Some pages (KanbanBoard) maintain local state and sync to server via `useMutation`
- **Toast notifications**: Use `appToast.success()` / `appToast.error()` from `src/app/components/AppToast.tsx` (wraps Sonner)
- **Forms**: `react-hook-form` with custom `FormField` / `FormSelect` components and validation rules from `src/app/components/FormField.tsx`
- **Maps**: Leaflet via `react-leaflet` for supplier location maps
- **Drag & drop**: `react-dnd` for Kanban board and timeline
- **Charts**: Recharts for dashboard analytics

## MCP Integrations

Configured in `.mcp.json`: Playwright (testing), Miro (diagrams), Vercel (deployment), Clerk (auth evaluation).

## Project Status

~60-65% of MVP spec built. Core CRUD works. Backend fully migrated from Supabase to Convex. Missing "smart" features: PDF export, WhatsApp/email sending, supplier recommendation engine, duplicate detection, profit distribution, travel time calculation, Google Calendar sync. See `docs/project-status.md` for details.
