# Plan 01 — Data Model Expansion — COMPLETE

**Status:** DONE
**Phase:** 1 (Foundation)
**Depends on:** Nothing
**Blocks:** All subsequent plans
**PRD refs:** §3.1–3.5 (Suppliers), §4.1–4.5 (Proposals), §5 (CRM), §6 (Field Ops), §7 (Digital Assets)

---

## Goal

Extend `convex/schema.ts` with all new tables required by the PRD, and add fields to existing tables. This is the foundation everything else builds on.

---

## New Tables

### 1. `users` (extends auth — user profile/role)

```ts
users: defineTable({
  authId: v.string(),
  email: v.string(),
  name: v.string(),
  role: v.union(v.literal("admin"), v.literal("producer"), v.literal("supplier")),
  phone: v.optional(v.string()),
  company: v.optional(v.string()),
  avatar: v.optional(v.string()),  // storageId
  supplierId: v.optional(v.id("suppliers")),  // link for supplier-role users
  status: v.union(v.literal("active"), v.literal("pending"), v.literal("suspended")),
  onboardingCompleted: v.boolean(),
  onboardingStage: v.optional(v.union(
    v.literal("stage1"), v.literal("stage2"), v.literal("stage3")
  )),  // PRD 3.1 — 3-stage progressive profile
  registrationSource: v.optional(v.union(
    v.literal("manual"), v.literal("self_registration"), v.literal("availability_invite")
  )),
  invitedBy: v.optional(v.id("users")),
  createdAt: v.number(),
})
  .index("by_authId", ["authId"])
  .index("by_email", ["email"])
  .index("by_role", ["role"])
  .index("by_status", ["status"])
```

### 2. `leads`

```ts
leads: defineTable({
  name: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  source: v.union(
    v.literal("facebook"), v.literal("instagram"), v.literal("tiktok"),
    v.literal("youtube"), v.literal("linkedin"), v.literal("whatsapp"),
    v.literal("phone"), v.literal("manual"), v.literal("website")
  ),
  participants: v.optional(v.number()),
  dateRequested: v.optional(v.string()),
  budget: v.optional(v.number()),
  eventType: v.optional(v.string()),
  region: v.optional(v.string()),
  preferences: v.optional(v.string()),
  notes: v.optional(v.string()),
  status: v.union(
    v.literal("new"), v.literal("first_contact"), v.literal("needs_assessment"),
    v.literal("building_plan"), v.literal("quote_sent"), v.literal("approved"),
    v.literal("closed_won"), v.literal("closed_lost")
  ),
  lossReason: v.optional(v.union(
    v.literal("expensive"), v.literal("competitor"),
    v.literal("disappeared"), v.literal("other")
  )),  // PRD 5.2 — mandatory loss reason
  lossReasonNotes: v.optional(v.string()),
  assignedTo: v.optional(v.id("users")),
  projectId: v.optional(v.id("projects")),
  clientId: v.optional(v.id("clients")),  // auto-created on lead intake
  createdAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_assignedTo", ["assignedTo"])
  .index("by_source", ["source"])
  .index("by_createdAt", ["createdAt"])
```

### 3. `leadCommunications`

```ts
leadCommunications: defineTable({
  leadId: v.id("leads"),
  type: v.union(
    v.literal("call"), v.literal("whatsapp"), v.literal("email"),
    v.literal("sms"), v.literal("note"), v.literal("system")
  ),
  content: v.string(),
  duration: v.optional(v.number()),  // minutes, for calls
  createdBy: v.optional(v.id("users")),
  createdAt: v.number(),
})
  .index("by_leadId", ["leadId"])
```

### 4. `productAddons` (upsells — PRD §3.1, §4.2)

```ts
productAddons: defineTable({
  productId: v.id("supplierProducts"),
  name: v.string(),
  description: v.optional(v.string()),
  listPrice: v.number(),           // מחיר מחירון
  directPrice: v.optional(v.number()),  // מחיר ישיר
  producerPrice: v.optional(v.number()),  // מחיר מפיק
  unit: v.optional(v.string()),    // "per_person" | "per_group" | "flat"
})
  .index("by_productId", ["productId"])
```

### 5. `availabilityRequests`

```ts
availabilityRequests: defineTable({
  quoteItemId: v.id("quoteItems"),
  projectId: v.id("projects"),
  supplierId: v.id("suppliers"),
  productId: v.optional(v.id("supplierProducts")),
  requestedBy: v.id("users"),
  date: v.string(),
  participants: v.optional(v.number()),
  notes: v.optional(v.string()),
  status: v.union(
    v.literal("pending"), v.literal("approved"),
    v.literal("declined"), v.literal("alternative_proposed")
  ),
  responseNotes: v.optional(v.string()),
  alternativeProductId: v.optional(v.id("supplierProducts")),
  alternativeDate: v.optional(v.string()),
  requestedAt: v.number(),
  respondedAt: v.optional(v.number()),
  // Notification channels used
  notificationChannels: v.optional(v.array(v.string())),  // ["whatsapp", "sms", "email"]
})
  .index("by_supplierId", ["supplierId"])
  .index("by_projectId", ["projectId"])
  .index("by_quoteItemId", ["quoteItemId"])
  .index("by_status", ["status"])
```

