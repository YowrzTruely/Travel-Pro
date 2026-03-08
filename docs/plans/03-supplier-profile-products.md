# Plan 03 — Supplier Profile & Products

**Phase:** 2 (Supplier Module — PRD Priority #1)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth)
**Blocks:** Plan 06 (Quote Editor), Plan 07 (Availability & Booking)
**PRD refs:** §3.1 (Registration), §3.2 (Categories & Regions), §3.3 (4-Tier Pricing)

---

## Goal

Build the supplier-facing product management system with 4-tier pricing, product gallery, equipment/gear requirements, gross/net timing, seasonal availability, operating hours, 11 regions, 8 categories, AI image cleanup + marketing descriptions (Gemini Flash), and upsells/add-ons per product.

---

## Current State

- Suppliers managed entirely by producers (SupplierBank, SupplierDetail)
- `supplierProducts`, `supplierDocuments`, `supplierContacts` tables exist with CRUD
- No supplier-facing UI exists
- No 4-tier pricing, equipment, timing, or AI features
- Products have basic fields: name, description, price, images

---

## Implementation

### 1. Categories & Regions (PRD §3.2)

**Constants file: `src/app/components/constants/supplierConstants.ts`** (new)

```ts
export const SUPPLIER_CATEGORIES = [
  { value: "attractions", label: "אטרקציות ופעילויות" },
  { value: "food", label: "מסעדות ואוכל" },
  { value: "transport", label: "הסעות ותחבורה" },
  { value: "photography", label: "צילום ומגנטים" },
  { value: "entertainment", label: "בידור ומוזיקה" },
  { value: "workshops", label: "סדנאות יצירה ולמידה" },
  { value: "accommodation", label: "לינה" },
  { value: "other", label: "אחר" },
] as const;

export const OPERATING_REGIONS = [
  { value: "upper_galilee", label: "גליל עליון" },
  { value: "lower_galilee", label: "גליל תחתון" },
  { value: "valleys", label: "עמקים" },
  { value: "carmel", label: "כרמל" },
  { value: "sharon", label: "שרון" },
  { value: "center", label: "מרכז" },
  { value: "shfela", label: "שפלה" },
  { value: "jerusalem", label: "ירושלים והר יהודה" },
  { value: "negev", label: "נגב" },
  { value: "arava", label: "ערבה" },
  { value: "dead_sea", label: "ים המלח" },
] as const;
```

### 2. My Products Page (Supplier View)

**File: `src/app/components/supplier/MyProducts.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  המוצרים שלי                         [+ הוסף מוצר]  │
│                                                     │
│  Toggle: כרטיסים / רשימה                             │
│                                                     │
│  ┌───────────────────────────────────────┐           │
│  │ [תמונה]  סיור ביקב הגולן              │           │
│  │ קטגוריה: אטרקציות                     │           │
│  │ 💰 מחירון: ₪120 | ישיר: ₪80 | מפיק: ₪70 │       │
│  │ ⏱ ברוטו: 2.5ש | נטו: 2ש              │           │
│  │ 👥 קיבולת: 60 איש                     │           │
│  │ 🎒 ציוד: נעליים סגורות, כובע          │           │
│  │ 🎁 תוספות: 2                          │           │
│  │ [ערוך] [מחק]                           │           │
│  └───────────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
```

Features:
- List all products for current supplier (query by supplierId from user profile)
- Card/list view toggle
- Each card shows: image, name, category, 4-tier prices, timing, capacity, equipment, addon count
- Click → open SupplierProductEditor

### 3. Supplier Product Editor (4-Tier Pricing)

**File: `src/app/components/supplier/SupplierProductEditor.tsx`** (new)

```
┌──────────────────────────────────────┐
│  טופס מוצר / שירות                   │
│                                      │
│  שם מוצר: ___________                │
│  קטגוריה: [dropdown — 8 categories]  │
│  אזורי פעילות: [multi-select — 11]   │
│                                      │
│  ── תיאורים ──                       │
│  תיאור קצר: ___________             │
│  תיאור מורחב: ___________           │
│  [🤖 צור תיאור עם AI]               │
│                                      │
│  ── תמחור (PRD §3.3) ──             │
│  מחיר מחירון (ציבורי): ₪ ____       │
│  מחיר ישיר (רק לי): ₪ ____         │
│  מחיר מפיק (מוסכם): ₪ ____         │
│  מחיר ללקוח: ₪ ____                 │
│  אחוז רווח ברירת מחדל: 20%          │
│  יחידה: [לאדם / לקבוצה / ליום]       │
│                                      │
│  ── זמנים ──                         │
│  זמן ברוטו: ____ דקות               │
│  זמן נטו: ____ דקות                 │
│  עונתיות: ___________               │
│  שעות פעילות: ___________           │
│                                      │
│  ── ציוד נדרש ──                     │
│  [+ הוסף דרישת ציוד]                │
│  ☑ נעליים סגורות                    │
│  ☑ רישיון נהיגה                     │
│  ☑ בגד ים                           │
│                                      │
│  קיבולת מקסימלית: ____ איש          │
│  מיקום: ___________                  │
│  תנאי ביטול: ___________            │
│                                      │
│  ── תוספות / אפסלרים (Upsells) ──   │
│  ┌────────────────────────────┐      │
│  │ + הוסף תוספת               │      │
│  │ שם: "פלטת גבינות"          │      │
│  │ מחיר מחירון: ₪35            │      │
│  │ מחיר ישיר: ₪25              │      │
│  ├────────────────────────────┤      │
│  │ שם: "הסעה מהצפון"          │      │
│  │ מחיר מחירון: ₪50            │      │
│  └────────────────────────────┘      │
│                                      │
│  ── גלריית תמונות ──                │
│  [📷] [📷] [📷] [+ העלה]             │
│  [🤖 נקה תמונה עם AI]              │
│                                      │
│  [שמור]  [ביטול]                     │
└──────────────────────────────────────┘
```

**4-tier pricing logic (PRD §3.3):**
| Price | Who sees | Description |
|-------|----------|-------------|
| מחיר מחירון | Everyone | Official list price |
| מחיר ישיר | Supplier only (enters) | Price supplier gives without middleman |
| מחיר מפיק | Producer only | Special agreed price for this producer |
| מחיר ללקוח | Producer internal | What producer sells to client (includes margin) |

Default margin: 20% (configurable per product).

### 4. AI Image Cleanup & Descriptions (PRD §3.1)

**File: `convex/aiSupplier.ts`** (new — Convex action)

```ts
// Gemini Flash integration
generateMarketingDescription: action({
  args: { productName: v.string(), category: v.string(), supplierInfo: v.optional(v.string()) },
  // Uses Gemini Flash to generate emotionally-driven marketing description
  // Returns { shortDescription, longDescription }
})

cleanProductImage: action({
  args: { imageStorageId: v.string() },
  // Uses AI to clean product image (remove backgrounds, make sterile/professional)
  // Returns new storageId for cleaned image
})
```

- AI descriptions: one-sentence + paragraph versions, emotionally engaging (per PRD)
- AI image cleanup: "sterile" professional product shot from raw supplier photos
- Each field can be filled with AI or manually (per PRD §3.1 note)

### 5. Backend — Product Addons (Upsells)

**File: `convex/productAddons.ts`** (new)

```ts
listByProductId  — all addons for a product
create           — add addon to product (with 4-tier pricing)
update           — edit addon
remove           — delete addon
```

### 6. Supplier Profile Page

**File: `src/app/components/supplier/SupplierProfile.tsx`** (new)

Profile editing page (simple form):
- Business name, contact name, phone, email
- Category (multi-select, admin approval if >2), regions (multi-select)
- Address, location picker (Leaflet map — reuse SupplierLocationMap)
- Operating hours, seasonal availability
- Profile image upload
- Default margin percentage

### 7. Availability Calendar

**File: `src/app/components/supplier/AvailabilityCalendar.tsx`** (new)

Monthly calendar view where suppliers mark dates as available/unavailable:

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
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/supplierAvailability.ts`** (new)
- `listByMonth` — all availability entries for supplier in a month
- `setAvailability` — upsert availability for a date
- `checkAvailability` — public query: is supplier available on date X?

---

## New Files

| File | Type |
|------|------|
| `src/app/components/constants/supplierConstants.ts` | Constants |
| `src/app/components/supplier/MyProducts.tsx` | Page |
| `src/app/components/supplier/SupplierProductEditor.tsx` | Component |
| `src/app/components/supplier/SupplierProfile.tsx` | Page |
| `src/app/components/supplier/AvailabilityCalendar.tsx` | Page |
| `convex/productAddons.ts` | Backend |
| `convex/supplierAvailability.ts` | Backend |
| `convex/aiSupplier.ts` | Backend action (Gemini Flash) |

## Modified Files

| File | Changes |
|------|---------|
| `convex/schema.ts` | (done in Plan 01) |
| `convex/supplierProducts.ts` | Add 4-tier pricing, timing, equipment fields |
| `src/app/routes.ts` | Add supplier routes (done in Plan 02) |
