# Plan 07 — Availability Workflow

**Phase:** 3 (Business Logic)
**Depends on:** Plan 05 (Supplier Portal), Plan 06 (Quote Editor Enhancements)
**Blocks:** Plan 08 (Client Quote Enhancements)

---

## Goal

Build the full producer→supplier availability request/response cycle: producer sends request, supplier receives and responds (approve/decline/propose alternative), producer sees status updates in real-time.

---

## Current State

- No availability request system exists
- QuoteEditor items have a `status` field (text) but it's not used for availability
- Plan 01 adds `availabilityRequests` table
- Plan 05 adds supplier-side `RequestsPage`
- Plan 06 adds the "בדוק זמינות" button in QuoteEditor

---

## The Full Flow

```
Producer (QuoteEditor)                    Supplier (RequestsPage)
        │                                         │
        │  1. Click "בדוק זמינות" on item          │
        │  ──────────────────────────────────►     │
        │  Creates availabilityRequest              │
        │  Status: "pending"                        │
        │                                          │
        │                    2. Supplier sees request│
        │                    in dashboard + requests │
        │                    page                    │
        │                                          │
        │                    3. Supplier responds:   │
        │                    ┌─ ✓ Approve            │
        │                    ├─ ✗ Decline            │
        │                    └─ ↺ Propose alternative│
        │                                          │
        │  ◄──────────────────────────────────     │
        │  4. Status updates in real-time           │
        │  (Convex reactive queries)                │
        │                                          │
        │  If declined/alternative:                 │
        │  5. Producer sees options,                │
        │     picks alternative supplier,           │
        │     sends new request                     │
        │     (loop back to step 1)                 │
        │                                          │
        │  If all approved:                         │
        │  6. Quote ready to send to client         │
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
    // Create notification for supplier (Plan 10)
    // Return request ID
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
    // Create notification for producer (Plan 10)
    // If alternative_proposed, include the alternative details
  },
})

// Bulk check — send requests for all unchecked items at once
createBulk: mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // For each quoteItem with availabilityStatus = "not_checked":
    //   create an availability request
    //   update quoteItem status
  },
})
```

### 2. Producer Side — QuoteEditor Integration

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Per-item changes:
- "בדוק זמינות" button calls `availabilityRequests.create`
- Status badge reads from `quoteItem.availabilityStatus` (reactive — auto-updates when supplier responds)
- When status becomes "declined" or "alternative_proposed", show inline notification with response details

Add bulk action button:
```
[בדוק זמינות לכל הפריטים] → calls availabilityRequests.createBulk
```

### 3. Alternative Proposal View (Producer Side)

**File: `src/app/components/AlternativeProposalCard.tsx`** (new)

When a supplier proposes an alternative, show it inline on the quote item:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ ספק הציע חלופה:                                  │
│                                                     │
│  במקום: "סיור ביקב הגולן" (15/04)                   │
│  הציע: "סיור ביקב הגולן — מסלול קצר" (16/04)       │
│  מחיר: ₪70/אדם (במקום ₪80)                         │
│  הערת ספק: "ב-15 יש אירוע פרטי, ב-16 פנוי"         │
│                                                     │
│  [✓ קבל חלופה]  [↺ חפש ספק אחר]  [✗ דחה]           │
└─────────────────────────────────────────────────────┘
```

Actions:
- "קבל חלופה" → update quote item with new product/date, set availability to "approved"
- "חפש ספק אחר" → open AlternativesModal (from Plan 06)
- "דחה" → keep current item, mark as needing manual resolution

### 4. Supplier Side — Respond to Requests

**File: `src/app/components/supplier/RequestsPage.tsx`** (enhance from Plan 05)

The request card already shows request details. Add the response flow:

**Approve flow:**
1. Click "אשר ✓"
2. Confirm modal: "אתה מאשר זמינות ל-15/04/2026, 45 איש?"
3. Calls `availabilityRequests.respond({ status: "approved" })`
4. Card moves to "הזמנות מאושרות" tab

**Decline flow:**
1. Click "דחה ✗"
2. Modal: reason textarea (optional)
3. Calls `availabilityRequests.respond({ status: "declined", responseNotes })`
4. Card disappears from pending

**Propose alternative flow:**
1. Click "הצע חלופה ↺"
2. Modal:
   ```
   ┌────────────────────────────────────┐
   │  הצע חלופה                          │
   │                                    │
   │  ○ מוצר חלופי:                     │
   │    [dropdown — my other products]  │
   │                                    │
   │  ○ תאריך חלופי:                    │
   │    [date picker]                   │
   │                                    │
   │  הערה למפיק: ___________          │
   │                                    │
   │  [שלח הצעה]                        │
   └────────────────────────────────────┘
   ```
3. Calls `availabilityRequests.respond({ status: "alternative_proposed", alternativeProductId, alternativeDate, responseNotes })`

### 5. Real-Time Status Updates

Since Convex queries are reactive, both sides see updates automatically:
- Producer: `useQuery(api.availabilityRequests.listByProject, { projectId })` auto-updates when supplier responds
- Supplier: `useQuery(api.availabilityRequests.listPendingBySupplier, { supplierId })` auto-updates when producer creates new requests

No polling or WebSocket setup needed — this is built into Convex.

### 6. Availability Summary on QuoteEditor

Add a summary bar at top of QuoteEditor:

```
זמינות: 3/5 אושרו | 1 ממתין | 1 לא נבדק
[████████████░░░░░░░░] 60%
```

This helps the producer see at a glance if all suppliers are confirmed before sending the quote to the client.

---

## New Files

| File | Type |
|------|------|
| `convex/availabilityRequests.ts` | Backend |
| `src/app/components/AlternativeProposalCard.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/QuoteEditor.tsx` | Per-item availability, bulk check, summary bar |
| `src/app/components/ItemEditor.tsx` | Send request button, show response |
| `src/app/components/supplier/RequestsPage.tsx` | Full response flow (approve/decline/alternative) |
| `convex/quoteItems.ts` | Update availabilityStatus on request responses |
