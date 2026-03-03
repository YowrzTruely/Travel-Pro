# Plan 13 — Cross-System Polish & Stretch Features

**Phase:** 5 (Integration & Polish)
**Depends on:** All previous plans
**Blocks:** None

---

## Goal

Implement remaining spec features that span multiple modules: PDF export, supplier recommendations, duplicate detection, travel time calculation, Google Calendar sync, and general UX polish.

---

## Features

### 1. PDF Export

**Priority:** High — requested by spec in QuoteEditor

Generate a branded PDF of the client quote (same content as `/quote/:id` but downloadable).

**Approach:** Use a Convex action (server-side) with a PDF library.

**File: `convex/pdfExport.ts`** (new — Convex action)

```ts
export const generateQuotePdf = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    // Fetch project, quote items, timeline from DB
    // Use @react-pdf/renderer or jsPDF to generate PDF
    // Upload to Convex file storage
    // Return storage URL
  },
});
```

**Frontend:**
- "ייצא PDF" button in QuoteEditor calls the action
- Shows loading state
- Downloads the generated file

**Libraries:** `@react-pdf/renderer` (React-based, Hebrew RTL support) or `jspdf` + `jspdf-autotable`.

### 2. Supplier Recommendation Engine

**Priority:** Medium — spec mentions "find 3 alternatives"

When building a quote, suggest suppliers based on:
- Same category as the item type
- Matching region
- Good rating (≥4.0)
- Valid documents (verification status)
- Available on the requested date (if availability data exists)

**File: `convex/suppliers.ts`** (extend)

```ts
recommend: query({
  args: {
    category: v.string(),
    region: v.optional(v.string()),
    date: v.optional(v.string()),
    excludeIds: v.optional(v.array(v.id("suppliers"))),
    limit: v.optional(v.number()),  // default 3
  },
  handler: async (ctx, args) => {
    // Query suppliers by category
    // Filter by region if provided
    // Sort by rating desc
    // Check availability if date provided
    // Exclude already-used suppliers
    // Return top N
  },
})
```

**Frontend:** Show recommendation chips in SupplierSearch and AlternativesModal.

### 3. Duplicate Detection

**Priority:** Medium — for supplier imports and lead intake

Detect potential duplicates when creating suppliers or leads:

**File: `convex/suppliers.ts`** (extend)

```ts
findDuplicates: query({
  args: { name: v.string(), phone: v.optional(v.string()), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Search for suppliers with similar name (fuzzy match)
    // Or matching phone/email (exact)
    // Return potential duplicates with similarity score
  },
})
```

**Frontend integration:**
- In ImportWizard: check for duplicates during preview step, show warnings
- In supplier creation form: real-time duplicate check as user types
- In NewLeadModal: check against existing leads and clients

### 4. Travel Time Calculation

**Priority:** Low — nice-to-have

Calculate travel time between supplier locations for timeline planning.

**Approach:** Use a free geocoding/routing API (OSRM or Google Directions).

**File: `convex/travelTime.ts`** (new — Convex action)

```ts
export const calculateTravelTime = action({
  args: {
    fromLat: v.number(), fromLng: v.number(),
    toLat: v.number(), toLng: v.number(),
  },
  handler: async (ctx, args) => {
    // Call OSRM or similar API
    // Return { distanceKm, durationMinutes }
  },
})
```

**Frontend:** Show travel time between consecutive timeline items in QuoteEditor.

### 5. Google Calendar Sync

**Priority:** Low — stretch goal

Sync calendar events with Google Calendar.

**Approach:** OAuth2 with Google Calendar API via Convex action.

**File: `convex/googleCalendar.ts`** (new — Convex action)

```ts
export const syncToGoogle = action({
  args: { calendarEventId: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    // Fetch event from DB
    // Call Google Calendar API to create/update event
    // Store googleEventId for future updates
  },
})
```

**Prerequisites:**
- Google OAuth setup
- Token storage per user
- Settings page integration for connecting Google account

### 6. Activity Log (Admin)

**Priority:** Medium — part of admin dashboard

Log important system events for admin audit trail.

**File: `convex/activityLog.ts`** (new)

```ts
// Table
activityLog: defineTable({
  userId: v.optional(v.id("users")),
  action: v.string(),       // "supplier_created", "project_approved", etc.
  entityType: v.string(),   // "supplier", "project", "lead", etc.
  entityId: v.string(),
  details: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_createdAt", ["createdAt"])
  .index("by_userId", ["userId"])
  .index("by_entityType", ["entityType"])
```

**Admin page: `src/app/components/admin/ActivityLog.tsx`** (new)

Table view with filters (user, action type, date range).

### 7. Settings Page

**Priority:** Medium — currently a placeholder

**File: `src/app/components/SettingsPage.tsx`** (rewrite)

```
┌─────────────────────────────────────────────────────┐
│  הגדרות                                              │
│                                                     │
│  [Tab: פרופיל]                                       │
│  שם, אימייל, טלפון, תמונת פרופיל, שם חברה          │
│                                                     │
│  [Tab: התראות]                                       │
│  Enable/disable notification types                   │
│  Email notifications on/off                          │
│                                                     │
│  [Tab: חשבון]                                        │
│  שנה סיסמה                                           │
│                                                     │
│  [Tab: חיבורים] (stretch)                             │
│  Google Calendar: [חבר / מנותק]                      │
└─────────────────────────────────────────────────────┘
```

### 8. Error Boundary Enhancement

**File: `src/app/components/ErrorBoundary.tsx`** (modify)

Currently exists. Enhance with:
- Better Hebrew error messages
- "חזור לדף הבית" button
- Error logging (optional — to activity log)

### 9. Responsive Polish

Ensure mobile-friendly views for:
- Supplier portal (all pages)
- Client quote page (already mobile-first)
- Dashboard (card stacking on mobile)

Use existing `useIsMobile()` hook throughout.

---

## New Files

| File | Type |
|------|------|
| `convex/pdfExport.ts` | Backend action |
| `convex/travelTime.ts` | Backend action |
| `convex/googleCalendar.ts` | Backend action (stretch) |
| `convex/activityLog.ts` | Backend |
| `src/app/components/admin/ActivityLog.tsx` | Page |

## Modified Files

| File | Changes |
|------|---------|
| `convex/suppliers.ts` | Add recommend, findDuplicates queries |
| `convex/schema.ts` | Add activityLog table |
| `src/app/components/QuoteEditor.tsx` | PDF export button, travel time display |
| `src/app/components/SettingsPage.tsx` | Full rewrite with tabs |
| `src/app/components/ErrorBoundary.tsx` | Hebrew messages, better UX |
| `src/app/components/ImportWizard.tsx` | Duplicate detection in preview |
| `src/app/components/SupplierSearch.tsx` | Show recommendations |

---

## Priority Summary

| Feature | Priority | Effort |
|---------|----------|--------|
| PDF Export | High | Medium |
| Supplier Recommendations | Medium | Low |
| Duplicate Detection | Medium | Medium |
| Activity Log | Medium | Low |
| Settings Page | Medium | Low |
| Travel Time | Low | Medium |
| Google Calendar Sync | Low | High |
| Responsive Polish | Medium | Medium |
