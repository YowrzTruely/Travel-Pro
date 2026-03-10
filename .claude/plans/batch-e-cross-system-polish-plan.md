# Plan 15 — Cross-System Polish (Batch E)

## Status: COMPLETE (2026-03-10)

All phases implemented and verified. `bun lint`, `bun tsc`, `bun ultracite` pass clean.

## Context

This is the final batch (E) of the MVP implementation. All previous batches (A–D) are complete: supplier module, proposal builder, CRM, field ops, dashboards, notifications, and digital assets. This batch adds cross-cutting polish: supplier recommendations, duplicate detection, AI stubs, progressive disclosure, settings, activity log, and responsive fixes.

---

## Implementation Order

**Phase 1 — Schema + Backend** (sequential, schema first)
1. Schema changes (activityLog table + users fields)
2. Activity log backend (`convex/activityLog.ts`)
3. Supplier recommendation + duplicate detection queries (`convex/suppliers.ts`)
4. AI stubs (`convex/aiSupplier.ts`)
5. Users updateProfile extension (`convex/users.ts`)

**Phase 2 — Frontend features** (parallel agents)
- Agent 1: Settings page rewrite
- Agent 2: Progressive disclosure (FeatureGate) + supplier nav gating
- Agent 3: Supplier recommendation chips + duplicate detection UI

**Phase 3 — Responsive polish** (sequential)
- Mobile audit + fixes across key pages

**Phase 4 — Admin + docs**
- Activity log admin page + route
- Payment system decision doc

---

## Phase 1: Schema + Backend

### 1.1 Schema changes — `convex/schema.ts`

**Add to users table** (after `createdAt` field, line ~37):
```ts
notificationPreferences: v.optional(v.object({
  inApp: v.optional(v.boolean()),
  email: v.optional(v.boolean()),
  sms: v.optional(v.boolean()),
  whatsapp: v.optional(v.boolean()),
})),
defaultMarginPercent: v.optional(v.number()),
```

**Add new table** (after `supplierRatings`, before closing `});` at line 707):
```ts
// ─── Activity Log ───
activityLog: defineTable({
  userId: v.optional(v.id("users")),
  action: v.string(),
  entityType: v.string(),
  entityId: v.string(),
  details: v.optional(v.string()),
  metadata: v.optional(v.any()),
  createdAt: v.number(),
})
  .index("by_createdAt", ["createdAt"])
  .index("by_userId", ["userId"])
  .index("by_entityType", ["entityType"]),
```

### 1.2 Activity log — NEW `convex/activityLog.ts`

Functions:
- `log` mutation: insert entry with `createdAt: Date.now()`
- `list` query: paginated, filters by `userId?`, `entityType?`, `action?`, date range. Order by `createdAt` desc. Returns `{ ...doc, id: doc._id }`
- `listByEntity` query: filter by `entityType` + `entityId`

### 1.3 Supplier queries — extend `convex/suppliers.ts`

**Add `findAlternatives` query** (this is what `AlternativesModal.tsx` already calls via `(api.suppliers as any).findAlternatives`):
- Args: `category`, `region?`, `date?`, `excludeId?`, `limit?` (default 6)
- Filter suppliers by category index, exclude current, filter by region if provided
- Score by: rating weight, verification bonus, active promotions (join `supplierPromotions`)
- If date provided, check `supplierAvailability` table for conflicts
- Sort by score desc, return top N

**Add `recommend` query** (for SupplierSearch chips):
- Args: `category?`, `region?`, `date?`, `excludeIds?`, `limit?` (default 3)
- Filter: rating ≥ 4.0, valid docs (join `supplierDocuments` for non-expired), active promotions
- Return with reason string (e.g., "דירוג גבוה", "מבצע פעיל")

**Add `findDuplicates` query**:
- Args: `name`, `phone?`, `email?`
- Collect all suppliers, score each: exact phone match (+100), exact email match (+100), exact name match (+100), name contains/substring (+60)
- `normalizePhone` helper: strip dashes, spaces, +972 prefix
- Return matches with score ≥ 40, sorted by score desc, limit 5

