# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is TravelPro

A SaaS platform for Israeli event producers who organize group trips, team-building days, and retreats. Core features: client-facing quote builder, supplier database management, and project pipeline tracking. The entire UI is **Hebrew RTL** (`dir="rtl"`).

Originally scaffolded from **Figma Make** (code bundle export). The Figma design source: `figma:asset/...` imports resolve via a custom Vite plugin to `src/figma-placeholder.svg` in local dev.

## Commands

```bash
bun install          # Install dependencies (bun.lock is the lockfile)
bun run dev          # Start Vite dev server
bun run build        # Production build
bun lint             # Biome lint + TypeScript type-check
bun tsc              # TypeScript type-check (standalone)
bun ultracite        # Ultracite check
npx convex dev       # Start Convex dev server (syncs schema + functions)
npx convex run seed:seedAll  # Seed initial data (idempotent)
```

Development requires **two terminals**: `bun run dev` (frontend) and `npx convex dev` (backend). The Convex dev server watches `convex/` and hot-deploys function/schema changes.

**Always use `bun` instead of `npm`** (unless bun doesn't work for a specific command).

### Linting & Formatting (Biome + Ultracite)

- **Biome**: `biome.jsonc` extends `ultracite/biome/core` and `ultracite/biome/react`
- **TypeScript**: Root `tsconfig.json` for frontend (`src/`), separate `convex/tsconfig.json` for backend
- **Scripts**: `bun lint` (biome + tsc), `bun lint:fix`, `bun format`, `bun tsc`, `bun ultracite`

### Verification (required after every code change)

After **every** code change, run all three checks to ensure clean, production-ready code:

```bash
bun lint        # Biome lint + TypeScript type-check
bun tsc         # TypeScript type-check (standalone)
bun ultracite   # Ultracite check
```

Do not skip these. Fix any errors before considering work complete.

## Environment Variables

`.env.local` (required for local dev):
```
CONVEX_DEPLOYMENT=dev:unique-ermine-475
VITE_CONVEX_URL=https://unique-ermine-475.convex.cloud
VITE_CONVEX_SITE_URL=https://unique-ermine-475.convex.site
```

## Architecture

### Frontend (Vite + React 18 + TypeScript)

- **Entry**: `src/main.tsx` → `src/app/App.tsx`
- **Routing**: React Router v7 (`src/app/routes.ts`). Three role-based router factories: `createProducerRouter()`, `createSupplierRouter()`, `createAdminRouter()`. `App.tsx` also creates a **separate `publicRouter`** for `/quote/:id` (no auth). The main router uses `Layout` which wraps all authenticated pages. Auth gating is in `AppInner()` in `App.tsx`, not in the Layout component itself
- **Roles**: `users` table has `role` field (`admin` | `producer` | `supplier`) with role-specific onboarding flows in `src/app/components/onboarding/`
- **Auth**: Convex Auth via `src/app/components/AuthContext.tsx` — provides `useAuth()` hook with `login`, `signup`, `logout`. Uses `@convex-dev/auth` with email/password provider
- **Backend calls**: All pages use `useQuery` / `useMutation` hooks from `convex/react` directly — no API client layer. Data is real-time reactive
- **Data types**: `src/app/components/data.ts` — `Supplier`, `Project`, `Client`, `CalendarEvent`, `QuoteVersion` interfaces
- **UI components**: `src/app/components/ui/` — ~46 shadcn/ui components (Radix + Tailwind + CVA), plus utilities (`utils.ts`, `use-mobile.ts`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Styles in `src/styles/` (index.css imports fonts.css, tailwind.css, theme.css). Font: Assistant (Hebrew/Latin)
- **Path alias**: `@` maps to `./src` (configured in `vite.config.ts`)
- **Assets**: `vite.config.ts` includes `assetsInclude: ['**/*.svg', '**/*.csv']` — CSVs are importable as raw assets (used by ImportWizard)

### Backend (Convex)

- **Deployment**: `unique-ermine-475.convex.cloud`
- **Schema**: `convex/schema.ts` — 25+ tables including core domain tables (suppliers, projects, clients, calendarEvents, kanbanTasks) + extended tables (leads, bookings, invoiceTracking, supplierAvailability, supplierOrders, notifications, etc.) + `metadata` + `authTables`. All entities use `_id` (Convex internal) with `legacyId` for backward-compatible URL routing
- **Functions** (in `convex/`):
  - `suppliers.ts` — list, get, getByLegacyId, summaries, create, update, remove, archive, bulkImport, bulkRollback
  - `supplierContacts.ts`, `supplierProducts.ts`, `supplierDocuments.ts` — sub-resources by supplierId
  - `projects.ts` — CRUD with legacyId format `{seq}-{YY}` (e.g., "4829-24")
  - `quoteItems.ts`, `timelineEvents.ts`, `projectDocuments.ts` — sub-resources by projectId
  - `clients.ts`, `calendarEvents.ts`, `kanbanTasks.ts` — standard CRUD
  - `dashboard.ts` — aggregated stats query
  - `publicQuote.ts` — public queries/mutations (no auth) for client-facing quote page
  - `images.ts` — `generateUploadUrl` for Convex file storage
  - `http.ts` — HTTP router, adds auth routes via `auth.addHttpRoutes(http)`
  - `seed.ts` — idempotent `seedAll` mutation
- **Auth**: `convex/auth.ts` — Password provider via `@convex-dev/auth`. `convex/auth.config.ts` uses `CONVEX_SITE_URL` for JWT issuer config
- **ID mapping**: Convex uses `_id` internally. All queries map `id: doc._id` in return values so frontend uses `.id`. Projects also have `legacyId` for URL routing
- **Image storage**: Convex file storage. Upload flow: `generateUploadUrl()` → `fetch(url, { method: "POST", body: file })` → store `storageId`. Hook: `src/app/components/hooks/useImageUpload.ts`. Exception: `kanbanTasks` attachments use inline `dataUrl` (base64), not file storage

### Convex Provider

- `src/app/components/ConvexProvider.tsx` — wraps app in `ConvexAuthProvider` with `ConvexReactClient`
- `src/app/components/AuthContext.tsx` — wraps `useConvexAuth()` + `useAuthActions()` in familiar `useAuth()` interface

## Key Patterns

- **Real-time data**: All pages use `useQuery(api.module.fn)` — data auto-updates across tabs. `useQuery` returns `undefined` while loading
- **Conditional queries**: Use `"skip"` parameter: `useQuery(api.foo.bar, condition ? { id } : "skip")`
- **Optimistic updates**: Some pages (KanbanBoard) maintain local state and sync to server via `useMutation`
- **Toast notifications**: Use `appToast.success()` / `appToast.error()` from `src/app/components/AppToast.tsx` (wraps Sonner)
- **Forms**: `react-hook-form` with custom `FormField` / `FormSelect` components and validation rules from `src/app/components/FormField.tsx`
- **Maps**: Leaflet via `react-leaflet` for supplier location maps. Suppliers have `location: { lat, lng }` in schema
- **Drag & drop**: `react-dnd` for Kanban board and timeline
- **Charts**: Recharts for dashboard analytics
- **Calendar views**: `src/app/components/calendar/` — DailyView, WeeklyView, MonthlyView, EventFormModal

## Testing

No automated test suite. Playwright is installed (`@playwright/test`) but no test files exist. Testing is manual. See `docs/testing-plan-01-02.md` for planned testing strategy.

## Project Status

~60-65% of MVP spec built. Core CRUD works. Backend fully migrated from Supabase to Convex. Missing "smart" features: PDF export, WhatsApp/email sending, supplier recommendation engine, duplicate detection, profit distribution, travel time calculation, Google Calendar sync. See `docs/project-status.md` for details. Feature plans live in `docs/plans/`.