### 6. `bookings` (PRD §4.4 — reservation/booking)

```ts
bookings: defineTable({
  availabilityRequestId: v.id("availabilityRequests"),
  projectId: v.id("projects"),
  supplierId: v.id("suppliers"),
  productId: v.optional(v.id("supplierProducts")),
  date: v.string(),
  participants: v.number(),
  status: v.union(
    v.literal("reserved"), v.literal("confirmed"),
    v.literal("cancelled"), v.literal("expired")
  ),
  expiresAt: v.optional(v.number()),  // reservation expiry timer
  cancelledAt: v.optional(v.number()),
  cancellationReason: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_supplierId", ["supplierId"])
  .index("by_status", ["status"])
  .index("by_expiresAt", ["expiresAt"])
```

### 7. `supplierOrders` (PRD §4.5 — orders after deal close)

```ts
supplierOrders: defineTable({
  projectId: v.id("projects"),
  supplierId: v.id("suppliers"),
  productId: v.optional(v.id("supplierProducts")),
  bookingId: v.optional(v.id("bookings")),
  clientName: v.string(),
  date: v.string(),
  time: v.optional(v.string()),
  participants: v.number(),
  agreedPrice: v.number(),
  contactName: v.optional(v.string()),
  contactPhone: v.optional(v.string()),
  usesCustomFormat: v.boolean(),  // supplier has their own order format
  customFormatNotes: v.optional(v.string()),
  status: v.union(
    v.literal("pending"), v.literal("sent"), v.literal("confirmed"),
    v.literal("completed"), v.literal("cancelled")
  ),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_supplierId", ["supplierId"])
  .index("by_status", ["status"])
```

### 8. `invoiceTracking` (PRD §5.3 — invoice tracking per supplier per project)

```ts
invoiceTracking: defineTable({
  projectId: v.id("projects"),
  supplierId: v.id("suppliers"),
  orderId: v.optional(v.id("supplierOrders")),
  invoiceNumber: v.optional(v.string()),
  amount: v.optional(v.number()),
  fileId: v.optional(v.string()),  // storageId for uploaded invoice
  status: v.union(
    v.literal("pending"), v.literal("received"), v.literal("verified")
  ),
  receivedAt: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_supplierId", ["supplierId"])
  .index("by_status", ["status"])
```

### 9. `supplierPromotions` (PRD §3.5 — promotions board)

```ts
supplierPromotions: defineTable({
  supplierId: v.id("suppliers"),
  productId: v.optional(v.id("supplierProducts")),
  title: v.string(),
  description: v.optional(v.string()),
  discountPercent: v.optional(v.number()),
  discountAmount: v.optional(v.number()),
  startsAt: v.number(),
  expiresAt: v.number(),
  isActive: v.boolean(),
  createdAt: v.number(),
})
  .index("by_supplierId", ["supplierId"])
  .index("by_isActive", ["isActive"])
  .index("by_expiresAt", ["expiresAt"])
```

### 10. `fieldOperations` (PRD §6 — Field Operations HQ)

```ts
fieldOperations: defineTable({
  projectId: v.id("projects"),
  status: v.union(
    v.literal("planned"), v.literal("in_progress"), v.literal("completed")
  ),
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_status", ["status"])
```

### 11. `fieldOperationStops` (PRD §6 — per-stop tracking)

```ts
fieldOperationStops: defineTable({
  fieldOperationId: v.id("fieldOperations"),
  quoteItemId: v.optional(v.id("quoteItems")),
  supplierId: v.id("suppliers"),
  supplierName: v.string(),
  orderIndex: v.number(),
  plannedStartTime: v.string(),
  plannedEndTime: v.string(),
  actualStartTime: v.optional(v.string()),
  actualEndTime: v.optional(v.string()),
  plannedQuantity: v.number(),
  actualQuantity: v.optional(v.number()),
  supplierSignature: v.optional(v.string()),  // storageId for signature image
  notes: v.optional(v.string()),
  status: v.union(
    v.literal("upcoming"), v.literal("in_progress"),
    v.literal("completed"), v.literal("skipped")
  ),
})
  .index("by_fieldOperationId", ["fieldOperationId"])
  .index("by_supplierId", ["supplierId"])
```

