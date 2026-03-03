# Plan 05 — Supplier Portal

**Phase:** 2 (Core Features)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth)
**Blocks:** Plan 07 (Availability Workflow)

---

## Goal

Build the supplier-facing side of TravelPro: self-service management of products, documents, availability calendar, and handling of incoming availability requests from producers.

---

## Current State

- Suppliers are managed entirely by producers (SupplierBank, SupplierDetail)
- `supplierProducts`, `supplierDocuments`, `supplierContacts` tables exist with CRUD
- No supplier-facing UI exists
- No availability calendar or request handling

---

## Implementation

### 1. Supplier Layout

**File: `src/app/components/supplier/SupplierLayout.tsx`** (new)

Separate layout shell for supplier portal (rendered by supplierRouter):
- Same `Layout.tsx` component but with supplier-specific sidebar nav items (defined in Plan 02)
- Header shows: business name, notifications bell, profile menu
- Simpler than producer layout — no GlobalSearch (suppliers don't search other suppliers)

**Decision:** Reuse `Layout.tsx` with role-based nav rather than creating a separate layout component. The Layout already supports dynamic nav items.

### 2. My Products Page

**File: `src/app/components/supplier/MyProducts.tsx`** (new)

Product management from the supplier's perspective:

```
┌─────────────────────────────────────────────────────┐
│  המוצרים שלי                         [+ הוסף מוצר]  │
│                                                     │
│  Toggle: כרטיסים / רשימה                             │
│                                                     │
│  ┌───────────────────────────────────────┐           │
│  │ [תמונה]  סיור ביקב הגולן              │           │
│  │ קטגוריה: אטרקציות | מחיר: ₪80/אדם    │           │
│  │ מחיר ישיר: ₪120/אדם                   │           │
│  │ קיבולת: 60 איש | זמן: 2 שעות         │           │
│  │ תוספות: 2                              │           │
│  │ [ערוך] [מחק]                           │           │
│  └───────────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
```

Features:
- List all products for the current supplier (query by supplierId from user profile)
- Card/list view toggle
- Each card shows: image, name, category, prices (direct + producer), capacity, duration, addon count
- Click → open ProductEditorDrawer

### 3. Supplier Product Editor (Enhanced)

**File: `src/app/components/supplier/SupplierProductEditor.tsx`** (new)

Extended version of the existing `ProductEditor.tsx`, adding fields per spec:

```
┌──────────────────────────────────────┐
│  טופס מוצר / שירות                   │
│                                      │
│  שם מוצר: ___________                │
│  קטגוריה: [dropdown]                 │
│  תיאור: ___________                  │
│  מחיר ישיר (ללקוח ישיר): ₪ ____     │
│  מחיר למפיק (מוסכם): ₪ ____         │
│  יחידה: [לאדם / לקבוצה / ליום]       │
│  קיבולת מקסימלית: ____ איש           │
│  זמן פעילות: ____ שעות               │
│  מיקום: ___________                  │
│  תנאי ביטול: ___________             │
│                                      │
│  [תוספות / Add-ons]                  │
│  ┌────────────────────────────┐      │
│  │ + הוסף תוספת               │      │
│  │ שם: "פלטת גבינות"          │      │
│  │ מחיר: ₪35 ליחידה           │      │
│  ├────────────────────────────┤      │
│  │ שם: "הסעה מהצפון"          │      │
│  │ מחיר: ₪50 לאדם             │      │
│  └────────────────────────────┘      │
│                                      │
│  [גלריית תמונות]                     │
│  [📷] [📷] [📷] [+ העלה]             │
│                                      │
│  [שמור]  [ביטול]                     │
└──────────────────────────────────────┘
```

**Backend: `convex/productAddons.ts`** (new)

```ts
listByProductId  — all addons for a product
create           — add addon to product
update           — edit addon
remove           — delete addon
```

### 4. My Documents Page

**File: `src/app/components/supplier/MyDocuments.tsx`** (new)

Document management with checklist and alerts:

```
┌─────────────────────────────────────────────────────┐
│  המסמכים שלי                         [+ העלאת מסמך]  │
│                                                     │
│  צ'קליסט מסמכים נדרשים:                              │
│  ┌────────────────────────────────────────────┐     │
│  │ ☑ רישיון עסק      | תקף עד 12/2026 | ✅   │     │
│  │ ☐ תעודת כשרות     | לא הועלה       | ⚠️   │     │
│  │ ☑ ביטוח צד ג'     | תקף עד 03/2026 | 🔴   │     │
│  │ ☐ אישור משרד התיירות | לא הועלה     | ⚠️   │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  [Uploaded Documents Table]                          │
│  שם | סוג | תוקף | סטטוס | [צפה] [מחק]             │
└─────────────────────────────────────────────────────┘
```

Features:
- Predefined document types checklist: רישיון עסק, תעודת כשרות, ביטוח צד ג', אישור משרד התיירות, etc.
- Status indicators: ✅ valid, ⚠️ missing, 🔴 expired/expiring soon
- Upload modal: select document type → upload file → set expiry date
- Color-coded expiry: green (>30 days), yellow (≤30 days), red (expired)

Uses existing `convex/supplierDocuments.ts` — no new backend needed.

### 5. Availability Calendar

**File: `src/app/components/supplier/AvailabilityCalendar.tsx`** (new)

Monthly calendar view where suppliers can mark dates as available/unavailable:

```
┌─────────────────────────────────────────────────────┐
│  לוח זמינות                    ◄ מרץ 2026 ►         │
│                                                     │
│  ראשון | שני | שלישי | רביעי | חמישי | שישי | שבת   │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐       │
│  │  1  │  2  │  3  │  4  │  5  │  6  │  7  │       │
│  │ ✅  │ ✅  │ ❌  │ ✅  │ ✅  │     │     │       │
│  │     │ 📋1 │     │     │ 📋2 │     │     │       │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘       │
│                                                     │
│  Legend: ✅ זמין | ❌ לא זמין | 📋 הזמנה מאושרת     │
│                                                     │
│  Click date to toggle availability                   │
│  Dates with confirmed orders are locked              │
└─────────────────────────────────────────────────────┘
```

**Backend: add `supplierAvailability` table to schema or use calendarEvents filtered by supplier.**

Simpler approach: Add a `supplierAvailability` table:

```ts
supplierAvailability: defineTable({
  supplierId: v.id("suppliers"),
  date: v.string(),       // "2026-03-15"
  available: v.boolean(),
  notes: v.optional(v.string()),
})
  .index("by_supplierId", ["supplierId"])
  .index("by_supplierId_date", ["supplierId", "date"])
```

**Backend: `convex/supplierAvailability.ts`** (new)
- `listByMonth` — all availability entries for supplier in a month
- `setAvailability` — upsert availability for a date
- `checkAvailability` — public query: is supplier available on date X?

### 6. Requests & Orders Page

**File: `src/app/components/supplier/RequestsPage.tsx`** (new)

View and respond to availability requests from producers:

```
┌─────────────────────────────────────────────────────┐
│  בקשות & הזמנות                                      │
│                                                     │
│  Tabs: [בקשות ממתינות (3)] [הזמנות מאושרות] [היסטוריה] │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ מפיק: "טיולי אדם"                   │            │
│  │ פרויקט: "גיבוש חברת ABC"             │            │
│  │ תאריך: 15/04/2026                   │            │
│  │ מוצר: "סיור ביקב + טעימות"           │            │
│  │ כמות: 45 איש                         │            │
│  │ הערות: "צריך נגישות לכסאות גלגלים"   │            │
│  │                                     │            │
│  │ [✓ אשר]  [✗ דחה]  [↺ הצע חלופה]    │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  [הזמנות מאושרות tab]                                │
│  Table: תאריך | פרויקט | מפיק | מוצר | סטטוס       │
└─────────────────────────────────────────────────────┘
```

This page reads from `availabilityRequests` table and allows the supplier to respond. Full request handling is in Plan 07.

### 7. Supplier Settings / Profile

**File: `src/app/components/supplier/SupplierProfile.tsx`** (new)

Profile editing page (simple form):
- Business name, contact name, phone, email
- Category, region, address
- Location picker (Leaflet map — reuse SupplierLocationMap)
- Profile image upload
- Account settings (change password)

---

## New Files

| File | Type |
|------|------|
| `convex/productAddons.ts` | Backend |
| `convex/supplierAvailability.ts` | Backend |
| `src/app/components/supplier/MyProducts.tsx` | Page |
| `src/app/components/supplier/SupplierProductEditor.tsx` | Component |
| `src/app/components/supplier/MyDocuments.tsx` | Page |
| `src/app/components/supplier/AvailabilityCalendar.tsx` | Page |
| `src/app/components/supplier/RequestsPage.tsx` | Page |
| `src/app/components/supplier/SupplierProfile.tsx` | Page |

## Modified Files

| File | Changes |
|------|---------|
| `convex/schema.ts` | Add `supplierAvailability` table, `productAddons` (in Plan 01) |
| `convex/supplierProducts.ts` | Add directPrice, producerPrice, capacity, duration, location, cancellationTerms |
| `src/app/routes.ts` | Add supplier routes |

## Schema Addition (not in Plan 01)

```ts
supplierAvailability: defineTable({
  supplierId: v.id("suppliers"),
  date: v.string(),
  available: v.boolean(),
  notes: v.optional(v.string()),
})
  .index("by_supplierId", ["supplierId"])
  .index("by_supplierId_date", ["supplierId", "date"])
```

Add this to Plan 01's schema changes.
