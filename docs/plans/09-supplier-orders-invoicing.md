# Plan 09 — Supplier Orders & Invoicing

**Phase:** 3 (Proposal Builder — PRD Priority #2)
**Depends on:** Plan 07 (Availability & Booking), Plan 08 (Client Proposal Page)
**Blocks:** Plan 11 (Field Operations — needs confirmed orders)
**PRD refs:** §4.5 (Supplier Orders), §5.3 (Project — Invoice Tracking)

---

## Goal

Auto-generate orders per supplier after deal close, support custom supplier order formats, track invoices per supplier per project, and block project archive until all invoices are received.

---

## Current State

- No order generation system exists
- No invoice tracking
- Projects have basic status field but no archive gate
- After client approves quote, nothing happens on the supplier side automatically

---

## Implementation

### 1. Auto-Generate Orders on Deal Close (PRD §4.5)

When project status changes to "אושר" (client approved):

**File: `convex/supplierOrders.ts`** (new)

```ts
generateOrdersForProject: mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    const items = await ctx.db.query("quoteItems")
      .withIndex("by_projectId", q => q.eq("projectId", projectId))
      .collect();

    for (const item of items) {
      if (!item.supplierId) continue;

      const supplier = await ctx.db.get(item.supplierId);

      await ctx.db.insert("supplierOrders", {
        projectId,
        supplierId: item.supplierId,
        productId: item.productId,
        bookingId: /* find linked booking */,
        clientName: project.clientName || project.name,
        date: project.eventDate,
        time: item.startTime,
        participants: project.participants,
        agreedPrice: item.producerPrice || item.cost,
        contactName: project.contactName,
        contactPhone: project.contactPhone,
        usesCustomFormat: supplier?.usesCustomOrderFormat || false,
        customFormatNotes: supplier?.customOrderFormatNotes,
        status: "pending",
        createdAt: Date.now(),
      });

      // Create invoice tracking record
      await ctx.db.insert("invoiceTracking", {
        projectId,
        supplierId: item.supplierId,
        status: "pending",
        createdAt: Date.now(),
      });
    }

    // Set project archiveBlocked = true
    await ctx.db.patch(projectId, { archiveBlocked: true });
  },
})
```

**Order format per PRD §4.5:**
- Client name
- Date & time
- Number of participants
- Agreed price
- Contact person name & phone
- Note if supplier uses custom format

### 2. Order Management Page (Producer View)

**File: `src/app/components/orders/ProjectOrders.tsx`** (new)

Accessible from project detail / QuoteEditor:

```
┌─────────────────────────────────────────────────────┐
│  הזמנות לספקים — פרויקט "גיבוש ABC"                  │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ 📋 יקב הגולן — סיור ביקב           │            │
│  │ תאריך: 15/04 | 45 איש | ₪70/אדם   │            │
│  │ סטטוס: ⏳ ממתין לשליחה              │            │
│  │ ⚠️ ספק משתמש בפורמט משלו           │            │
│  │ [📤 שלח הזמנה] [✏️ ערוך] [🗑 בטל]   │            │
│  ├─────────────────────────────────────┤            │
│  │ 📋 שף אבי — ארוחת צהריים           │            │
│  │ תאריך: 15/04 | 45 איש | ₪85/אדם   │            │
│  │ סטטוס: ✅ נשלח + אושר               │            │
│  │ [📄 צפה בהזמנה]                     │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  [📤 שלח הכל] — sends all pending orders            │
└─────────────────────────────────────────────────────┘
```

### 3. Send Order to Supplier

**File: `convex/supplierOrders.ts`** (extend)

```ts
sendOrder: action({
  args: { orderId: v.id("supplierOrders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(/* get order + supplier details */);

    // Send via WhatsApp/SMS/Email (same channels as availability)
    // Message: "הזמנה חדשה מ-{producer}: {client}, {date}, {participants} איש"
    // Include link to view/confirm order

    // Update status to "sent"
    await ctx.runMutation(/* patch order status */);
  },
})

confirmOrder: mutation({
  args: { orderId: v.id("supplierOrders") },
  // Supplier confirms they received and accepted the order
  // Status → "confirmed"
})
```

### 4. Custom Order Format Support (PRD §4.5)

Some suppliers send orders in their own format. The system handles this:

- `suppliers.usesCustomOrderFormat: boolean` — flag on supplier profile
- `suppliers.customOrderFormatNotes: string` — notes about their format
- When generating order: show warning "ספק משתמש בפורמט משלו"
- Producer can download standard order as PDF AND note the custom format requirement
- Future: allow uploading supplier's custom order template

### 5. Invoice Tracking (PRD §5.3)

**File: `src/app/components/orders/InvoiceTracker.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  מעקב חשבוניות — פרויקט "גיבוש ABC"                  │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ יקב הגולן                           │            │
│  │ סכום מוסכם: ₪3,150                  │            │
│  │ חשבונית: ❌ לא התקבלה               │            │
│  │ [📤 העלה חשבונית] [📧 שלח תזכורת]   │            │
│  ├─────────────────────────────────────┤            │
│  │ שף אבי                              │            │
│  │ סכום מוסכם: ₪3,825                  │            │
│  │ חשבונית: ✅ התקבלה | #1234          │            │
│  │ [📄 צפה]                            │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  📊 סטטוס: 1/2 חשבוניות התקבלו                      │
│  ⚠️ לא ניתן להעביר פרויקט לארכיון עד לקבלת הכל     │
└─────────────────────────────────────────────────────┘
```

**Backend: `convex/invoiceTracking.ts`** (new)

```ts
listByProject     — all invoice records for a project
markReceived      — upload invoice file, mark as received
sendReminder      — send nagging notification to producer
checkProjectComplete — are all invoices received?
```

### 6. Archive Gate (PRD §5.3)

When producer tries to archive/complete a project:

1. Check if all `invoiceTracking` records have status = "received" or "verified"
2. If any pending: show warning and block archive
3. "המערכת מציקה עד שכל חשבונית הוזנה" — reminder notification cron

**Cron addition to `convex/crons.ts`:**
```ts
crons.daily(
  "nag-missing-invoices",
  { hourUTC: 8, minuteUTC: 0 },  // 11:00 Israel time
  internal.invoiceTracking.sendNagReminders
);
```

`sendNagReminders` logic:
- Find projects with status "completed" but `archiveBlocked = true`
- For each: list missing invoices
- Send notification: "פרויקט {name}: חסרות {n} חשבוניות — {supplier names}"

### 7. Order Cancellation (PRD §4.4)

**File: `convex/supplierOrders.ts`** (extend)

```ts
cancelOrder: mutation({
  args: { orderId: v.id("supplierOrders"), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Set status to "cancelled"
    // Cancel linked booking if exists
    // Send notification to supplier (all channels)
    // Message: "ההזמנה ל-{date} בוטלה. סיבה: {reason}"
  },
})
```

---

## New Files

| File | Type |
|------|------|
| `convex/supplierOrders.ts` | Backend |
| `convex/invoiceTracking.ts` | Backend |
| `src/app/components/orders/ProjectOrders.tsx` | Page |
| `src/app/components/orders/InvoiceTracker.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `convex/publicQuote.ts` | Trigger order generation on approval |
| `convex/projects.ts` | Add archiveBlocked logic, prevent archive if invoices missing |
| `convex/crons.ts` | Add invoice nagging cron |
| `src/app/components/QuoteEditor.tsx` | Link to orders page post-approval |