### 1.4 AI stubs — extend `convex/aiSupplier.ts`

Add after existing stubs:
- `generateTripName` action: args `activities: string[], region?, participants?` → returns placeholder Hebrew string
- `analyzeInvoice` action: args `fileId: string` → returns `{ amount: null, date: null, supplierName: null, invoiceNumber: null, confidence: 0, message: "..." }`

### 1.5 Users — extend `convex/users.ts`

Extend `updateProfile` mutation args to accept:
- `notificationPreferences: v.optional(v.object({...}))`
- `defaultMarginPercent: v.optional(v.number())`

---

## Phase 2: Frontend Features (3 parallel agents)

### 2.1 Settings Page — NEW `src/app/components/settings/SettingsPage.tsx`

Replace placeholder export. Use `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` from ui.

**Tab 1 — פרופיל**: name, email (readonly), phone, company, avatar upload (use `useImageUpload` hook). Save via `api.users.updateProfile`.

**Tab 2 — התראות**: Switch toggles for inApp/email/sms/whatsapp. Save to `notificationPreferences`.

**Tab 3 — תמחור** (producer only): Default margin % input. Save to `defaultMarginPercent`.

**Tab 4 — חשבון**: Change password form (stub — log action for now). Logout button.

**Route change** in `src/app/routes.ts`:
- Change import: `import { SettingsPage } from "./components/settings/SettingsPage"`
- Keep `SettingsPage` export in `PlaceholderPage.tsx` but remove it (or re-export from new file for backward compat)

### 2.2 Progressive Disclosure — NEW `src/app/components/supplier/FeatureGate.tsx`

Wrapper component:
- Props: `children`, `requiredStage: "stage1"|"stage2"|"stage3"`, `featureName: string`
- Reads supplier's `profileCompletionStage` via `useQuery(api.suppliers.get, { id: supplierId })` where `supplierId` comes from current user
- If stage insufficient, render locked overlay: gray bg, lock icon, "השלם את הפרופיל שלך כדי לפתוח תכונה זו", link to `/profile`

**Stage mapping:**
- stage1: Products, Profile, Documents (always accessible)
- stage2: Promotions, Ratings, Availability, Preview, Requests
- stage3: Settings/compliance (future)

**Integration** — wrap content in these supplier pages:
- `SupplierPromotions.tsx` → `<FeatureGate requiredStage="stage2" featureName="מבצעים">`
- `SupplierRatings.tsx` → `<FeatureGate requiredStage="stage2" featureName="דירוגים">`
- `AvailabilityCalendar.tsx` → `<FeatureGate requiredStage="stage2" featureName="זמינות">`
- `SupplierPreview.tsx` → `<FeatureGate requiredStage="stage2" featureName="תצוגה מקדימה">`

**Nav gating** in `Layout.tsx`: Add lock icon + gray text for stage-locked supplier nav items.

### 2.3 Recommendation + Duplicate Detection UI

**`AlternativesModal.tsx`**: Remove `(api.suppliers as any).findAlternatives` cast → use `api.suppliers.findAlternatives` directly.

**`SupplierSearch.tsx`** (in SupplierBank): Add "מומלצים" section when search is empty. Show chips from `useQuery(api.suppliers.recommend, { limit: 3 })` with supplier name, rating stars, reason badge.

**`SupplierBank.tsx`** (add supplier modal): Add debounced `useQuery(api.suppliers.findDuplicates, { name, phone })` with `"skip"` when name < 2 chars. Show yellow warning banner: "ספק דומה כבר קיים: {name} ({phone}). להמשיך?"

**`ImportWizard.tsx`**: Enhance existing duplicate detection (currently exact name match only at ~line 352). Add phone/email matching and substring name matching in the client-side preview step.

---

## Phase 3: Responsive Polish

Audit + fix these files using `useIsMobile()` hook:

