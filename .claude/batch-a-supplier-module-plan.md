# Batch A — Supplier Module (Plans 03, 04, 05)

## Context

The supplier portal currently has placeholder pages. All backend tables and basic CRUD already exist. This batch replaces placeholders with real supplier-facing pages: product management, document compliance, public profiles & promotions. The three plans are independent and run as parallel subagents.

---

## Conflict Strategy

- **`convex/schema.ts`** — Only Agent 2 (Plan 04) modifies it (adds compliance fields to `supplierDocuments`)
- **`src/app/routes.ts`** — Each agent replaces its own placeholders. Agent 1: products/availability/profile. Agent 2: documents. Agent 3: adds new routes (preview/promotions/ratings). No line-level conflicts
- **`src/app/App.tsx`** — Only Agent 3 adds public route
- **`src/app/components/SupplierDetail.tsx`** — Only Agent 2 (compliance badges)
- **`src/app/components/SupplierSearch.tsx`** — Only Agent 3 (promotion badges)

---

## Agent 1: Plan 03 — Supplier Profile & Products

### New Files
| File | Purpose |
|------|---------|
| `src/app/components/supplier/MyProducts.tsx` | Product listing with card/list toggle, add/edit/delete |
| `src/app/components/supplier/SupplierProductEditor.tsx` | Full product form: 4-tier pricing, volume pricing, timing, equipment, addons, images, AI stub |
| `src/app/components/supplier/SupplierProfile.tsx` | Profile editing: business info, categories (max 3), regions, address+map, hours, URLs, margin |
| `src/app/components/supplier/AvailabilityCalendar.tsx` | Monthly calendar, click to toggle available/unavailable |
| `convex/productAddons.ts` | CRUD: listByProductId, create, update, remove |
| `convex/aiSupplier.ts` | Stub actions: generateMarketingDescription, cleanProductImage |

### Modify Files
| File | Changes |
|------|---------|
| `convex/supplierProducts.ts` | Extend `create` and `update` args to accept all 4-tier pricing fields, volume pricing, timing, equipment, capacity, location, cancellationTerms that exist in schema but aren't in mutation args yet |
| `convex/supplierAvailability.ts` | Add `checkAvailability(supplierId, date)` query |
| `convex/suppliers.ts` | Extend `update` args to accept websiteUrl, facebookUrl, operatingHours, seasonalAvailability, defaultMarginPercent |
| `src/app/routes.ts` | Replace `SupplierProductsPlaceholder` → `MyProducts`, `SupplierAvailabilityPlaceholder` → `AvailabilityCalendar`, `SupplierProfilePlaceholder` → `SupplierProfile` |

### Key Implementation Notes
- **MyProducts**: `useAuth().profile.supplierId` → `useQuery(api.supplierProducts.listBySupplierId)`. Card shows first image, name, listPrice, grossTime/netTime, capacity. Add/edit opens SupplierProductEditor
- **SupplierProductEditor**: Sliding drawer (follow existing `ProductEditor.tsx` pattern). react-hook-form. Sections: basic info, 4-tier pricing (list/direct/producer/client), volume pricing (threshold + per-tier), timing (gross/net minutes), equipment (dynamic string list), capacity, addons (inline CRUD via `productAddons`), image gallery (`useImageUpload`), AI buttons (stub calls to aiSupplier)
- **SupplierProfile**: Form querying `suppliers.get`, saves via `suppliers.update`. Category multi-select from `SUPPLIER_CATEGORIES` (max 3). Region multi-select from `OPERATING_REGIONS`. Reuse `SupplierLocationMap` for address/lat/lng
- **AvailabilityCalendar**: Monthly grid. `listByMonth` query. Click date → `setAvailability` mutation. Green/red indicators. Month nav
- **productAddons.ts**: Follow same pattern as supplierProducts.ts. Schema already has `productAddons` table with: productId, name, description, listPrice, directPrice, producerPrice, unit
- **aiSupplier.ts**: Use `action` from `"./_generated/server"`. Stubs return placeholder Hebrew text

### Existing Code to Reuse
- `src/app/components/ProductEditor.tsx` — drawer pattern, image upload flow
- `src/app/components/hooks/useImageUpload.ts` — image upload
- `src/app/components/SupplierLocationMap.tsx` — map picker
- `src/app/components/constants/supplierConstants.ts` — categories, regions
- `src/app/components/FormField.tsx` — form components

---

## Agent 2: Plan 04 — Supplier Documents & Compliance

### New Files
| File | Purpose |
|------|---------|
| `src/app/components/supplier/MyDocuments.tsx` | Document checklist with predefined types, upload, expiry tracking, "אין לי" button |
| `convex/crons.ts` | Daily crons: document expiry check (6:00 UTC) and reminders (7:00 UTC) |

### Modify Files
| File | Changes |
|------|---------|
| `convex/schema.ts` | Add to `supplierDocuments`: `documentType` (optional string), `storageId` (optional string), `acknowledged` (optional boolean), `acknowledgedAt` (optional number), `lastReminderAt` (optional number), `reminderCount` (optional number) |
| `convex/supplierDocuments.ts` | Add: `checkExpiry` (internalMutation), `sendReminders` (internalMutation), `checkInsuranceCompliance` (query by supplierId), `markAcknowledgedMissing` (mutation). Extend `create` args to accept new fields |
| `src/app/components/SupplierDetail.tsx` | Add compliance badge to documents tab header |
| `src/app/routes.ts` | Replace `SupplierDocumentsPlaceholder` → `MyDocuments` |

