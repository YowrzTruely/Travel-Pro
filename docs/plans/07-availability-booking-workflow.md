# Plan 07 — Availability & Booking Workflow

**Phase:** 3 (Proposal Builder — PRD Priority #2)
**Depends on:** Plan 03 (Supplier Profile), Plan 06 (Quote Editor Enhancements)
**Blocks:** Plan 08 (Client Proposal Page), Plan 09 (Supplier Orders)
**PRD refs:** §4.4 (Availability & Booking), §3.1 (Unregistered Supplier Flow)

---

## Goal

Build the full availability request + booking/reservation workflow with multi-channel notifications (WhatsApp + SMS + email), unregistered supplier signup flow, booking with expiry timer, and cancellation with supplier notification.

---

## Current State

- No availability request system exists
- QuoteEditor items have a `status` field (text) but it's not used for availability
- Plan 01 adds `availabilityRequests` and `bookings` tables
- Plan 03 adds supplier-side availability calendar
- Plan 06 adds the "בדוק זמינות" button in QuoteEditor

---

## The Full Flow (PRD §4.4)

```
Producer (QuoteEditor)                    Supplier
        │                                         │
        │  1. Click "בדוק זמינות" on item          │
        │  ──────────────────────────────────►     │
        │  Creates availabilityRequest              │
        │  Sends: WhatsApp + SMS + Email           │
        │                                          │
        │                    2. Supplier receives    │
        │                    notification with link  │
        │                                          │
        │  If supplier NOT registered:              │
        │  ──────────────────────────────────►     │
        │  Link includes registration flow          │
        │  "היי {ספק}, ה{מפיק} בודק איתך זמינות..." │
        │  Register → then respond                  │
        │                                          │
        │                    3. Supplier responds:   │
        │                    ┌─ ✓ Approve → Book     │
        │                    ├─ ✗ Decline             │
        │                    └─ ↺ Propose alternative│
        │                                          │
        │  ◄──────────────────────────────────     │
        │  4. Status updates in real-time           │
        │                                          │
        │  If approved:                             │
        │  5. Booking created with expiry timer     │
        │  Producer gets reminder to extend/cancel  │
        │                                          │
        │  If declined/alternative:                 │
        │  5. Producer sees options,                │
        │     picks alternative or new supplier     │
        │                                          │
        │  Cancellation:                            │
        │  6. Cancel button → confirm → notify      │
        │     supplier via all channels             │
```

---

## Implementation

### 1. Backend — Availability Requests

**File: `convex/availabilityRequests.ts`** (new)

```ts
// Queries
listByProject       — all requests for a project (producer view)
listBySupplier      — all requests for a supplier (supplier view)
listPendingBySupplier — pending requests only (supplier dashboard)
getByQuoteItem      — latest request for a specific quote item

// Mutations
create: mutation({
  args: {
    quoteItemId: v.id("quoteItems"),
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    date: v.string(),
    participants: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create request with status "pending"
    // Update quoteItem.availabilityStatus to "pending"
    // Send multi-channel notification (see below)
    // If supplier not registered → trigger availability invite flow (Plan 02)
  },
})

respond: mutation({
  args: {
    requestId: v.id("availabilityRequests"),
    status: v.union(v.literal("approved"), v.literal("declined"), v.literal("alternative_proposed")),
    responseNotes: v.optional(v.string()),
    alternativeProductId: v.optional(v.id("supplierProducts")),
    alternativeDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Update request status + respondedAt
    // Update linked quoteItem.availabilityStatus
    // If approved → create booking record
    // Notify producer via in-app notification
    // If alternative_proposed → include alternative details
  },
})

createBulk: mutation({
  args: { projectId: v.id("projects") },
  // For each quoteItem with availabilityStatus = "not_checked":
  //   create an availability request
  //   send notifications
})
```

### 2. Multi-Channel Notifications (PRD §4.4)

**File: `convex/notificationSender.ts`** (new — Convex action)

```ts
sendAvailabilityRequest: action({
  args: {
    supplierPhone: v.string(),
    supplierEmail: v.optional(v.string()),
    supplierName: v.string(),
    producerName: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    serviceName: v.string(),
    responseLink: v.string(),
    isRegistered: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Send via all channels:
    // 1. WhatsApp (WhatsApp Business API)
    // 2. SMS (Twilio)
    // 3. Email (Resend/SendGrid)
    //
    // Message template (PRD §3.1):
    // "היי {ספק}, ה{מפיק} בודק איתך זמינות בנוגע ל{שירות}
    //  שמתוכנן ב{תאריך} ב{שעה}.
    //  כדי לאשר/לדחות, לחץ כאן: {link}"
    //
    // If not registered: link goes to registration + respond page
    // If registered: link goes directly to respond page
  },
})
```

**Channels per PRD §4.4:**
- WhatsApp Business API — primary channel (Israel preference)
- SMS via Twilio — fallback
- Email — tertiary
- In-app notification — always (if registered)

### 3. Unregistered Supplier Flow (PRD §3.1, §4.4)

When producer checks availability for a supplier not in the system:

1. Producer enters supplier phone number in QuoteEditor
2. System sends WhatsApp/SMS with magic link
3. Message includes event context (date, service, producer name)
4. Supplier clicks link → `/availability-invite/:token`
5. If not registered: quick registration (Stage 1 only) → respond to request
6. If already registered: login → respond to request

**Flow:**
```
Producer enters phone → System sends link → Supplier registers → Supplier responds
                                                                → Booking created
```

### 4. Booking/Reservation with Expiry (PRD §4.4)

**File: `convex/bookings.ts`** (new)

```ts
// When supplier approves availability → auto-create booking
create: mutation({
  args: {
    availabilityRequestId, projectId, supplierId, productId, date, participants,
    expiryDays: v.optional(v.number()),  // default 7 days
  },
  handler: async (ctx, args) => {
    // Create booking with status "reserved"
    // Set expiresAt = now + expiryDays
    // Schedule expiry check
  },
})

// Producer confirms booking (after client approval)
confirm: mutation({
  args: { bookingId },
  handler: async (ctx, args) => {
    // Set status to "confirmed"
    // Remove expiry timer
    // Notify supplier
  },
})

// Cancel booking
cancel: mutation({
  args: { bookingId, reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Set status to "cancelled"
    // Send cancellation notification to supplier (all channels)
    // Update quoteItem availability status
  },
})

// Cron: check for expired reservations
checkExpired: internalMutation({
  // Query bookings where expiresAt < now and status = "reserved"
  // Set status to "expired"
  // Notify producer: "שריון עם {ספק} פג תוקף"
})
```

**Cron addition to `convex/crons.ts`:**
```ts
crons.hourly(
  "check-booking-expiry",
  { minuteUTC: 0 },
  internal.bookings.checkExpired
);
```

### 5. Supplier Side — Respond to Requests

**File: `src/app/components/supplier/RequestsPage.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  בקשות & הזמנות                                      │
│                                                     │
│  Tabs: [בקשות ממתינות (3)] [שריונות פעילים] [היסטוריה]│
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ מפיק: "טיולי אדם"                   │            │
│  │ תאריך: 15/04/2026 | שעה: 10:00     │            │
│  │ מוצר: "סיור ביקב + טעימות"           │            │
│  │ כמות: 45 איש                         │            │
│  │ הערות: "צריך נגישות"                 │            │
│  │                                     │            │
│  │ [✓ אשר]  [✗ דחה]  [↺ הצע חלופה]    │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  [שריונות פעילים tab]                                │
│  תאריך | מפיק | מוצר | סטטוס | פג ב-               │
│  15/04 | אדם | סיור | 🟢 שמור | 22/03              │
│  [בטל שריון]                                        │
└─────────────────────────────────────────────────────┘
```

Response flows:
- **Approve:** confirm modal → creates booking → card moves to "שריונות פעילים"
- **Decline:** reason textarea → notify producer → card disappears
- **Propose alternative:** select different product/date → notify producer

### 6. Alternative Proposal View (Producer Side)

**File: `src/app/components/AlternativeProposalCard.tsx`** (new)

When supplier proposes alternative, show inline on quote item:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ ספק הציע חלופה:                                  │
│                                                     │
│  במקום: "סיור ביקב הגולן" (15/04)                   │
│  הציע: "סיור ביקב — מסלול קצר" (16/04)             │
│  מחיר: ₪70/אדם (במקום ₪80)                         │
│  הערת ספק: "ב-15 יש אירוע פרטי, ב-16 פנוי"         │
│                                                     │
│  [✓ קבל חלופה]  [↺ חפש ספק אחר]  [✗ דחה]           │
└─────────────────────────────────────────────────────┘
```

### 7. Availability Summary Bar

Add summary at top of QuoteEditor:

```
זמינות: 3/5 אושרו | 1 ממתין | 1 לא נבדק
[████████████░░░░░░░░] 60%

שריונות: 2 פעילים | 1 פג ב-3 ימים ⚠️
```

---

## New Files

| File | Type |
|------|------|
| `convex/availabilityRequests.ts` | Backend |
| `convex/bookings.ts` | Backend |
| `convex/notificationSender.ts` | Backend action (WhatsApp/SMS/email) |
| `src/app/components/supplier/RequestsPage.tsx` | Page |
| `src/app/components/AlternativeProposalCard.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/QuoteEditor.tsx` | Per-item availability, bulk check, summary bar, booking status |
| `src/app/components/ItemEditor.tsx` | Send request button, show response |
| `convex/quoteItems.ts` | Update availabilityStatus on request responses |
| `convex/crons.ts` | Add booking expiry cron |
