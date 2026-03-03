# Plan 10 — Notifications System

**Phase:** 4 (Communication)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth), all previous plans (as notification sources)
**Blocks:** None

---

## Goal

Build a proper notifications backend with in-app bell panel, and prepare hooks for email/SMS/WhatsApp delivery (external sending is a stretch goal).

---

## Current State

- `NotificationsPanel.tsx` exists — derives notifications from live project + supplier data (no backend storage)
- No `notifications` table (Plan 01 adds it)
- No notification triggers from business events

---

## Implementation

### 1. Backend — Notification Functions

**File: `convex/notifications.ts`** (new)

```ts
// Queries
listForUser: query({
  args: { limit: v.optional(v.number()) },
  // Returns notifications for current user, sorted by createdAt desc
  // Default limit: 50
})

unreadCount: query({
  // Returns count of unread notifications for current user
})

// Mutations
create: mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    channel: v.optional(/* default "in_app" */),
  },
  handler: async (ctx, args) => {
    // Insert notification record
    // (Future: trigger email/SMS/WhatsApp based on channel)
  },
})

markRead: mutation({
  args: { notificationId: v.id("notifications") },
  // Set read = true
})

markAllRead: mutation({
  // Set read = true for all unread notifications of current user
})

// Internal helper (called by other mutations)
notify: internalMutation({
  args: { userId, type, title, body, link },
  // Creates notification — used by other server-side functions
})
```

### 2. Notification Triggers

Insert notification creation calls into existing and new mutations:

| Event | Recipient | Type | Title (Hebrew) | Link |
|-------|-----------|------|-----------------|------|
| New lead created | Assigned producer | `new_lead` | "ליד חדש נכנס" | `/crm/{leadId}` |
| Lead status changed | Assigned producer | `lead_status` | "ליד עודכן: {status}" | `/crm/{leadId}` |
| Availability request sent | Supplier (user) | `availability_request` | "בקשת זמינות חדשה" | `/requests` |
| Supplier approved availability | Producer | `availability_approved` | "ספק {name} אישר זמינות" | `/projects/{id}` |
| Supplier declined availability | Producer | `availability_declined` | "ספק {name} דחה בקשה" | `/projects/{id}` |
| Supplier proposed alternative | Producer | `availability_alternative` | "ספק {name} הציע חלופה" | `/projects/{id}` |
| Quote sent to client | Producer (confirmation) | `quote_sent` | "הצעת מחיר נשלחה" | `/projects/{id}` |
| Client approved quote | Producer | `quote_approved` | "לקוח אישר הצעה!" | `/projects/{id}` |
| Client requested changes | Producer | `quote_changes` | "לקוח ביקש שינויים" | `/projects/{id}` |
| New message received | Recipient | `new_message` | "הודעה חדשה מ-{sender}" | `/messages/{convId}` |
| Supplier pending approval | Admin | `supplier_pending` | "ספק חדש ממתין לאישור" | `/approve-suppliers` |
| Supplier approved by admin | Supplier | `supplier_approved` | "חשבונך אושר!" | `/` |
| Document expiring (≤30 days) | Supplier | `doc_expiring` | "מסמך {name} עומד לפוג" | `/documents` |
| Document expired | Supplier + linked producers | `doc_expired` | "מסמך {name} פג תוקף" | `/documents` |
| Order confirmed (all approved) | All involved suppliers | `order_confirmed` | "ההזמנה אושרה!" | `/requests` |

### 3. Rewrite NotificationsPanel

**File: `src/app/components/NotificationsPanel.tsx`** (rewrite)

Replace the current derived-data approach with backend-backed notifications:

