# Plan 13 — Notifications System

**Phase:** 6 (Dashboard & Assets — PRD Priority #5)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth), all previous plans (as notification sources)
**Blocks:** None
**PRD refs:** §4.4 (Multi-channel notifications), §3.4 (Document expiry), §9 (WhatsApp/SMS integration)

---

## Goal

Build a multi-channel notification system as an MVP requirement: WhatsApp Business API + SMS via Twilio + email, with in-app bell panel. Document expiry cron, "I don't have it" reminder cron, reservation expiry alerts, invoice nagging, and rewrite of NotificationsPanel.

---

## Current State

- `NotificationsPanel.tsx` exists — derives notifications from live project + supplier data (no backend storage)
- No `notifications` table (Plan 01 adds it)
- No notification triggers from business events
- No external delivery (WhatsApp/SMS/email)

---

## Implementation

### 1. External Notification Channels (MVP Requirement per PRD §9)

Unlike the old plan that treated external delivery as "stretch", the PRD mandates multi-channel notifications for MVP.

**File: `convex/notificationSender.ts`** (new/extend from Plan 07)

```ts
// WhatsApp Business API
sendWhatsApp: action({
  args: { phone: v.string(), message: v.string(), templateId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Call WhatsApp Business API
    // Use approved message templates for notifications
    // Track delivery status
  },
})

// SMS via Twilio
sendSMS: action({
  args: { phone: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    // Call Twilio SMS API
    // Track delivery status
  },
})

// Email
sendEmail: action({
  args: { email: v.string(), subject: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    // Call Resend/SendGrid API
    // Track delivery status
  },
})

// Multi-channel sender — sends via all available channels
sendMultiChannel: action({
  args: {
    userId: v.optional(v.id("users")),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    channels: v.array(v.string()),  // ["whatsapp", "sms", "email", "in_app"]
  },
  handler: async (ctx, args) => {
    // Send via each requested channel
    // Create in-app notification record
    // Track delivery status per channel
  },
})
```

### 2. Notification Backend

**File: `convex/notifications.ts`** (new)

```ts
// Queries
listForUser: query       — notifications for current user, sorted by createdAt desc
unreadCount: query       — count of unread for badge
listByType: query        — filter by notification type

// Mutations
create: mutation         — create in-app notification
markRead: mutation       — mark single as read
markAllRead: mutation    — mark all as read

// Internal (called by other mutations)
notify: internalMutation — creates notification + triggers external delivery
```

### 3. Notification Triggers

| Event | Recipient | Type | Channels | PRD Ref |
|-------|-----------|------|----------|---------|
| Availability request | Supplier | `availability_request` | WhatsApp + SMS + Email + In-app | §4.4 |
| Supplier approved availability | Producer | `availability_approved` | In-app | §4.4 |
| Supplier declined | Producer | `availability_declined` | In-app | §4.4 |
| Supplier proposed alternative | Producer | `availability_alternative` | In-app | §4.4 |
| Booking reservation expiring | Producer | `booking_expiring` | In-app | §4.4 |
| Booking expired | Producer + Supplier | `booking_expired` | WhatsApp + In-app | §4.4 |
| Booking cancelled | Supplier | `booking_cancelled` | WhatsApp + SMS + In-app | §4.4 |
| Time shift (field ops) | Upcoming suppliers | `time_shift` | WhatsApp (Magic Link) | §6 |
| Quantity update (food) | Food supplier | `quantity_update` | WhatsApp | §6 |
| Client approved quote | Producer + Suppliers | `quote_approved` | In-app + Email | §4.1 |
| Client requested changes | Producer | `quote_changes` | In-app | §4.3 |
| New lead | Producer | `new_lead` | In-app | §5.1 |
| Document expiring (7 days) | Supplier | `doc_expiring` | In-app + Email | §3.4 |
| Document expired | Supplier + Producers | `doc_expired` | In-app + WhatsApp | §3.4 |
| "I don't have it" reminder | Supplier | `doc_reminder` | In-app + WhatsApp | §3.4 |
| Missing invoices nag | Producer | `invoice_missing` | In-app | §5.3 |
| Supplier pending approval | Admin | `supplier_pending` | In-app | §3.1 |
| Supplier approved by admin | Supplier | `supplier_approved` | In-app + Email | §3.1 |
| Order sent to supplier | Supplier | `order_sent` | WhatsApp + SMS + Email | §4.5 |

### 4. Cron Jobs

**File: `convex/crons.ts`** (extend)

```ts
// Already added in Plan 04:
crons.daily("check-document-expiry", { hourUTC: 6 }, internal.supplierDocuments.checkExpiry);
crons.daily("send-document-reminders", { hourUTC: 7 }, internal.supplierDocuments.sendReminders);

// Already added in Plan 07:
crons.hourly("check-booking-expiry", { minuteUTC: 0 }, internal.bookings.checkExpired);

// Already added in Plan 09:
crons.daily("nag-missing-invoices", { hourUTC: 8 }, internal.invoiceTracking.sendNagReminders);

// New:
crons.daily(
  "check-reservation-expiry-alerts",
  { hourUTC: 5, minuteUTC: 0 },  // 8:00 Israel
  internal.bookings.sendExpiryAlerts  // reservations expiring in 2 days
);

crons.daily(
  "deactivate-expired-promotions",
  { hourUTC: 0, minuteUTC: 0 },
  internal.supplierPromotions.deactivateExpired
);
```

### 5. Rewrite NotificationsPanel

**File: `src/app/components/NotificationsPanel.tsx`** (rewrite)

```
┌─────────────────────────────────┐
│  🔔 התראות (5)    [סמן הכל כנקרא]│
│                                 │
│  ── היום ──                      │
│  ┌─────────────────────────────┐│
│  │ 🟢 ספק "יקב הגולן" אישר    ││
│  │    זמינות ל-15/04            ││
│  │    לפני 5 דקות               ││
│  ├─────────────────────────────┤│
│  │ 🔴 ביטוח פג — שף אבי        ││
│  │    יש להעלות ביטוח חדש       ││
│  │    לפני שעה                  ││
│  ├─────────────────────────────┤│
│  │ 🔵 ליד חדש — דני כהן        ││
│  │    מקור: Facebook            ││
│  │    לפני 2 שעות               ││
│  └─────────────────────────────┘│
│                                 │
│  ── אתמול ──                     │
│  ...                            │
│                                 │
│  [הצג הכל →]                     │
└─────────────────────────────────┘
```

Features:
- Bell icon in header with unread count badge
- Click bell → dropdown panel
- Color-coded icons per notification type
- Click notification → navigate to `link` + mark as read
- "Mark all as read" button
- Group by day
- Delivery status indicators for external channels

### 6. Notification Type Styling

```ts
const notificationStyles = {
  availability_request:     { icon: Calendar,      color: "purple" },
  availability_approved:    { icon: CheckCircle,   color: "green" },
  availability_declined:    { icon: XCircle,       color: "red" },
  availability_alternative: { icon: RefreshCw,     color: "orange" },
  booking_expiring:         { icon: Clock,         color: "yellow" },
  booking_expired:          { icon: AlertTriangle, color: "red" },
  booking_cancelled:        { icon: XOctagon,      color: "red" },
  quote_approved:           { icon: PartyPopper,   color: "green" },
  quote_changes:            { icon: MessageSquare, color: "yellow" },
  new_lead:                 { icon: Target,        color: "blue" },
  doc_expiring:             { icon: AlertTriangle, color: "yellow" },
  doc_expired:              { icon: AlertOctagon,  color: "red" },
  doc_reminder:             { icon: Bell,          color: "orange" },
  invoice_missing:          { icon: FileWarning,   color: "orange" },
  supplier_pending:         { icon: UserPlus,      color: "purple" },
  supplier_approved:        { icon: ShieldCheck,   color: "green" },
  order_sent:               { icon: Send,          color: "blue" },
  time_shift:               { icon: Clock,         color: "blue" },
  quantity_update:           { icon: Users,         color: "blue" },
};
```

---

## New Files

| File | Type |
|------|------|
| `convex/notifications.ts` | Backend |
| `convex/notificationSender.ts` | Backend action (WhatsApp/SMS/Email) |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/NotificationsPanel.tsx` | Full rewrite — backend-backed, multi-channel |
| `src/app/components/Layout.tsx` | Unread badge on bell icon |
| `convex/crons.ts` | Add reservation expiry alerts, promotion deactivation |
| Various mutation files | Insert notify() calls on key events |

## Environment Variables Required

```env
# WhatsApp Business API
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...

# Twilio (SMS)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Email (Resend or SendGrid)
RESEND_API_KEY=...
# or
SENDGRID_API_KEY=...
```