### Key Implementation Notes
- **Document types constant** (in MyDocuments):
  - `third_party_insurance` — "ביטוח צד ג'" (post-deal mandatory)
  - `employer_insurance` — "ביטוח חבות מעבידים" (post-deal mandatory)
  - `business_license` — "רישיון עסק" (recommended)
  - `kosher_cert` — "תעודת כשרות" (food category only, yes/no toggle)
- **Status colors**: green (>30 days), yellow (≤30 days), red (expired), gray/warning (missing)
- **"אין לי" flow**: calls `markAcknowledgedMissing` → sets acknowledged=true, acknowledgedAt=now. Non-blocking. Cron sends reminders every 2 days
- **Kosher cert**: only shown if supplier category includes "food" (check via `suppliers.get` query). Yes/no toggle — if yes, prompt upload
- **checkInsuranceCompliance query**: returns `{ hasThirdParty: boolean, hasEmployer: boolean, compliant: boolean }`
- **crons.ts**: Use `cronJobs()` from `"convex/server"`. `checkExpiry` at 6:00 UTC (9:00 Israel), `sendReminders` at 7:00 UTC (10:00 Israel). Both call `internalMutation` from supplierDocuments
- **SupplierDetail.tsx**: Add small compliance badge next to "מסמכים" tab — green checkmark if compliant, red warning if not

### Existing Code to Reuse
- `src/app/components/hooks/useImageUpload.ts` — for document file upload
- `src/app/components/supplierNotes.ts` — already computes doc status notes, align with this

---

## Agent 3: Plan 05 — Supplier Public Profile & Promotions

### New Files
| File | Purpose |
|------|---------|
| `src/app/components/supplier/SupplierPreview.tsx` | "כך אני נראה" preview with producer/client view toggle, missing fields nudge |
| `src/app/components/supplier/SupplierPromotions.tsx` | Manage time-limited promotions (list, create, edit, deactivate) |
| `src/app/components/supplier/SupplierRatings.tsx` | View ratings 1-5 (average + individual list, read-only) |
| `src/app/components/supplier/PublicSupplierProfile.tsx` | Public page at `/supplier/:id/public`, no auth, list price only |

### Modify Files
| File | Changes |
|------|---------|
| `convex/supplierPromotions.ts` | Add `listActive` query (all active + not expired promotions, optionally by supplierId) |
| `convex/supplierRatings.ts` | Add `getAverageRating(supplierId)` query returning `{ average, count }` |
| `src/app/App.tsx` | Add `/supplier/:id/public` to PUBLIC_PATTERNS regex array and publicRouter |
| `src/app/components/SupplierSearch.tsx` | Add promotion badge on supplier cards with active promotions |
| `src/app/routes.ts` | Add routes: `preview`, `promotions`, `ratings` to supplier router |

### Key Implementation Notes
- **SupplierPreview**: Queries all supplier data (products, docs, promotions, ratings) directly from Convex. No import dependency on Agent 1/2 components. Toggle shows producer view (producerPrice, compliance) vs client view (listPrice, marketing descriptions). Bottom section lists missing fields with links to `/profile`, `/products`
- **SupplierPromotions**: List with status badges (active/upcoming/expired). Modal form: title, description, product dropdown (from supplierProducts), discount % or amount (mutually exclusive), date range. react-hook-form
- **SupplierRatings**: Read-only. Star display + average. Individual ratings list with stars, comment, date
- **PublicSupplierProfile**: No auth. Uses `useParams()` for supplier ID (legacyId via `getByLegacyId`). Shows: name, categories, regions, marketing description, product cards (listPrice ONLY), active promotions, average rating. Clean public layout
- **listActive query**: Filter `isActive === true` AND `expiresAt > Date.now()`. Return with id mapping
- **getAverageRating**: Compute from all ratings for supplier. Return `{ average: number, count: number }`
- **SupplierSearch badges**: Query `listActive`, build a Set of supplierIds with promotions, show "מבצע פעיל" tag on matching cards

### Existing Code to Reuse
- `convex/supplierPromotions.ts` — already has listBySupplier, create, update, deactivate
- `convex/supplierRatings.ts` — already has listBySupplier, create
- `src/app/components/SupplierSearch.tsx` — existing search UI to add badges to

---

## Execution Status: COMPLETED

All 3 agents ran in parallel using git worktrees. Changes merged into main. All verification checks pass:
- `bun lint` — clean
- `bun tsc` — clean
- `bun ultracite` — clean

### Files Created (13 total)
- `src/app/components/supplier/MyProducts.tsx`
- `src/app/components/supplier/SupplierProductEditor.tsx`
- `src/app/components/supplier/SupplierProfile.tsx`
- `src/app/components/supplier/AvailabilityCalendar.tsx`
- `src/app/components/supplier/MyDocuments.tsx`
- `src/app/components/supplier/SupplierPreview.tsx`
- `src/app/components/supplier/SupplierPromotions.tsx`
- `src/app/components/supplier/SupplierRatings.tsx`
- `src/app/components/supplier/PublicSupplierProfile.tsx`
- `convex/productAddons.ts`
- `convex/aiSupplier.ts`
- `convex/crons.ts`

### Files Modified (10 total)
- `convex/supplierProducts.ts` — extended CRUD args
- `convex/supplierAvailability.ts` — added checkAvailability
- `convex/suppliers.ts` — extended update args
- `convex/schema.ts` — added compliance fields to supplierDocuments
- `convex/supplierDocuments.ts` — added compliance queries/mutations
- `convex/supplierPromotions.ts` — added listActive query
- `convex/supplierRatings.ts` — added getAverageRating query
- `src/app/routes.ts` — merged all 3 agents' route changes
- `src/app/App.tsx` — added public supplier profile route
- `src/app/components/SupplierDetail.tsx` — added compliance badge
- `src/app/components/SupplierSearch.tsx` — added promotion badge
