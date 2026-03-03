# Plan 06 — Quote Editor Enhancements

**Phase:** 3 (Business Logic)
**Depends on:** Plan 01 (Data Model), Plan 05 (Supplier Portal — for product addons)
**Blocks:** Plan 07 (Availability Workflow), Plan 08 (Client Quote Enhancements)

---

## Goal

Enhance the existing QuoteEditor with: product add-ons, supplier alternatives, per-item availability status, margin calculator, and improved pricing summary.

---

## Current State

- `QuoteEditor.tsx` — full-featured project editor with accordion sections:
  - Items (add/edit/remove quote items with SupplierSearch)
  - Pricing summary
  - Timeline (drag & drop)
  - Documents
  - Map (Leaflet)
- `ItemEditor.tsx` — modal for editing a quote item (name, supplier, description, cost, directPrice, sellingPrice, profitWeight, images, notes)
- `SupplierSearch.tsx` — search/select suppliers when adding items
- `quoteItems` schema has: cost, directPrice, sellingPrice, profitWeight, status, alternatives (array of strings)
- No add-on support, no availability status indicators, alternatives are just text strings

---

## Implementation

### 1. Add-On Support in ItemEditor

**File: `src/app/components/ItemEditor.tsx`** (modify)

Add a new section below price fields:

```
┌─────────────────────────────────────────────────────┐
│  Item Editor                                         │
│                                                     │
│  [Existing fields: name, supplier, prices, etc.]     │
│                                                     │
│  ── תוספות זמינות ──────────────────────────────── │
│  (populated from selected supplier's product addons) │
│                                                     │
│  ☑ פלטת גבינות          +₪35/אדם                   │
│  ☐ הסעה מהצפון           +₪50/אדם                   │
│  ☑ מדריך צמוד            +₪200/קבוצה                │
│                                                     │
│  [Addon price auto-added to selling price]           │
└─────────────────────────────────────────────────────┘
```

Logic:
- When a supplier + product is selected, fetch `productAddons` for that product
- Show checkboxes for each addon
- Selected addons stored in `quoteItems.selectedAddons`
- Addon prices contribute to total selling price calculation

### 2. Availability Status Indicators

**File: `src/app/components/ItemEditor.tsx`** (modify)
**File: `src/app/components/QuoteEditor.tsx`** (modify)

Each quote item now shows availability status:

```
┌─────────────────────────────────────────────────────┐
│  רכיב: "סיור ביקב הגולן"                             │
│  ספק: יקב הגולן                                     │
│  מחיר ספק: ₪80/אדם | מחיר מכירה: ₪120              │
│  רווח: ₪40/אדם (33%)                                │
│  זמינות: ✅ אושר / ⏳ ממתין / ❌ נדחה / ⬜ לא נבדק  │
│                                                     │
│  תוספות:                                             │
│    ☑ פלטת גבינות (+₪35/אדם)                         │
│                                                     │
│  [עריכה ✏️] [בדוק זמינות 📅] [חלופות ↺]              │
└─────────────────────────────────────────────────────┘
```

Status badge colors:
- `not_checked` → gray badge "לא נבדק"
- `pending` → yellow badge "ממתין"
- `approved` → green badge "אושר"
- `declined` → red badge "נדחה"

### 3. Check Availability Button

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Add "בדוק זמינות" button per item. Clicking it:
1. Creates an `availabilityRequest` record (Plan 07 backend)
2. Updates item's `availabilityStatus` to "pending"
3. Shows loading/pending state on the item card
4. (Full workflow handled in Plan 07)

### 4. Alternatives System (Enhanced)

**File: `src/app/components/AlternativesModal.tsx`** (new)

Replace the current text-based alternatives with a proper supplier selection:

```
┌─────────────────────────────────────────────────────┐
│  חלופות ל: "סיור ביקב הגולן"                         │
│  קטגוריה: אטרקציות                                   │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ יקב כרמל                            │            │
│  │ ⭐ 4.5 | מרכז | ₪70/אדם | ✅ מאומת  │            │
│  │ [בחר]                                │            │
│  ├─────────────────────────────────────┤            │
│  │ יקב ברקן                            │            │
│  │ ⭐ 4.2 | שפלה | ₪65/אדם | ✅ מאומת  │            │
│  │ [בחר]                                │            │
│  ├─────────────────────────────────────┤            │
│  │ יקב רמת הגולן                        │            │
│  │ ⭐ 4.7 | צפון | ₪90/אדם | ✅ מאומת  │            │
│  │ [בחר]                                │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  Shows suppliers in same category, sorted by rating  │
│  Clicking "בחר" replaces the supplier on the item    │
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/suppliers.ts`** (extend)

Add query:
```ts
findAlternatives: query({
  args: { category: v.string(), excludeId: v.optional(v.id("suppliers")) },
  // Returns suppliers in same category, excluding current, sorted by rating
})
```

### 5. Enhanced Pricing Summary

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Replace simple pricing with detailed breakdown:

```
┌───────────────────────────────────┐
│  סיכום תמחור                      │
│                                   │
│  סה"כ עלות ספקים:      ₪15,000   │
│  סה"כ תוספות:          ₪2,500    │
│  סה"כ מחיר מכירה:      ₪25,000   │
│  ──────────────────────           │
│  רווח גולמי:           ₪7,500    │
│  אחוז רווח:            30%       │
│  מחיר למשתתף:          ₪833      │
│                                   │
│  [Profit bar — visual indicator]  │
│  ████████████░░░░░ 30%            │
└───────────────────────────────────┘
```

Calculations:
- Supplier cost = sum of all items' `cost`
- Addons total = sum of selected addons across all items × participants
- Selling price = sum of all items' `sellingPrice` + addon selling prices
- Gross profit = selling - supplier cost - addon cost
- Margin % = profit / selling × 100
- Per participant = selling / project.participants

### 6. Quote Actions Bar

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Add action buttons at bottom of QuoteEditor:

```
[שלח הצעה ללקוח] → generates /quote/:id link + copies to clipboard
[שמור טיוטה]      → already works (auto-save via mutations)
[ייצא PDF]         → placeholder for Plan 13
```

"שלח הצעה ללקוח" creates/updates the quote version and generates the shareable link.

---

## New Files

| File | Type |
|------|------|
| `src/app/components/AlternativesModal.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/ItemEditor.tsx` | Add addons section, availability status, link to alternatives |
| `src/app/components/QuoteEditor.tsx` | Availability badges, enhanced pricing summary, action buttons |
| `src/app/components/SupplierSearch.tsx` | Pass product selection for addon loading |
| `convex/suppliers.ts` | Add `findAlternatives` query |
| `convex/quoteItems.ts` | Handle `selectedAddons`, `availabilityStatus`, `supplierId`, `productId` |