```
┌─────────────────────────────────┐
│  🔔 התראות              [סמן הכל כנקרא] │
│                                 │
│  ── היום ──                      │
│  ┌─────────────────────────────┐│
│  │ 🟢 ספק "יקב הגולן" אישר    ││
│  │    זמינות                    ││
│  │    לפני 5 דקות               ││
│  ├─────────────────────────────┤│
│  │ 🔵 ליד חדש נכנס: דני כהן   ││
│  │    מקור: Facebook            ││
│  │    לפני 2 שעות               ││
│  ├─────────────────────────────┤│
│  │ 🟡 מסמך "ביטוח צד ג'" של   ││
│  │    ספק "שף אבי" עומד לפוג   ││
│  │    לפני 3 שעות               ││
│  └─────────────────────────────┘│
│                                 │
│  ── אתמול ──                     │
│  ...                            │
│                                 │
│  [הצג הכל]                       │
└─────────────────────────────────┘
```

Features:
- Bell icon in header with unread count badge (red dot with number)
- Click bell → dropdown panel
- Each notification: icon (color-coded by type), title, body, relative timestamp
- Click notification → navigate to `link` + mark as read
- "Mark all as read" button
- Group by day (today, yesterday, older)
- Uses `useQuery(api.notifications.listForUser)` — real-time

### 4. Notification Type Icons/Colors

```ts
const notificationStyles: Record<string, { icon: LucideIcon; color: string }> = {
  new_lead:                 { icon: Target,       color: "blue" },
  availability_request:     { icon: Calendar,     color: "purple" },
  availability_approved:    { icon: CheckCircle,  color: "green" },
  availability_declined:    { icon: XCircle,      color: "red" },
  availability_alternative: { icon: RefreshCw,    color: "orange" },
  quote_approved:           { icon: PartyPopper,  color: "green" },
  quote_changes:            { icon: MessageSquare, color: "yellow" },
  new_message:              { icon: MessageCircle, color: "blue" },
  supplier_pending:         { icon: UserPlus,     color: "purple" },
  supplier_approved:        { icon: ShieldCheck,  color: "green" },
  doc_expiring:             { icon: AlertTriangle, color: "yellow" },
  doc_expired:              { icon: AlertOctagon, color: "red" },
  order_confirmed:          { icon: CheckCheck,   color: "green" },
};
```

### 5. Document Expiry Check (Scheduled)

**File: `convex/crons.ts`** (new — or `convex/scheduled.ts`)

Convex supports scheduled functions. Create a daily cron that:
1. Queries all supplier documents
2. Finds documents expiring within 30 days → creates "doc_expiring" notification
3. Finds expired documents → creates "doc_expired" notification
4. Deduplicates (don't re-notify for already-notified docs)

```ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.daily(
  "check-document-expiry",
  { hourUTC: 6, minuteUTC: 0 },  // 9:00 Israel time
  internal.notifications.checkDocumentExpiry
);
export default crons;
```

### 6. Full Notifications Page (Optional)

**File: `src/app/components/NotificationsFullPage.tsx`** (new, optional)

If the user clicks "הצג הכל" in the panel, show a full page with:
- All notifications with pagination
- Filter by type
- Bulk mark as read

---

## New Files

| File | Type |
|------|------|
| `convex/notifications.ts` | Backend |
| `convex/crons.ts` | Scheduled jobs |
| `src/app/components/NotificationsFullPage.tsx` | Page (optional) |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/NotificationsPanel.tsx` | Full rewrite — backend-backed |
| `src/app/components/Layout.tsx` | Unread badge on bell icon |
| `convex/availabilityRequests.ts` | Add notify calls on create/respond |
| `convex/publicQuote.ts` | Add notify on approve/requestChanges |
| `convex/leads.ts` | Add notify on create/statusChange |
| `convex/messages.ts` | Add notify on send |
| `convex/users.ts` | Add notify on supplier approval |

## External Delivery (Stretch)

Email, SMS, and WhatsApp delivery require external services:
- **Email:** Convex action calling Resend/SendGrid API
- **SMS:** Convex action calling Twilio API
- **WhatsApp:** Convex action calling WhatsApp Business API

These are Phase 5/stretch goals. The in-app notification system works independently.
