# Plan 05 — Supplier Public Profile & Promotions

**Phase:** 2 (Supplier Module — PRD Priority #1)
**Depends on:** Plan 03 (Supplier Profile & Products), Plan 04 (Documents & Compliance)
**Blocks:** None directly
**PRD refs:** §3.5 (Public Profile), §3.2 (Categories)

---

## Goal

Build the supplier public profile page with "how I look to producers/clients" preview mode, promotions board (time-limited deals visible in filtering), star rating display (1-5), and public profile page — all designed to motivate suppliers to complete their profiles.

---

## Current State

- `SupplierDetail.tsx` exists as producer-facing supplier view (4 tabs)
- No supplier-facing preview of how they appear to others
- No promotions system
- No ratings display
- No public-facing supplier profile page

---

## Implementation

### 1. "How I Look" Preview Mode (PRD §3.5)

**File: `src/app/components/supplier/SupplierPreview.tsx`** (new)

Preview page showing the supplier exactly how they appear to producers and clients:

```
┌─────────────────────────────────────────────────────┐
│  כך אני נראה בעיני מפיק / לקוח                       │
│                                                     │
│  [Toggle: תצוגת מפיק / תצוגת לקוח]                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ [לוגו / תמונה ראשית]                        │    │
│  │                                             │    │
│  │ יקב הגולן                                   │    │
│  │ ⭐ 4.5 (23 דירוגים)                         │    │
│  │ אטרקציות ופעילויות | גליל עליון, כרמל       │    │
│  │                                             │    │
│  │ ── מוצרים ──                                │    │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐     │    │
│  │ │ [תמונה]  │ │ [תמונה]  │ │ [תמונה]  │     │    │
│  │ │ סיור     │ │ סדנת יין │ │ ארוחה    │     │    │
│  │ │ ₪120/אדם │ │ ₪90/אדם  │ │ ₪150/אדם │     │    │
│  │ └──────────┘ └──────────┘ └──────────┘     │    │
│  │                                             │    │
│  │ ── מבצעים פעילים ──                         │    │
│  │ 🔥 10% הנחה על סיורים בימי שני-רביעי       │    │
│  │    בתוקף עד 15/04/2026                     │    │
│  │                                             │    │
│  │ ── מסמכים ──                                │    │
│  │ ✅ ביטוח צד ג' | ✅ רישיון עסק              │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [💡 שדות ריקים? מלא אותם כדי לשפר את הפרופיל!]    │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🟡 חסר: תמונות מוצר (3)                     │    │
│  │ 🟡 חסר: תיאור שיווקי                        │    │
│  │ 🟡 חסר: שעות פעילות                          │    │
│  │ [השלם פרופיל →]                              │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

**Key feature:** "Missing fields" nudge at bottom motivates suppliers to complete their profile. Shows exactly what's missing and links to the relevant editing section.

**Producer vs Client view toggle:**
- Producer view: shows מחיר מפיק pricing, compliance status
- Client view: shows מחיר מחירון only, marketing descriptions, no compliance info

### 2. Promotions Board (PRD §3.5)

**File: `src/app/components/supplier/SupplierPromotions.tsx`** (new)

Supplier-facing page to manage their time-limited promotions:

```
┌─────────────────────────────────────────────────────┐
│  המבצעים שלי                         [+ מבצע חדש]   │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ 🔥 10% הנחה על סיורים               │            │
│  │ ימי שני-רביעי בלבד                   │            │
│  │ תקף: 01/03 - 15/04/2026            │            │
│  │ סטטוס: ✅ פעיל                      │            │
│  │ [ערוך] [השהה] [מחק]                 │            │
│  ├─────────────────────────────────────┤            │
│  │ 🎁 סדנת יין חינם עם הזמנת סיור      │            │
│  │ עד 30/03/2026                       │            │
│  │ סטטוס: ⏰ מתחיל בקרוב               │            │
│  │ [ערוך] [מחק]                         │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

**New Promotion Modal:**
```
┌────────────────────────────────────┐
│  מבצע חדש                          │
│                                    │
│  כותרת: ___________               │
│  תיאור: ___________               │
│  מוצר (אופציונלי): [dropdown]     │
│  אחוז הנחה: ____                  │
│  או סכום הנחה: ₪ ____             │
│  תאריך התחלה: [date picker]       │
│  תאריך סיום: [date picker]        │
│                                    │
│  [פרסם מבצע]  [ביטול]             │
└────────────────────────────────────┘
```

**Important:** Promotions do NOT change the fixed price. They are displayed alongside products during filtering/browsing (per PRD §3.5: "מבצעים יראו בסינון").

**Backend: `convex/supplierPromotions.ts`** (new)

```ts
listBySupplier    — all promotions for a supplier
listActive        — active promotions across all suppliers (for filtering)
create            — create promotion
update            — edit promotion
deactivate        — set isActive=false
```

### 3. Star Rating Display (PRD §3.5)

**File: `src/app/components/supplier/SupplierRatings.tsx`** (new)

Supplier-facing ratings page:

```
┌─────────────────────────────────────────────────────┐
│  הדירוג שלי                                          │
│                                                     │
│  ⭐ ⭐ ⭐ ⭐ ☆  4.2 ממוצע  (15 דירוגים)              │
│                                                     │
│  ── דירוגים אחרונים ──                               │
│  ┌─────────────────────────────────────┐            │
│  │ ⭐⭐⭐⭐⭐ 5/5 — פרויקט "גיבוש ABC"    │            │
│  │ "שירות מעולה, אוכל מדהים"           │            │
│  │ 15/02/2026 | מפיק: אדם כהן         │            │
│  ├─────────────────────────────────────┤            │
│  │ ⭐⭐⭐⭐ 4/5 — פרויקט "טיול חברת XY"  │            │
│  │ "טוב מאוד, קצת איחור בתחילה"       │            │
│  │ 01/02/2026 | מפיק: רונית לוי       │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

Ratings come from:
1. Producer ratings (post-event, via field operations) — includes producer's own rating
2. Participant ratings (future — post-event survey, per PRD §7)
3. Google Business ratings (future — pull ratings from Google Business profile, per PRD §3.5)

**Backend: `convex/supplierRatings.ts`** (new)

```ts
listBySupplier     — all ratings for a supplier
getAverageRating   — computed average
create             — add rating (from producer or participant)
```

### 4. Public Supplier Profile Page

**File: `src/app/components/supplier/PublicSupplierProfile.tsx`** (new)

Public page at `/supplier/:id/public` (no auth required):

```
┌─────────────────────────────────────────────────────┐
│  [Header image / logo]                               │
│                                                     │
│  יקב הגולן                                          │
│  ⭐ 4.5 | אטרקציות | גליל עליון, כרמל               │
│                                                     │
│  [Marketing description — AI generated]              │
│                                                     │
│  ── שירותים ──                                      │
│  Product cards with images, descriptions, prices     │
│                                                     │
│  ── מבצעים ──                                       │
│  Active promotions                                   │
│                                                     │
│  ── דירוגים ──                                      │
│  Recent ratings                                      │
│                                                     │
│  [📞 צור קשר]                                       │
└─────────────────────────────────────────────────────┘
```

Shows only מחיר מחירון (list price). No internal pricing visible.

**AI marketing description:** Auto-generated from supplier's website/Facebook URL (per PRD §3.5). AI scrapes the URL and generates a comprehensive marketing description covering the service, all supplier products with individual descriptions. Displayed on the public profile page.

**Route addition:**
```ts
// In publicRouter (no auth):
{ path: "/supplier/:id/public", element: PublicSupplierProfile }
```

### 5. Promotions in Supplier Search/Filtering

**File: `src/app/components/SupplierSearch.tsx`** (modify)

When browsing suppliers (producer side), show active promotions:
- Promotion badge on supplier cards: "🔥 מבצע פעיל"
- Filter option: "הצג רק ספקים עם מבצעים"
- Promotion details visible in supplier detail view

---

## New Files

| File | Type |
|------|------|
| `src/app/components/supplier/SupplierPreview.tsx` | Page |
| `src/app/components/supplier/SupplierPromotions.tsx` | Page |
| `src/app/components/supplier/SupplierRatings.tsx` | Page |
| `src/app/components/supplier/PublicSupplierProfile.tsx` | Page (public) |
| `convex/supplierPromotions.ts` | Backend |
| `convex/supplierRatings.ts` | Backend |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/App.tsx` | Add public supplier profile route |
| `src/app/components/SupplierSearch.tsx` | Show promotion badges, filter by promotions |
| `src/app/components/SupplierDetail.tsx` | Show ratings and promotions |
