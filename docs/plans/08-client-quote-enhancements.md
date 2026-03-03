# Plan 08 — Client Quote Page Enhancements

**Phase:** 3 (Business Logic)
**Depends on:** Plan 06 (Quote Editor Enhancements), Plan 07 (Availability Workflow)
**Blocks:** None

---

## Goal

Enhance the public client-facing quote page (`/quote/:id`) with: per-item "request alternative" flow, change request form, negotiation loop back to producer, and improved mobile-first design.

---

## Current State

- `ClientQuote.tsx` — public page (no auth), shows quote items, timeline, approve button
- `convex/publicQuote.ts` — `getQuote` (omits cost data) and `approveQuote` mutations
- The page works but only has "approve" — no way for clients to request changes or alternatives

---

## Implementation

### 1. Enhanced Client Quote Layout

**File: `src/app/components/ClientQuote.tsx`** (major modify)

```
┌─────────────────────────────────────────────────────┐
│  [Header — branded]                                  │
│  לוגו חברה + שם פרויקט + תאריך                       │
│                                                     │
│  [Summary Section]                                   │
│  תאריך: 15/04/2026 | 45 משתתפים | צפון | גיבוש      │
│                                                     │
│  [Activity Cards — scrollable]                       │
│  ┌─────────────────────────────────┐                │
│  │ [תמונה מהספק — full width]      │                │
│  │ סיור ביקב הגולן                  │                │
│  │ 10:00-12:00 | צפון              │                │
│  │ כולל: פלטת גבינות               │                │
│  │ ₪120 / משתתף                    │                │
│  │                                 │                │
│  │ 💡 לא מתאים?                    │                │
│  │ [בקש חלופה לפעילות הזו]          │                │
│  └─────────────────────────────────┘                │
│                                                     │
│  [Visual Timeline]                                   │
│  10:00 ──── סיור ביקב ────── 12:00                   │
│  12:30 ──── ארוחת צהריים ──── 14:00                  │
│  14:30 ──── סדנת יין ──────── 16:30                  │
│                                                     │
│  [Total Price]                                       │
│  ₪25,000 | 30 משתתפים | ₪833/משתתף                  │
│                                                     │
│  [Action Buttons]                                    │
│  ┌──────────────────────┐                           │
│  │  [✓ אשר הצעה]        │ — big green CTA           │
│  │  [📞 פנה לנציג]       │ — opens WhatsApp/phone    │
│  │  [↺ בקש שינויים]      │ — opens change form       │
│  └──────────────────────┘                           │
└─────────────────────────────────────────────────────┘
```

### 2. Per-Item Alternative Request

When client clicks "בקש חלופה לפעילות הזו" on a specific item:

**File: `src/app/components/ClientQuote.tsx`** (add inline form)

```
┌─────────────────────────────────────┐
│  מה לא מתאים?                        │
│                                     │
│  ☐ יקר מדי                           │
│  ☐ לא רלוונטי / לא מעניין            │
│  ☐ תאריך לא מתאים                    │
│  ☐ אחר: ___________                 │
│                                     │
│  [שלח בקשה]                          │
└─────────────────────────────────────┘
```

Backend creates a record that the producer can see, with the specific item flagged.

### 3. General Change Request Form

When client clicks "בקש שינויים":

**File: `src/app/components/ClientQuoteChangeRequest.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  בקשת שינויים                                        │
│                                                     │
│  סמן את הפריטים שאתה רוצה לשנות:                     │
│                                                     │
│  ☐ סיור ביקב הגולן — סיבה: ___________              │
│  ☐ ארוחת צהריים — סיבה: ___________                 │
│  ☐ סדנת יין — סיבה: ___________                     │
│                                                     │
│  הערות כלליות:                                       │
│  ___________________________________________        │
│                                                     │
│  [שלח בקשה]                                          │
└─────────────────────────────────────────────────────┘
```

### 4. Backend — Change Requests

**File: `convex/publicQuote.ts`** (extend)

