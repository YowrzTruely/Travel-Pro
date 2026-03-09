# Plan 06 — Quote Editor Enhancements

**Phase:** 3 (Proposal Builder — PRD Priority #2)
**Depends on:** Plan 01 (Data Model), Plan 03 (Supplier Profile & Products — for 4-tier pricing + addons)
**Blocks:** Plan 07 (Availability & Booking), Plan 08 (Client Proposal Page)
**PRD refs:** §4.1 (Quote Flow), §4.2 (Quote Structure), §3.3 (4-Tier Pricing)

---

## Goal

Enhance the existing QuoteEditor with: trip name + AI-generated opening paragraph (from supplier AI content in §3.1 stage 2), 4-tier pricing support with volume pricing, equipment list aggregation, visual timeline with hide toggle, upsells display, activity cards with marketing descriptions (no supplier names), 2-4 alternatives per item, price toggle (show/hide detailed prices before sending), and enhanced margin calculator.

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
- No add-on/upsell support, no availability status indicators, alternatives are just text strings
- No 4-tier pricing, no equipment aggregation, no gross/net time

---

## Implementation

### 0. Trip Name + Opening Paragraph (PRD §4.2)

**File: `src/app/components/QuoteEditor.tsx`** (modify)

At the top of the quote, the producer sets:
- **Trip name** — AI can generate suggestions (Gemini Flash)
- **Opening paragraph** — auto-populated from supplier AI-generated marketing descriptions created during §3.1 stage 2 profile setup + supplier product images

```
┌─────────────────────────────────────────────────────┐
│  שם הטיול: [יום כיף בגולן ________________] [🤖 הצע]│
│                                                     │
│  פסקת פתיחה:                                        │
│  [Auto-filled from AI content created in §3.1]      │
│  [Editable — producer can modify]                   │
│                                                     │
│  [🤖 צור תיאור עם AI]                              │
└─────────────────────────────────────────────────────┘
```

### 1. 4-Tier Pricing in ItemEditor (PRD §3.3)

**File: `src/app/components/ItemEditor.tsx`** (modify)

Replace current pricing fields with 4-tier pricing:

```
┌─────────────────────────────────────────────────────┐
│  ── תמחור (4 רמות) ──                                │
│                                                     │
│  מחיר מחירון (ציבורי):    ₪120/אדם  [auto-filled]   │
│  מחיר ישיר (מהספק):       ₪80/אדם   [auto-filled]   │
│  מחיר מפיק (מוסכם):       ₪70/אדם   [editable]      │
│  מחיר ללקוח:               ₪96/אדם   [editable]      │
│                                                     │
│  מרווח: ₪26/אדם (37%)  [profit bar ████████░░ 37%]  │
│                                                     │
│  ℹ️ ברירת מחדל: 20% מרווח על מחיר מפיק              │
└─────────────────────────────────────────────────────┘
```

Logic:
- When supplier+product selected, auto-fill list/direct/producer prices from `supplierProducts`
- Client price defaults to producerPrice × 1.20 (20% margin per PRD §3.3)
- Producer can override client price manually
- Margin calculator: `(clientPrice - producerPrice) / clientPrice × 100`
- **Volume pricing:** If product has quantity-based pricing (above X people → different price), auto-apply based on participant count

### 2. Upsells / Add-Ons in ItemEditor (PRD §4.2)

**File: `src/app/components/ItemEditor.tsx`** (modify)

Add upsells section below pricing:

```
┌─────────────────────────────────────────────────────┐
│  ── תוספות זמינות (אפסלרים) ──                       │
│  (מתוך המוצר שנבחר)                                  │
│                                                     │
│  ☑ פלטת גבינות          +₪35/אדם                   │
│  ☐ הסעה מהצפון           +₪50/אדם                   │
│  ☑ מדריך צמוד            +₪200/קבוצה                │
│                                                     │
│  [מחיר תוספות ייתוסף אוטומטית לסכום]                │
└─────────────────────────────────────────────────────┘
```

Logic:
- When supplier+product selected, fetch `productAddons` for that product
- Show checkboxes for each addon
- Selected addons stored in `quoteItems.selectedAddons`
- Addon prices contribute to total selling price calculation
- Upsells displayed to client on proposal page (Plan 08)

### 3. Equipment List Aggregation (PRD §4.2, §7)

**File: `src/app/components/QuoteEditor.tsx`** (modify)

New section in QuoteEditor — aggregated equipment requirements across all items:

```
┌───────────────────────────────────┐
│  ציוד נדרש (מצטבר)               │
│                                   │
│  • נעליים סגורות (סיור ביקב, הליכה) │
│  • רישיון נהיגה (טרקטורונים)      │
│  • בגד ים (קיאקים)               │
│  • כובע ומים (כל הפעילויות)       │
│                                   │
│  [ייצא PDF לרשימת ציוד →]        │
└───────────────────────────────────┘
```

Logic:
- Aggregate `equipmentRequirements` from all selected products across all quote items
- Deduplicate
- Show which activities require each item
- PDF export button (implemented in Plan 14)

### 4. Visual Timeline with Hide Toggle (PRD §4.2)

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Enhanced timeline section:

```
┌─────────────────────────────────────────────────────┐
│  לוח זמנים ויזואלי            [👁 הצג/הסתר לפני שליחה]│
│                                                     │
│  09:00 ━━━━━━ הגעה ומפגש ━━━━━━━━━━ 09:30           │
│  09:30 ━━━━━━ סיור ביקב ━━━━━━━━━━━ 12:00           │
│         ⏱ ברוטו: 2.5ש | נטו: 2ש                    │
│  12:00 ━━ 🚗 נסיעה (15 דק) ━━━━━━━ 12:15           │
│  12:15 ━━━━━━ ארוחת צהריים ━━━━━━━ 14:00            │
│         ⏱ ברוטו: 1.75ש | נטו: 1.5ש                 │
│  14:15 ━━━━━━ סדנת יין ━━━━━━━━━━━ 16:30            │
│         ⏱ ברוטו: 2.25ש | נטו: 2ש                   │
│                                                     │
│  סה"כ: 7.5 שעות | 3 תחנות                           │
└─────────────────────────────────────────────────────┘
```

- Toggle: "הסתר לפני שליחה" hides timeline from client view (PRD §4.2: "ניתן להסתרה לפני שליחה")
- Shows gross/net time per activity (from `supplierProducts`)
- Drag & drop reordering (existing feature)

### 5. Alternatives System (2-4 per item — PRD §4.2)

**File: `src/app/components/AlternativesModal.tsx`** (new)

Replace text-based alternatives with proper supplier selection:

```
┌─────────────────────────────────────────────────────┐
│  חלופות ל: "סיור ביקב הגולן"  (מקסימום 4)            │
│  קטגוריה: אטרקציות                                   │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ יקב כרמל                            │            │
│  │ ⭐ 4.5 | מרכז | מפיק: ₪70 | לקוח: ₪96 │          │
│  │ 🔥 מבצע פעיל                        │            │
│  │ [הוסף כחלופה]                       │            │
│  ├─────────────────────────────────────┤            │
│  │ יקב ברקן                            │            │
│  │ ⭐ 4.2 | שפלה | מפיק: ₪65 | לקוח: ₪84 │          │
│  │ [הוסף כחלופה]                       │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  חלופות שנבחרו: 2/4                                  │
│  הלקוח יוכל לבחור בין הפעילות המקורית לחלופות       │
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/suppliers.ts`** (extend)

```ts
findAlternatives: query({
  args: { category: v.string(), region: v.optional(v.string()), excludeId: v.optional(v.id("suppliers")) },
  // Returns suppliers in same category, excluding current, sorted by rating
})
```

Selected alternatives stored in `quoteItems.alternativeItems` — displayed on client proposal page (Plan 08) for client selection.

### 6. Availability Status Indicators

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Each quote item shows availability status:

```
┌─────────────────────────────────────────────────────┐
│  רכיב: "סיור ביקב הגולן"                             │
│  ספק: יקב הגולן                                     │
│  💰 מפיק: ₪70 | לקוח: ₪96 | מרווח: 37%             │
│  ⏱ ברוטו: 2.5ש | נטו: 2ש                           │
│  זמינות: ✅ אושר / ⏳ ממתין / ❌ נדחה / ⬜ לא נבדק  │
│                                                     │
│  תוספות: ☑ פלטת גבינות (+₪35)                       │
│  🎒 ציוד: נעליים סגורות, כובע                        │
│                                                     │
│  [עריכה ✏️] [בדוק זמינות 📅] [חלופות ↺]              │
└─────────────────────────────────────────────────────┘
```

Status badges:
- `not_checked` → gray "לא נבדק"
- `pending` → yellow "ממתין"
- `approved` → green "אושר"
- `declined` → red "נדחה"

### 7. Enhanced Pricing Summary

**File: `src/app/components/QuoteEditor.tsx`** (modify)

```
┌───────────────────────────────────┐
│  סיכום תמחור                      │
│                                   │
│  סה"כ עלות ספקים (מפיק):  ₪15,000 │
│  סה"כ תוספות:              ₪2,500 │
│  סה"כ מחיר ללקוח:          ₪25,000 │
│  ──────────────────────           │
│  רווח גולמי:               ₪7,500 │
│  אחוז רווח:                30%    │
│  מחיר למשתתף:              ₪833   │
│                                   │
│  [Profit bar ████████████░░░ 30%] │
└───────────────────────────────────┘
```

Calculations:
- Supplier cost = sum of all items' producerPrice × participants
- Addons total = sum of selected addons × participants (per unit)
- Client price = sum of all items' clientPrice × participants + addon markup
- Gross profit = client price - supplier cost - addon cost
- Margin % = profit / client price × 100
- Per participant = client price / participants

### 8. Quote Actions Bar

**File: `src/app/components/QuoteEditor.tsx`** (modify)

```
[שלח הצעה ללקוח]    → generates /quote/:id link + copies to clipboard
[שמור טיוטה]        → already works (auto-save)
[ייצא PDF]           → placeholder for Plan 14
[שתף ללא מחירים]     → generates link with prices hidden (Plan 08)
```

---

## New Files

| File | Type |
|------|------|
| `src/app/components/AlternativesModal.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/ItemEditor.tsx` | 4-tier pricing, addons section, availability status, equipment |
| `src/app/components/QuoteEditor.tsx` | Equipment aggregation, timeline toggle, availability badges, enhanced pricing, action buttons |
| `src/app/components/SupplierSearch.tsx` | Pass product selection for addon loading, show promotions |
| `convex/suppliers.ts` | Add `findAlternatives` query |
| `convex/quoteItems.ts` | Handle `selectedAddons`, `availabilityStatus`, `alternativeItems`, `equipmentRequirements`, timing |
