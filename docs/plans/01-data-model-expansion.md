# Plan 01 — Data Model Expansion

**Phase:** 1 (Foundation)
**Depends on:** Nothing
**Blocks:** All subsequent plans

---

## Goal

Extend `convex/schema.ts` with all new tables required by the full spec, and add fields to existing tables. This is the foundation everything else builds on.

---

## New Tables

### 1. `users` (extends auth — user profile/role)

```ts
users: defineTable({
  // Linked to Convex Auth user
  authId: v.string(),           // maps to auth user _id
  email: v.string(),
  name: v.string(),
  role: v.union(v.literal("admin"), v.literal("producer"), v.literal("supplier")),
  phone: v.optional(v.string()),
  company: v.optional(v.string()),
  avatar: v.optional(v.string()),  // storageId
  teamId: v.optional(v.id("teams")),
  supplierId: v.optional(v.id("suppliers")),  // link for supplier-role users
  status: v.union(v.literal("active"), v.literal("pending"), v.literal("suspended")),
  onboardingCompleted: v.boolean(),
  createdAt: v.number(),
})
  .index("by_authId", ["authId"])
  .index("by_email", ["email"])
  .index("by_role", ["role"])
  .index("by_status", ["status"])
  .index("by_teamId", ["teamId"])
```

### 2. `teams`

```ts
teams: defineTable({
  name: v.string(),
  ownerId: v.id("users"),
  permissions: v.object({
    canViewAllProjects: v.boolean(),
    canEditSuppliers: v.boolean(),
    canManageTeam: v.boolean(),
    canApproveSuppliers: v.boolean(),
  }),
  createdAt: v.number(),
})
```

### 3. `leads`

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
  notes: v.optional(v.string()),
  status: v.union(
    v.literal("new"), v.literal("first_contact"), v.literal("needs_assessment"),
    v.literal("building_plan"), v.literal("quote_sent"), v.literal("approved"),
    v.literal("closed_won"), v.literal("closed_lost")
  ),
  assignedTo: v.optional(v.id("users")),
  projectId: v.optional(v.id("projects")),  // linked when converted
  createdAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_assignedTo", ["assignedTo"])
  .index("by_source", ["source"])
  .index("by_createdAt", ["createdAt"])
```

### 4. `leadCommunications`

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

### 5. `productAddons`

```ts
productAddons: defineTable({
  productId: v.id("supplierProducts"),
  name: v.string(),
  price: v.number(),
  unit: v.optional(v.string()),  // "per_person" | "per_group" | "flat"
})
  .index("by_productId", ["productId"])
```

### 6. `availabilityRequests`

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
})
  .index("by_supplierId", ["supplierId"])
  .index("by_projectId", ["projectId"])
  .index("by_quoteItemId", ["quoteItemId"])
  .index("by_status", ["status"])
```

### 7. `conversations`

```ts
conversations: defineTable({
  type: v.union(
    v.literal("direct"),      // producer ↔ supplier general
    v.literal("project"),     // producer ↔ supplier per project
    v.literal("client")       // producer ↔ client post-approval
  ),
  projectId: v.optional(v.id("projects")),
  supplierId: v.optional(v.id("suppliers")),
  participants: v.array(v.id("users")),
  lastMessageAt: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_projectId", ["projectId"])
  .index("by_participants", ["participants"])
  .index("by_lastMessageAt", ["lastMessageAt"])
```

### 8. `messages`

```ts
messages: defineTable({
  conversationId: v.id("conversations"),
  senderId: v.id("users"),
  content: v.string(),
  type: v.union(v.literal("text"), v.literal("file"), v.literal("system")),
  fileUrl: v.optional(v.string()),     // storageId for file messages
  fileName: v.optional(v.string()),
  readBy: v.array(v.id("users")),
  createdAt: v.number(),
})
  .index("by_conversationId", ["conversationId"])
  .index("by_createdAt", ["createdAt"])
```

### 9. `notifications`

```ts
notifications: defineTable({
  userId: v.id("users"),
  type: v.string(),  // "new_lead", "availability_request", "quote_approved", etc.
  title: v.string(),
  body: v.string(),
  link: v.optional(v.string()),       // in-app route to navigate to
  read: v.boolean(),
  channel: v.union(v.literal("in_app"), v.literal("email"), v.literal("sms"), v.literal("whatsapp")),
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_userId_read", ["userId", "read"])
  .index("by_createdAt", ["createdAt"])
```

---

## Existing Table Modifications

### `suppliers` — add fields

```ts
// New fields:
userId: v.optional(v.id("users")),          // linked when supplier registers
approvedByAdmin: v.optional(v.boolean()),    // admin approval status
approvedAt: v.optional(v.number()),
registrationStatus: v.optional(v.union(
  v.literal("pending"), v.literal("approved"), v.literal("rejected")
)),
invitedBy: v.optional(v.id("users")),       // producer who invited them
```

### `supplierProducts` — add fields

```ts
// New fields:
directPrice: v.optional(v.number()),        // price for direct clients
producerPrice: v.optional(v.number()),      // agreed price for producers
capacity: v.optional(v.number()),           // max participants
duration: v.optional(v.number()),           // hours
location: v.optional(v.string()),
cancellationTerms: v.optional(v.string()),
```

### `projects` — add fields

```ts
// New fields:
leadId: v.optional(v.id("leads")),          // link back to originating lead
assignedTo: v.optional(v.id("users")),      // assigned producer
```

### `quoteItems` — add fields

```ts
// New fields:
supplierId: v.optional(v.id("suppliers")),  // typed reference (currently string `supplier`)
productId: v.optional(v.id("supplierProducts")),
availabilityStatus: v.optional(v.union(
  v.literal("pending"), v.literal("approved"), v.literal("declined"), v.literal("not_checked")
)),
selectedAddons: v.optional(v.array(v.object({
  addonId: v.id("productAddons"),
  name: v.string(),
  price: v.number(),
}))),
```

### `clients` — add fields

```ts
// New fields:
leadId: v.optional(v.id("leads")),          // link back to lead
userId: v.optional(v.id("users")),          // if client has portal access
source: v.optional(v.string()),
```

---

## Implementation Steps

1. **Update `convex/schema.ts`** — add all new tables and extend existing ones with `v.optional()` fields (non-breaking)
2. **Run `npx convex dev`** — validate schema deploys cleanly
3. **Create stub CRUD functions** for each new table:
   - `convex/users.ts` — getByAuthId, getCurrent, create, update
   - `convex/teams.ts` — list, get, create, update, remove
   - `convex/leads.ts` — list, get, create, update, remove, updateStatus
   - `convex/leadCommunications.ts` — listByLeadId, create
   - `convex/productAddons.ts` — listByProductId, create, update, remove
   - `convex/availabilityRequests.ts` — listByProject, listBySupplier, create, respond
   - `convex/conversations.ts` — list, getOrCreate, get
   - `convex/messages.ts` — listByConversation, send, markRead
   - `convex/notifications.ts` — listByUser, create, markRead, markAllRead
4. **Update seed.ts** — add seed data for new tables (users with roles, sample leads, etc.)
5. **Run linting**: `bun lint && bun tsc && bun ultracite`

---

## Notes

- All new fields on existing tables use `v.optional()` so existing data is not broken
- The `users` table is separate from Convex Auth's internal `authTables` — it stores app-level profile/role data
- `conversations.participants` uses an array of user IDs; Convex indexes on arrays work for membership queries