### 12. `roadExpenses` (PRD §6 — real-time expense uploads)

```ts
roadExpenses: defineTable({
  fieldOperationId: v.id("fieldOperations"),
  projectId: v.id("projects"),
  description: v.string(),
  amount: v.number(),
  receiptFileId: v.optional(v.string()),  // storageId
  category: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_fieldOperationId", ["fieldOperationId"])
  .index("by_projectId", ["projectId"])
```

### 13. `notifications`

```ts
notifications: defineTable({
  userId: v.id("users"),
  type: v.string(),
  title: v.string(),
  body: v.string(),
  link: v.optional(v.string()),
  read: v.boolean(),
  channel: v.union(
    v.literal("in_app"), v.literal("email"),
    v.literal("sms"), v.literal("whatsapp")
  ),
  externalDeliveryStatus: v.optional(v.union(
    v.literal("pending"), v.literal("sent"), v.literal("failed")
  )),
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_userId_read", ["userId", "read"])
  .index("by_createdAt", ["createdAt"])
```

### 14. `supplierAvailability`

```ts
supplierAvailability: defineTable({
  supplierId: v.id("suppliers"),
  date: v.string(),       // "2026-03-15"
  available: v.boolean(),
  notes: v.optional(v.string()),
})
  .index("by_supplierId", ["supplierId"])
  .index("by_supplierId_date", ["supplierId", "date"])
```

### 15. `quoteChangeRequests`

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

### 16. `quoteUpsells` (PRD §4.2 — upsells in client proposals)

```ts
quoteUpsells: defineTable({
  projectId: v.id("projects"),
  quoteItemId: v.id("quoteItems"),
  addonId: v.id("productAddons"),
  name: v.string(),
  price: v.number(),
  selectedByClient: v.boolean(),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
  .index("by_quoteItemId", ["quoteItemId"])
```

### 17. `eventGallery` (PRD §7 — post-event photo gallery)

```ts
eventGallery: defineTable({
  projectId: v.id("projects"),
  uploadedBy: v.optional(v.id("users")),
  participantName: v.optional(v.string()),
  participantPhone: v.optional(v.string()),
  fileId: v.string(),  // storageId
  fileType: v.union(v.literal("photo"), v.literal("video")),
  createdAt: v.number(),
})
  .index("by_projectId", ["projectId"])
```

### 18. `supplierRatings` (PRD §3.5, §7 — post-event ratings)

```ts
supplierRatings: defineTable({
  supplierId: v.id("suppliers"),
  projectId: v.id("projects"),
  ratedBy: v.optional(v.id("users")),
  participantName: v.optional(v.string()),
  rating: v.number(),  // 1-5
  comment: v.optional(v.string()),
  isProducerRating: v.boolean(),
  createdAt: v.number(),
})
  .index("by_supplierId", ["supplierId"])
  .index("by_projectId", ["projectId"])
```

---

## Existing Table Modifications

### `suppliers` — add fields

```ts
// New fields:
userId: v.optional(v.id("users")),
approvedByAdmin: v.optional(v.boolean()),
approvedAt: v.optional(v.number()),
registrationStatus: v.optional(v.union(
  v.literal("pending"), v.literal("approved"), v.literal("rejected")
)),
invitedBy: v.optional(v.id("users")),
profileCompletionStage: v.optional(v.union(
  v.literal("stage1"), v.literal("stage2"), v.literal("stage3")
)),
websiteUrl: v.optional(v.string()),         // PRD 3.5 — for AI marketing description generation
facebookUrl: v.optional(v.string()),        // PRD 3.5 — for AI marketing description generation
operatingHours: v.optional(v.string()),     // PRD 3.1 — operating hours
seasonalAvailability: v.optional(v.string()), // PRD 3.1 — seasonal notes
defaultMarginPercent: v.optional(v.number()), // PRD 3.3 — default 20%
averageRating: v.optional(v.number()),       // PRD 3.5 — 1-5 stars
totalRatings: v.optional(v.number()),
usesCustomOrderFormat: v.optional(v.boolean()), // PRD 4.5
customOrderFormatNotes: v.optional(v.string()),
```

### `supplierProducts` — add fields (PRD §3.1, §3.3)

