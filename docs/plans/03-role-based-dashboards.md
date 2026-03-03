# Plan 03 — Role-Based Dashboards

**Phase:** 2 (Core Features)
**Depends on:** Plan 02 (Multi-Role Auth)
**Blocks:** None directly

---

## Goal

Replace the single `Dashboard.tsx` with 3 role-specific dashboards: Producer, Supplier, Admin.

---

## Current State

- `Dashboard.tsx` — animated stats (suppliers, projects, revenue), pipeline summary cards, activity ticker, Recharts line chart
- `convex/dashboard.ts` — single `stats` query returning supplier/project/revenue aggregates
- This dashboard is producer-oriented; reuse what makes sense

---

## Implementation

### 1. Producer Dashboard (refactor existing)

**File: `src/app/components/dashboards/ProducerDashboard.tsx`** (new — move from Dashboard.tsx)

Keep existing widgets, add:

```
┌─────────────────────────────────────────────────────┐
│  [Summary Cards]                                     │
│  לידים חדשים | פרויקטים | ספקים פעילים | הכנסות חודשי │ ממתין לאישור │
│                                                     │
│  [Update Ticker — auto-scroll]                       │
│  "ספק X אישר זמינות" / "ליד חדש מ-Instagram"       │
│                                                     │
│  [Recent Leads — compact table]                      │
│  שם | מקור | תאריך | סטטוס | פעולה                  │
│                                                     │
│  [Active Projects — cards]                           │
│  [Urgent Kanban Tasks]                               │
│                                                     │
│  [Revenue Chart — existing Recharts]                 │
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/dashboard.ts`** (extend)

Add new queries:
- `producerStats` — current stats + lead counts + pending availability responses
- `recentLeads` — last 5 leads for the current producer
- `urgentTasks` — kanban tasks with priority="urgent" or "high"
- `activityFeed` — recent system events (lead created, supplier responded, quote approved)

### 2. Supplier Dashboard

**File: `src/app/components/dashboards/SupplierDashboard.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  [Summary Cards]                                     │
│  בקשות ממתינות | הזמנות החודש | דירוג ממוצע | מסמכים חסרים │
│                                                     │
│  [Pending Availability Requests — URGENT]            │
│  ┌─────────────────────────────────────┐            │
│  │ פרויקט "טיול גיבוש חברת ABC"        │            │
│  │ תאריך: 15/04/2026 | 45 משתתפים     │            │
│  │ מוצר מבוקש: "סיור ביקב"             │            │
│  │ [אשר ✓]  [דחה ✗]  [הצע חלופה ↺]   │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  [Recent Messages]                                   │
│  [Document Alerts — expiring / missing]              │
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/dashboard.ts`** (extend)

- `supplierStats` — count pending requests, month's orders, avg rating, missing docs
- `pendingAvailabilityForSupplier` — availability requests for current user's supplier
- `supplierDocumentAlerts` — docs expiring within 30 days or missing

### 3. Admin Dashboard

**File: `src/app/components/dashboards/AdminDashboard.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  [Platform Summary Cards]                            │
│  סה"כ מפיקים | סה"כ ספקים | ספקים ממתינים לאישור    │
│  לידים החודש | פרויקטים פעילים | הכנסות              │
│                                                     │
│  [Supplier Approval Queue]                           │
│  שם עסק | קטגוריה | תאריך הרשמה | [אשר] [דחה]     │
│                                                     │
│  [User Management — compact]                         │
│  Recent signups, active users count                  │
│                                                     │
│  [System Activity Log — last 10]                     │
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/dashboard.ts`** (extend)

- `adminStats` — platform-wide counts (producers, suppliers, pending, leads this month, revenue)
- `pendingSupplierApprovals` — suppliers with registrationStatus="pending"
- `recentActivityLog` — system-wide recent events

### 4. Router Integration

**File: `src/app/routes.ts`** (modify)

Each role's route config uses its own dashboard at `/`:
```ts
producerRoutes: { path: "/", element: ProducerDashboard }
supplierRoutes: { path: "/", element: SupplierDashboard }
adminRoutes:    { path: "/", element: AdminDashboard }
```

### 5. Shared Components

**File: `src/app/components/dashboards/StatCard.tsx`** (new)

Reusable animated stat card (extract from current Dashboard.tsx):
```ts
interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; direction: "up" | "down" };
  color?: string;
}
```

**File: `src/app/components/dashboards/ActivityTicker.tsx`** (new)

Auto-scrolling ticker for recent activity events (extract from current Dashboard.tsx).

---

## New Files

| File | Type |
|------|------|
| `src/app/components/dashboards/ProducerDashboard.tsx` | Page |
| `src/app/components/dashboards/SupplierDashboard.tsx` | Page |
| `src/app/components/dashboards/AdminDashboard.tsx` | Page |
| `src/app/components/dashboards/StatCard.tsx` | Component |
| `src/app/components/dashboards/ActivityTicker.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `convex/dashboard.ts` | Add producerStats, supplierStats, adminStats, activityFeed queries |
| `src/app/routes.ts` | Point each role's `/` to its dashboard |
| `src/app/components/Dashboard.tsx` | Deprecate — move logic to ProducerDashboard |