```ts
// New table: quoteChangeRequests
// Or add to existing schema:

requestChanges: mutation({
  args: {
    projectId: v.id("projects"),
    items: v.array(v.object({
      quoteItemId: v.id("quoteItems"),
      reason: v.string(),  // "too_expensive" | "not_relevant" | "bad_date" | custom text
    })),
    generalNotes: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Store the change request
    // Update project status to indicate changes requested
    // Create notification for producer (Plan 10)
    // Return confirmation
  },
})

requestItemAlternative: mutation({
  args: {
    projectId: v.id("projects"),
    quoteItemId: v.id("quoteItems"),
    reason: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Flag this specific item as needing alternative
    // Notify producer
  },
})
```

### 5. Schema Addition — Change Requests

```ts
quoteChangeRequests: defineTable({
  projectId: v.id("projects"),
  items: v.array(v.object({
    quoteItemId: v.id("quoteItems"),
    reason: v.string(),
  })),
  generalNotes: v.optional(v.string()),
  clientName: v.optional(v.string()),
  clientPhone: v.optional(v.string()),
  status: v.union(v.literal("pending"), v.literal("addressed")),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_status", ["status"])
```

### 6. Producer Side — View Change Requests

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Add a banner/section in QuoteEditor when there are pending change requests:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ הלקוח ביקש שינויים (03/03/2026 14:30)           │
│                                                     │
│  פריטים לשינוי:                                      │
│  • סיור ביקב הגולן — "יקר מדי"                       │
│  • סדנת יין — "לא רלוונטי"                          │
│                                                     │
│  הערות: "אנחנו מחפשים משהו יותר אקטיבי בחוץ"       │
│                                                     │
│  [טופל ✓] — marks change request as addressed        │
└─────────────────────────────────────────────────────┘
```

Items flagged for change get a visual indicator (orange border/badge) so the producer knows which items to replace.

### 7. Quote Versioning

When a producer addresses change requests and sends a new quote:
- The client quote page shows the latest version
- Previous versions stored for history (add `version` field to quoteItems or use `quoteVersions` tracking)

Simple approach: add `quoteVersion: v.optional(v.number())` to projects, increment when re-sending. The public quote always shows current items.

### 8. Contact Producer Button

"פנה לנציג" button behavior:
- If on mobile: `tel:` link to producer's phone
- Also show WhatsApp link: `https://wa.me/{producerPhone}`
- Opens options sheet on mobile

### 9. Post-Approval Flow

When client clicks "אשר הצעה":
1. `approveQuote` mutation runs
2. Project status → "אושר"
3. Confirmation screen shown to client:
   ```
   ┌─────────────────────────────────┐
   │  ✅ ההצעה אושרה בהצלחה!         │
   │                                 │
   │  נציג יצור איתך קשר בקרוב      │
   │  לתיאום הפרטים האחרונים.        │
   │                                 │
   │  מספר פרויקט: 4829-24           │
   └─────────────────────────────────┘
   ```
4. Notification sent to producer + all involved suppliers (Plan 10)

---

## New Files

| File | Type |
|------|------|
| `src/app/components/ClientQuoteChangeRequest.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/ClientQuote.tsx` | Per-item alternative request, action buttons, post-approval screen |
| `src/app/components/QuoteEditor.tsx` | Change request banner, flagged items |
| `convex/publicQuote.ts` | requestChanges, requestItemAlternative mutations |
| `convex/schema.ts` | Add quoteChangeRequests table |

## Schema Addition

```ts
quoteChangeRequests: defineTable({
  projectId: v.id("projects"),
  items: v.array(v.object({
    quoteItemId: v.id("quoteItems"),
    reason: v.string(),
  })),
  generalNotes: v.optional(v.string()),
  clientName: v.optional(v.string()),
  clientPhone: v.optional(v.string()),
  status: v.union(v.literal("pending"), v.literal("addressed")),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_status", ["status"])
```