```ts
// New fields — 4-tier pricing:
listPrice: v.optional(v.number()),        // מחיר מחירון (public)
directPrice: v.optional(v.number()),      // מחיר ישיר (supplier only)
producerPrice: v.optional(v.number()),    // מחיר מפיק (producer only)
clientPrice: v.optional(v.number()),      // מחיר ללקוח (internal to producer)

// Volume pricing (PRD §3.3 — different price above quantity "X"):
volumeThreshold: v.optional(v.number()),      // quantity above which volume price applies
volumeListPrice: v.optional(v.number()),      // volume מחיר מחירון
volumeDirectPrice: v.optional(v.number()),    // volume מחיר ישיר
volumeProducerPrice: v.optional(v.number()),  // volume מחיר מפיק

// Timing:
grossTime: v.optional(v.number()),        // זמן ברוטו (minutes)
netTime: v.optional(v.number()),          // זמן נטו (minutes)

// Equipment & requirements:
equipmentRequirements: v.optional(v.array(v.string())),  // רישיון נהיגה, בגד ים, etc.

// Capacity & logistics:
capacity: v.optional(v.number()),         // max participants
location: v.optional(v.string()),
cancellationTerms: v.optional(v.string()),

// AI-generated content:
aiDescription: v.optional(v.string()),     // AI marketing description
aiCleanedImageId: v.optional(v.string()), // storageId for AI-cleaned image
```

### `projects` — add fields

```ts
// New fields:
leadId: v.optional(v.id("leads")),
assignedTo: v.optional(v.id("users")),
quoteVersion: v.optional(v.number()),      // V1, V2, V3...
digitalSignatureId: v.optional(v.string()), // storageId
archiveBlocked: v.optional(v.boolean()),   // PRD 5.3 — blocked until all invoices received
archiveBlockReason: v.optional(v.string()),
```

### `quoteItems` — add fields

```ts
// New fields:
supplierId: v.optional(v.id("suppliers")),
productId: v.optional(v.id("supplierProducts")),
availabilityStatus: v.optional(v.union(
  v.literal("pending"), v.literal("approved"), v.literal("declined"), v.literal("not_checked")
)),
selectedAddons: v.optional(v.array(v.object({
  addonId: v.id("productAddons"),
  name: v.string(),
  price: v.number(),
}))),
equipmentRequirements: v.optional(v.array(v.string())),  // aggregated from product
grossTime: v.optional(v.number()),
netTime: v.optional(v.number()),
// Alternative items for client selection (PRD 4.2)
alternativeItems: v.optional(v.array(v.object({
  supplierId: v.id("suppliers"),
  productId: v.optional(v.id("supplierProducts")),
  name: v.string(),
  price: v.number(),
  description: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
}))),
selectedByClient: v.optional(v.boolean()),  // client picked this alternative
```

### `clients` — add fields

```ts
// New fields:
leadId: v.optional(v.id("leads")),
userId: v.optional(v.id("users")),
source: v.optional(v.string()),
```

---

## Tables NOT Added (removed from MVP per PRD §10)

- ~~`conversations`~~ — PRD uses WhatsApp/SMS/email, not in-app chat
- ~~`messages`~~ — same reason
- ~~`teams`~~ — not mentioned in PRD

---

## Implementation Steps

1. **Update `convex/schema.ts`** — add all new tables and extend existing ones with `v.optional()` fields (non-breaking)
2. **Run `npx convex dev`** — validate schema deploys cleanly
3. **Create stub CRUD functions** for each new table:
   - `convex/users.ts` — getByAuthId, getCurrent, create, update
   - `convex/leads.ts` — list, get, create, update, remove, updateStatus
   - `convex/leadCommunications.ts` — listByLeadId, create
   - `convex/productAddons.ts` — listByProductId, create, update, remove
   - `convex/availabilityRequests.ts` — listByProject, listBySupplier, create, respond
   - `convex/bookings.ts` — listByProject, listBySupplier, create, cancel, expire
   - `convex/supplierOrders.ts` — listByProject, listBySupplier, create, update
   - `convex/invoiceTracking.ts` — listByProject, create, markReceived
   - `convex/supplierPromotions.ts` — listBySupplier, create, update, deactivate
   - `convex/fieldOperations.ts` — create, update, get
   - `convex/fieldOperationStops.ts` — listByOperation, update
   - `convex/roadExpenses.ts` — listByOperation, create
   - `convex/notifications.ts` — listByUser, create, markRead, markAllRead
   - `convex/supplierAvailability.ts` — listByMonth, setAvailability
   - `convex/supplierRatings.ts` — listBySupplier, create
4. **Update seed.ts** — add seed data for new tables
5. **Run linting**: `bun lint && bun tsc && bun ultracite`

---

## Notes

- All new fields on existing tables use `v.optional()` so existing data is not broken
- The `users` table is separate from Convex Auth's internal `authTables` — it stores app-level profile/role data
- `teams` table removed — PRD does not mention team management
- `conversations` and `messages` tables removed — PRD communicates via WhatsApp/SMS/email, not in-app chat
- 4-tier pricing on `supplierProducts` matches PRD §3.3 exactly, with volume pricing (above quantity X → different price per tier)
- Supplier `websiteUrl`/`facebookUrl` used by AI to auto-generate marketing descriptions (PRD §3.5)