| File | Changes |
|------|---------|
| `FieldOperationsHQ.tsx` | Bottom-dock action buttons, larger touch targets (min-h-[44px]) |
| `ClientQuote.tsx` | Full-width images on mobile, fixed bottom action bar, compact timeline |
| `ProducerDashboard.tsx` | 2-col stat grid on mobile (from 4-col), full-width cards |
| `LeadsPage.tsx` | Horizontal scroll kanban with `-webkit-overflow-scrolling: touch`, or tab-based stage view on mobile |
| Supplier portal pages (`MyProducts.tsx`, `SupplierPromotions.tsx`, `AvailabilityCalendar.tsx`) | 1-col product grid, stacked cards, larger calendar targets |

**Global patterns to apply:**
- `min-h-[44px] min-w-[44px]` on all interactive elements
- `fixed bottom-0 inset-x-0` action bars on mobile
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` responsive grids

---

## Phase 4: Admin + Docs

### 4.1 Activity Log Page — NEW `src/app/components/admin/ActivityLog.tsx`

- Filter bar: entityType dropdown, action type dropdown, date range
- Table using `Table` component from ui: timestamp, user, action (Hebrew label), entity, details
- Query: `useQuery(api.activityLog.list, { ...filters })`
- Hebrew action labels: `{ create: "יצירה", update: "עדכון", delete: "מחיקה", archive: "ארכיון", import: "ייבוא" }`

**Route** in `src/app/routes.ts`: Add `{ path: "activity", Component: ActivityLog }` to admin router.
**Nav** in `Layout.tsx`: Add "יומן פעילות" item for admin sidebar.

### 4.2 Payment Decision Doc — NEW `docs/decisions/payment-system.md`

Document: Polar vs Cardcom vs other. Pricing: 50-150 NIS/month retainer. Status: pending Eran discussion. Timeline: post-MVP or launch.

---

## Files Summary

### New Files (6)
| File | Purpose |
|------|---------|
| `convex/activityLog.ts` | Activity log backend |
| `src/app/components/admin/ActivityLog.tsx` | Admin activity log page |
| `src/app/components/supplier/FeatureGate.tsx` | Progressive disclosure wrapper |
| `src/app/components/settings/SettingsPage.tsx` | Full settings page with tabs |
| `docs/decisions/payment-system.md` | Payment system decision doc |

### Modified Files (13)
| File | Changes |
|------|---------|
| `convex/schema.ts` | Add `activityLog` table, extend `users` with notification prefs + margin |
| `convex/suppliers.ts` | Add `findAlternatives`, `recommend`, `findDuplicates` queries |
| `convex/aiSupplier.ts` | Add `generateTripName`, `analyzeInvoice` stubs |
| `convex/users.ts` | Extend `updateProfile` args |
| `src/app/routes.ts` | New settings import, admin activity route |
| `src/app/components/Layout.tsx` | Admin nav (activity log), supplier nav gating |
| `src/app/components/PlaceholderPage.tsx` | Remove `SettingsPage` export |
| `src/app/components/AlternativesModal.tsx` | Remove `as any` cast |
| `src/app/components/SupplierSearch.tsx` | Add recommendation chips |
| `src/app/components/SupplierBank.tsx` | Duplicate warning in create form |
| `src/app/components/ImportWizard.tsx` | Enhanced fuzzy duplicate detection |
| `src/app/components/supplier/*.tsx` (4 files) | Wrap in FeatureGate |
| Various responsive files (5+) | Touch targets, mobile layouts |

---

## Verification

After all changes, run:
```bash
bun lint && bun tsc && bun ultracite
```

Manual testing checklist:
1. `npx convex dev` — schema deploys without errors
2. Supplier recommendation: search suppliers in quote editor, see recommendation chips
3. Duplicate detection: create supplier with existing name/phone, see warning
4. Settings: all 4 tabs render, profile save works
5. Progressive disclosure: supplier with stage1 sees locked promotions/ratings
6. Activity log: admin sees log page, can filter
7. Mobile: test key pages at 375px viewport width
8. AI stubs: no errors when called (return placeholder values)
