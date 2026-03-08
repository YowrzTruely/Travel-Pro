# Plan 11 — Field Operations HQ (חמ"ל שטח)

**Phase:** 5 (Field Operations — PRD Priority #4)
**Depends on:** Plan 09 (Supplier Orders — needs confirmed orders for stops)
**Blocks:** Plan 14 (Digital Assets — post-event gallery/ratings)
**PRD refs:** §6 (Field Operations)

---

## Goal

Build the Field Operations HQ for managing events in real-time on the day of activity: planned vs actual times per stop, ordered vs actual quantities, "time shift" button that updates schedule + sends WhatsApp Magic Link to upcoming suppliers, quantity updates auto-sent to food suppliers, supplier field signatures, real-time road expense uploads, and mobile-first UI.

---

## Current State

- No field operations system exists
- Projects have timeline (quote items with times) but no real-time tracking
- No road expense tracking
- No supplier signature collection

---

## Implementation

### 1. Field Operations Overview

**Entry point:** When a confirmed project's event date arrives (or manually triggered), producer can open Field Operations HQ from the project page.

**File: `src/app/components/field/FieldOperationsHQ.tsx`** (new)

Mobile-first full-screen view:

```
┌─────────────────────────────────────────────────────┐
│  חמ"ל שטח — גיבוש חברת ABC                          │
│  📅 15/04/2026 | 45 משתתפים | סטטוס: 🟢 בביצוע      │
│                                                     │
│  [Stops Timeline — scrollable]                       │
│                                                     │
│  ┌─ 09:00 ✅ הגעה ומפגש ─────────────── 09:30 ─┐   │
│  │ בפועל: 09:05 - 09:35  (+5 דק)                │   │
│  │ [✓ הושלם]                                     │   │
│  └───────────────────────────────────────────────┘   │
│                                                     │
│  ┌─ 09:30 🟡 סיור ביקב הגולן ────────── 12:00 ─┐   │
│  │ ⏱ מתוכנן: 09:30 - 12:00                      │   │
│  │ ⏱ בפועל: 09:35 - ___                         │   │
│  │ 👥 מוזמן: 45 | בפועל: 42 [עדכן]              │   │
│  │                                               │   │
│  │ [⏱ התחל] [✓ סיים] [✍️ חתימת ספק]             │   │
│  └───────────────────────────────────────────────┘   │
│                                                     │
│  ┌─ 12:15 ⬜ ארוחת צהריים ────────────── 14:00 ─┐   │
│  │ ⏱ מתוכנן: 12:15 - 14:00                      │   │
│  │ 👥 מוזמן: 45 | בפועל: [____]                 │   │
│  │ 🍽 ← עדכון כמות נשלח אוטומטית לספק            │   │
│  │                                               │   │
│  │ [⏱ התחל] [✍️ חתימת ספק]                      │   │
│  └───────────────────────────────────────────────┘   │
│                                                     │
│  ┌─ 14:15 ⬜ סדנת יין ──────────────── 16:30 ─┐    │
│  │ ...                                          │    │
│  └──────────────────────────────────────────────┘    │
│                                                     │
│  ── פעולות ──                                       │
│  [⏩ הסטת זמנים]  [💰 הוצאת דרך]  [📊 סיכום]       │
└─────────────────────────────────────────────────────┘
```

### 2. Stop Management

**File: `src/app/components/field/FieldStop.tsx`** (new)

Each stop card tracks:

```ts
interface StopState {
  plannedStart: string;    // from quote item timeline
  plannedEnd: string;
  actualStart?: string;    // set when "התחל" clicked
  actualEnd?: string;      // set when "סיים" clicked
  plannedQuantity: number; // from quote/order
  actualQuantity?: number; // updated in field
  supplierSignature?: string; // captured signature
  status: "upcoming" | "in_progress" | "completed" | "skipped";
}
```

**Actions per stop:**
- **"התחל"** → records actual start time
- **"סיים"** → records actual end time, calculates delta
- **"עדכן כמות"** → update actual quantity
  - If food supplier: auto-sends WhatsApp to supplier with updated count (PRD §6)
- **"חתימת ספק"** → opens signature pad for supplier to sign on device

### 3. Time Shift Button (PRD §6)

**File: `src/app/components/field/TimeShiftModal.tsx`** (new)

"הסטת זמנים" — shifts the entire remaining schedule:

```
┌────────────────────────────────────┐
│  הסטת זמנים                        │
│                                    │
│  ⏱ זמן נוכחי: 10:15               │
│  📍 תחנה נוכחית: סיור ביקב         │
│                                    │
│  הסט ב: [+15 דק ▼]                │
│  או שעה חדשה: [__:__]             │
│                                    │
│  תחנות שיעודכנו:                   │
│  • ארוחת צהריים: 12:15 → 12:30    │
│  • סדנת יין: 14:15 → 14:30        │
│                                    │
│  📲 WhatsApp Magic Link יישלח ל:   │
│  ☑ שף אבי (ארוחה)                 │
│  ☑ יקב X (סדנה)                   │
│                                    │
│  [בצע הסטה + שלח הודעות]           │
└────────────────────────────────────┘
```

**Logic:**
1. Calculate time delta
2. Update all remaining stops' planned times
3. Send WhatsApp Magic Link to each upcoming supplier:
   - "שלום {ספק}, עדכון שעות לאירוע היום: הגעה צפויה ב-{new_time} במקום {old_time}"
4. Include link for supplier to acknowledge

**Backend: `convex/fieldOperations.ts`** (extend)

```ts
shiftTimes: mutation({
  args: {
    fieldOperationId: v.id("fieldOperations"),
    fromStopIndex: v.number(),
    deltaMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    // Update all stops from index onwards
    // Trigger WhatsApp notifications to upcoming suppliers
  },
})
```

### 4. Quantity Update → Auto-Notify Food Suppliers (PRD §6)

When actual quantity is updated for a food/restaurant supplier:
1. Detect if supplier category is "food" (מסעדות ואוכל)
2. Auto-send WhatsApp/SMS: "עדכון כמות: {actual} משתתפים במקום {planned}"
3. Show confirmation: "הודעה נשלחה ל-{supplier}"

### 5. Supplier Field Signature

**File: `src/app/components/field/SignaturePad.tsx`** (new)

HTML5 Canvas signature capture:

```
┌────────────────────────────────────┐
│  חתימת ספק — יקב הגולן             │
│                                    │
│  ┌────────────────────────────┐    │
│  │                            │    │
│  │      ← חתום כאן           │    │
│  │                            │    │
│  └────────────────────────────┘    │
│  [נקה] [שמור חתימה]                │
└────────────────────────────────────┘
```

- Captures supplier's written signature confirming service delivery
- Saves as image to Convex file storage
- Links to the `fieldOperationStops` record

### 6. Road Expenses (PRD §6)

**File: `src/app/components/field/RoadExpenseForm.tsx`** (new)

```
┌────────────────────────────────────┐
│  הוצאת דרך                         │
│                                    │
│  תיאור: ___________               │
│  סכום: ₪ ____                      │
│  קטגוריה: [דלק / חניה / טיפים /   │
│            שונות]                  │
│  [📸 צלם קבלה]                     │
│                                    │
│  [שמור]                            │
└────────────────────────────────────┘
```

Features:
- Quick expense entry in the field
- Camera capture for receipt photo → upload to Convex file storage
- Real-time — expenses appear immediately in project financials
- Categories: fuel, parking, tips, misc

**Backend: `convex/roadExpenses.ts`** (new)

```ts
listByOperation  — all expenses for a field operation
create           — add expense with optional receipt
totalByProject   — aggregate expenses for project financials
```

### 7. Field Operations Summary

**File: `src/app/components/field/FieldSummary.tsx`** (new)

Post-event summary view:

```
┌─────────────────────────────────────────────────────┐
│  סיכום אירוע — גיבוש חברת ABC                       │
│                                                     │
│  ⏱ זמנים:                                          │
│  • סיור ביקב: מתוכנן 2.5ש, בפועל 2.67ש (+10 דק)   │
│  • ארוחה: מתוכנן 1.75ש, בפועל 1.5ש (-15 דק)       │
│                                                     │
│  👥 כמויות:                                         │
│  • מוזמן: 45 | בפועל: 42 (93%)                      │
│                                                     │
│  ✍️ חתימות: 3/3 ספקים חתמו ✅                       │
│                                                     │
│  💰 הוצאות דרך: ₪350                                │
│  • דלק: ₪200 | חניה: ₪100 | טיפים: ₪50             │
│                                                     │
│  [📄 ייצא דו"ח] [📸 העלה תמונות]                    │
└─────────────────────────────────────────────────────┘
```

### 8. Mobile-First UI

Field Operations is primarily used on mobile phones during events:
- All components use `useIsMobile()` hook
- Large touch targets for buttons
- Bottom-docked action bar
- Swipe gestures for stop navigation
- Camera integration for receipts/signatures
- Works offline-first where possible (sync when connectivity returns)

### 9. Route & Entry Point

Add to producer routes:
```ts
{ path: "/field/:projectId", element: FieldOperationsHQ },
```

Entry from project page: "🏠 פתח חמ"ל שטח" button (visible only on event day or manually).

---

## New Files

| File | Type |
|------|------|
| `convex/fieldOperations.ts` | Backend |
| `convex/fieldOperationStops.ts` | Backend |
| `convex/roadExpenses.ts` | Backend |
| `src/app/components/field/FieldOperationsHQ.tsx` | Page (mobile-first) |
| `src/app/components/field/FieldStop.tsx` | Component |
| `src/app/components/field/TimeShiftModal.tsx` | Component |
| `src/app/components/field/SignaturePad.tsx` | Component |
| `src/app/components/field/RoadExpenseForm.tsx` | Component |
| `src/app/components/field/FieldSummary.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/routes.ts` | Add /field/:projectId route |
| `convex/crons.ts` | (optional) auto-create field op on event day |
| `convex/notificationSender.ts` | Add time-shift and quantity-update message templates |
