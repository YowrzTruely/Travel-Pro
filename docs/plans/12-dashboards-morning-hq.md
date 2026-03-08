# Plan 12 — Dashboards & Morning HQ

**Phase:** 6 (Dashboard & Assets — PRD Priority #5)
**Depends on:** Plan 02 (Multi-Role Auth), Plan 10 (CRM — for lead stats), Plan 07 (Bookings)
**Blocks:** None
**PRD refs:** §8 (Dashboard & UI)

---

## Goal

Replace the single `Dashboard.tsx` with role-specific dashboards featuring: Morning HQ widget (today+tomorrow events), quote heat meter, urgent alerts (expiring insurance, pending reservations, missing invoices), open reservations list, drag-drop widget customization, ⓘ help icons, supplier dashboard, and admin dashboard.

---

## Current State

- `Dashboard.tsx` — animated stats (suppliers, projects, revenue), pipeline summary cards, activity ticker, Recharts line chart
- `convex/dashboard.ts` — single `stats` query returning supplier/project/revenue aggregates
- This dashboard is producer-oriented; reuse what makes sense

---

## Implementation

### 1. Producer Dashboard (PRD §8)

**File: `src/app/components/dashboards/ProducerDashboard.tsx`** (new — replace Dashboard.tsx)

```
┌─────────────────────────────────────────────────────┐
│  דשבורד מפיק                        [⚙️ התאמה אישית]│
│                                                     │
│  ── חמ"ל בוקר ─────────────────── ⓘ ──             │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📅 היום (15/04):                             │    │
│  │   • גיבוש חברת ABC — 45 איש | צפון         │    │
│  │     09:00-16:30 | 3 ספקים | [פתח חמ"ל →]    │    │
│  │                                             │    │
│  │ 📅 מחר (16/04):                              │    │
│  │   • טיול חברת XY — 30 איש | מרכז           │    │
│  │     08:00-18:00 | 5 ספקים | [צפה →]         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── מד חום הצעות ─────────────── ⓘ ──              │
│  ┌─────────────────────────────────────────────┐    │
│  │ נשלחו: 12 | בדיון: 5 | נסגרו: 8 | הופסדו: 3│    │
│  │ [████████████████░░░░░░] 67% סגירה          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── התראות דחופות ────────────── ⓘ ──              │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🔴 ביטוח צד ג' — יקב הגולן — פג ב-3 ימים   │    │
│  │ 🟡 שריון ממתין — שף אבי — פג ב-5 ימים      │    │
│  │ 🟠 חשבוניות חסרות — פרויקט 4829-24 (2/4)   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── שריונות פתוחים ──────────── ⓘ ──               │
│  ┌─────────────────────────────────────────────┐    │
│  │ ספק | פרויקט | תאריך | פג ב- | סטטוס       │    │
│  │ יקב הגולן | ABC | 15/04 | 22/03 | 🟢       │    │
│  │ שף אבי | XY | 16/04 | 20/03 | 🟡           │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── סטטיסטיקות ──                                   │
│  [Summary Cards — existing animated stats]           │
│  לידים חדשים | פרויקטים | ספקים | הכנסות             │
│                                                     │
│  [Revenue Chart — existing Recharts]                 │
└─────────────────────────────────────────────────────┘
```

### 2. Drag & Drop Widget Customization (PRD §8)

Each widget section is draggable — producer can reorder:

```ts
const defaultWidgetOrder = [
  "morning_hq",
  "quote_heat",
  "urgent_alerts",
  "open_reservations",
  "stats_cards",
  "revenue_chart",
];

// Saved per user in users table or localStorage
```

- Use `react-dnd` (already in project for Kanban)
- Widget order persisted to user preferences
- Each widget can be collapsed/expanded

### 3. ⓘ Help Icons (PRD §8)

**File: `src/app/components/ui/HelpTooltip.tsx`** (new)

```ts
interface HelpTooltipProps {
  text: string;
  videoUrl?: string;
}
```

Per PRD §8: "אייקון ⓘ ליד כל פונקציה → פותח הסבר טקסטואלי או סרטון הדרכה"

- Small ⓘ icon next to every widget/feature title
- Click → popover with text explanation
- Optional: link to tutorial video

### 4. Supplier Dashboard

**File: `src/app/components/dashboards/SupplierDashboard.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  דשבורד ספק                                         │
│                                                     │
│  [Summary Cards]                                     │
│  בקשות ממתינות | שריונות פעילים | דירוג | מסמכים חסרים│
│                                                     │
│  ── בקשות זמינות ממתינות ──                          │
│  ┌─────────────────────────────────────┐            │
│  │ מפיק: "טיולי אדם"                   │            │
│  │ 15/04/2026 | 45 איש | סיור ביקב    │            │
│  │ [✓ אשר]  [✗ דחה]  [↺ חלופה]        │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  ── מבצעים פעילים ──                                │
│  Your current active promotions                      │
│                                                     │
│  ── התראות מסמכים ──                                 │
│  🟡 ביטוח צד ג' — פג ב-20 ימים                      │
│                                                     │
│  ── דירוגים אחרונים ──                               │
│  ⭐⭐⭐⭐⭐ — פרויקט ABC — "מצוין!"                    │
└─────────────────────────────────────────────────────┘
```

### 5. Admin Dashboard

**File: `src/app/components/dashboards/AdminDashboard.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  דשבורד מנהל                                         │
│                                                     │
│  [Platform Summary Cards]                            │
│  סה"כ מפיקים | סה"כ ספקים | ספקים ממתינים            │
│  לידים החודש | פרויקטים פעילים | הכנסות              │
│                                                     │
│  ── אישור ספקים ──                                  │
│  Queue of pending supplier registrations             │
│  [אשר] [דחה] per supplier                           │
│                                                     │
│  ── פעילות אחרונה ──                                │
│  Recent system-wide events log                       │
│                                                     │
│  ── KPIs (PRD §11) ──                               │
│  ספקים רשומים: 45/200 | מפיקים: 12/50               │
│  הצעות שנבנו: 34/100 | מילוי פרופיל: 55%/60%       │
└─────────────────────────────────────────────────────┘
```

### 6. Backend Queries

**File: `convex/dashboard.ts`** (extend)

```ts
// Producer
morningHQ: query         — events today + tomorrow with supplier details
quoteHeatMeter: query    — quote status distribution (sent/discussing/closed/lost)
urgentAlerts: query      — expiring docs, pending reservations, missing invoices
openReservations: query  — active bookings with expiry info

// Supplier
supplierStats: query     — pending requests, active bookings, avg rating, missing docs
supplierAlerts: query    — expiring documents, pending requests

// Admin
adminStats: query        — platform-wide counts
adminKPIs: query         — PRD §11 KPIs tracking
pendingApprovals: query  — suppliers awaiting approval
```

### 7. Shared Components

**File: `src/app/components/dashboards/StatCard.tsx`** (new)

Reusable animated stat card (extract from current Dashboard.tsx).

**File: `src/app/components/dashboards/ActivityTicker.tsx`** (new)

Auto-scrolling ticker for recent activity events.

---

## New Files

| File | Type |
|------|------|
| `src/app/components/dashboards/ProducerDashboard.tsx` | Page |
| `src/app/components/dashboards/SupplierDashboard.tsx` | Page |
| `src/app/components/dashboards/AdminDashboard.tsx` | Page |
| `src/app/components/dashboards/StatCard.tsx` | Component |
| `src/app/components/dashboards/ActivityTicker.tsx` | Component |
| `src/app/components/ui/HelpTooltip.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `convex/dashboard.ts` | Add morningHQ, quoteHeatMeter, urgentAlerts, supplierStats, adminStats |
| `src/app/routes.ts` | Point each role's `/` to its dashboard |
| `src/app/components/Dashboard.tsx` | Deprecate — move logic to ProducerDashboard |
