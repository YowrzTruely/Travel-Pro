# Plan 15 — Cross-System Polish

**Phase:** 7 (Post-MVP & Stretch)
**Depends on:** All previous plans
**Blocks:** None
**PRD refs:** §8 (UX Principles), §9 (Technical Requirements)

---

## Goal

Implement remaining cross-cutting features that span multiple modules: supplier recommendation engine, duplicate detection, travel time calculation, responsive polish (mobile-first per PRD), settings enhancements, AI integrations (Gemini Flash for marketing descriptions, trip names, invoice analysis), payment system integration decision, and general UX improvements.

---

## Features

### 1. Supplier Recommendation Engine

**Priority:** Medium — supports quote building efficiency

When building a quote, suggest suppliers based on:
- Same category as the item type
- Matching region (11 regions)
- Good rating (≥4.0)
- Valid documents (compliance status)
- Available on the requested date
- Active promotions (bonus)

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
    // Sort by: rating desc, compliance status, promotion active
    // Check availability if date provided
    // Exclude already-used suppliers
    // Return top N with relevance score
  },
})
```

**Frontend:** Show recommendation chips in SupplierSearch and AlternativesModal.

### 2. Duplicate Detection

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
- Warning UI: "ספק דומה כבר קיים: {name} ({phone}). להמשיך?"

### 3. Travel Time Calculation

**Priority:** Low — nice-to-have for timeline planning

Calculate travel time between supplier locations for timeline.

**File: `convex/travelTime.ts`** (new — Convex action)

```ts
export const calculateTravelTime = action({
  args: {
    fromLat: v.number(), fromLng: v.number(),
    toLat: v.number(), toLng: v.number(),
  },
  handler: async (ctx, args) => {
    // Call OSRM (free) or Google Directions API
    // Return { distanceKm, durationMinutes }
  },
})
```

**Frontend:** Show travel time between consecutive timeline items in QuoteEditor:
```
09:30 ━━━━ סיור ביקב ━━━━ 12:00
      🚗 15 דק (22 ק"מ)
12:15 ━━━━ ארוחת צהריים ━━━━ 14:00
```

### 4. Responsive Polish — Mobile-First (PRD §8)

Per PRD: "Mobile-first — כל הפלטפורמה Web עובדת מהטלפון"

Priority areas:
1. **Field Operations** — already mobile-first (Plan 11)
2. **Supplier portal** — used on phones by suppliers
3. **Client quote page** — viewed on phones by clients
4. **Producer dashboard** — card stacking on mobile
5. **CRM pipeline** — horizontal scroll on mobile

Use existing `useIsMobile()` hook from `src/app/components/ui/use-mobile.ts`.

**Key patterns:**
- Stack cards vertically on mobile
- Bottom-dock action buttons
- Collapsible sidebar → hamburger menu
- Touch-friendly targets (min 44px)
- Swipe gestures where appropriate

### 5. Settings Page Enhancement

**File: `src/app/components/SettingsPage.tsx`** (rewrite)

```
┌─────────────────────────────────────────────────────┐
│  הגדרות                                              │
│                                                     │
│  [Tab: פרופיל]                                       │
│  שם, אימייל, טלפון, תמונת פרופיל, שם חברה          │
│                                                     │
│  [Tab: התראות]                                       │
│  Enable/disable notification types per channel       │
│  WhatsApp notifications: on/off                      │
│  SMS notifications: on/off                           │
│  Email notifications: on/off                         │
│                                                     │
│  [Tab: תמחור]                                        │
│  Default margin percentage (currently 20%)           │
│  Currency settings                                   │
│                                                     │
│  [Tab: חשבון]                                        │
│  Change password                                     │
│  Export data                                         │
└─────────────────────────────────────────────────────┘
```

### 6. Progressive Disclosure (PRD §8)

Per PRD: "Progressive disclosure — ספק רואה רק מה שרלוונטי לרמת המנוי שלו"

- Supplier sees features based on their profile completion stage
- Stage 1: basic product management only
- Stage 2: full product features, promotions, ratings
- Stage 3: all features including compliance dashboard
- Grayedout features show: "השלם את הפרופיל שלך כדי לפתוח תכונה זו"

### 7. Error Boundary Enhancement

**File: `src/app/components/ErrorBoundary.tsx`** (modify)

- Better Hebrew error messages
- "חזור לדף הבית" button
- Error logging to activity log

### 8. AI Integration Summary (PRD §9)

Per PRD §9: "AI: Gemini Flash (תיאורים שיווקיים, שם טיול, ניתוח חשבוניות)"

AI (Gemini Flash) is used across the platform for:
1. **Marketing descriptions** — auto-generate from supplier website/Facebook URL (Plan 03, §3.5)
2. **Trip name generation** — suggest creative trip names based on activities + region (Plan 06, §4.2)
3. **Invoice analysis** — extract data from uploaded invoices (amounts, dates, supplier info) for Plan 09
4. **Image cleanup** — clean product images to look professional (Plan 03, §3.1)
5. **AI onboarding** — interactive Q&A to help suppliers complete stage 2 profile (Plan 03, §3.1)

### 9. Payment System Integration (PRD §9)

Per PRD §9: "היסגרות על מערכת תשלומים (אם זה Polar, Cardcom, או אחר) - לדבר עם ערן בנוגע לפוסט פרודקשין או בהשקה."

**Decision required:** Which payment provider to integrate:
- **Polar** — modern, developer-friendly
- **Cardcom** — popular in Israel, Hebrew-native
- **Other** — to be discussed with Eran

**Timing:** Can be integrated post-production or at launch. Not blocking MVP development.

**Scope:** Supplier commission collection (retainer ~50-150 NIS/month per PRD business model).

### 10. Activity Log (Admin)

**File: `convex/activityLog.ts`** (new)

```ts
activityLog: defineTable({
  userId: v.optional(v.id("users")),
  action: v.string(),
  entityType: v.string(),
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

---

## New Files

| File | Type |
|------|------|
| `convex/travelTime.ts` | Backend action |
| `convex/activityLog.ts` | Backend |
| `src/app/components/admin/ActivityLog.tsx` | Page |

## Modified Files

| File | Changes |
|------|---------|
| `convex/suppliers.ts` | Add recommend, findDuplicates queries |
| `convex/schema.ts` | Add activityLog table |
| `src/app/components/QuoteEditor.tsx` | Travel time display between items |
| `src/app/components/SettingsPage.tsx` | Full rewrite with tabs |
| `src/app/components/ErrorBoundary.tsx` | Hebrew messages, better UX |
| `src/app/components/ImportWizard.tsx` | Duplicate detection in preview |
| `src/app/components/SupplierSearch.tsx` | Show recommendations |

---

## Priority Summary

| Feature | Priority | Effort |
|---------|----------|--------|
| Supplier Recommendations | Medium | Low |
| Duplicate Detection | Medium | Medium |
| Responsive Polish | High | Medium |
| Settings Page | Medium | Low |
| Progressive Disclosure | Medium | Medium |
| AI Integration (Gemini Flash) | High | Medium |
| Payment System Integration | High | Medium |
| Activity Log | Medium | Low |
| Travel Time | Low | Medium |
| Error Boundary | Low | Low |
