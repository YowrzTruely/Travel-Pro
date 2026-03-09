# Batch B — Proposal Builder (Plans 06, 07, 08, 09)

## Status: COMPLETE (2026-03-09)

## Context

Batch B builds the full proposal/quote workflow: enhanced quote editing with 4-tier pricing (Plan 06), supplier availability & booking (Plan 07), client-facing proposal with signature (Plan 08), and supplier orders & invoicing (Plan 09). This is the second batch in the execution plan, following Batch A (supplier module). All schema tables already exist from Plan 01. Backend CRUD stubs exist from Batch A but need enhancement with business logic.

**Execution order:** B1 (Plan 06) → B2 (Plans 07 + 08 in parallel) → B3 (Plan 09)

---

## B1 — Plan 06: Quote Editor Enhancements

### Step 1: Extend `convex/quoteItems.ts` create/update args

The schema supports all new fields but the mutations don't accept them yet.

**File:** `convex/quoteItems.ts`

Add to both `create` and `update` args:
- `supplierId: v.optional(v.id("suppliers"))`
- `productId: v.optional(v.id("supplierProducts"))`
- `availabilityStatus: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("declined"), v.literal("not_checked")))`
- `selectedAddons: v.optional(v.array(v.object({ addonId: v.id("productAddons"), name: v.string(), price: v.number() })))`
- `equipmentRequirements: v.optional(v.array(v.string()))`
- `grossTime: v.optional(v.number())`
- `netTime: v.optional(v.number())`
- `alternativeItems: v.optional(v.array(v.object({ supplierId: v.id("suppliers"), productId: v.optional(v.id("supplierProducts")), name: v.string(), price: v.number(), description: v.optional(v.string()), imageUrl: v.optional(v.string()) })))`
- `selectedByClient: v.optional(v.boolean())`

In `create` handler, set `availabilityStatus: args.availabilityStatus ?? "not_checked"` and pass through all new fields.

### Step 2: Add `findAlternatives` query to `convex/suppliers.ts`

**File:** `convex/suppliers.ts` (after `summaries` query ~line 109)

```ts
export const findAlternatives = query({
  args: {
    category: v.string(),
    region: v.optional(v.string()),
    excludeId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, { category, region, excludeId }) => {
    let suppliers = await ctx.db
      .query("suppliers")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();
    if (excludeId) suppliers = suppliers.filter((s) => s._id !== excludeId);
    if (region) suppliers = suppliers.filter((s) => s.region === region);
    suppliers.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return suppliers.slice(0, 10).map((s) => ({ ...s, id: s._id }));
  },
});
```

### Step 3: Enhance `ItemEditor.tsx` — 4-tier pricing + product selector + addons

**File:** `src/app/components/ItemEditor.tsx`

**a) Product selector** — After supplier selection, add a product dropdown. When `supplierId` is set, query `api.supplierProducts.listBySupplierId`. On product selection:
- Auto-fill listPrice, directPrice, producerPrice from product (check volume pricing if `project.participants > product.volumeThreshold`)
- Set clientPrice = producerPrice × 1.20 (default 20% margin)
- Auto-fill grossTime, netTime, equipmentRequirements, description from product.aiDescription

**b) Replace 3-field pricing** (cost/directPrice/sellingPrice at lines 674-748) with 4-tier layout:
- מחיר מחירון (listPrice) — read-only, auto-filled
- מחיר ישיר (directPrice) — read-only, auto-filled
- מחיר מפיק (producerPrice → maps to existing `cost` field) — editable
- מחיר ללקוח (clientPrice → maps to existing `sellingPrice` field) — editable
- Margin display: `(clientPrice - producerPrice) / clientPrice × 100`
- Profit bar visualization

**c) Addons/upsells section** below pricing. When productId is set, query `api.productAddons.listByProductId`. Show checkboxes. Store in `selectedAddons` array. Show per-addon price.

**d) Timing fields** — grossTime/netTime inputs (minutes), auto-filled from product.

**e) Equipment display** — read-only list from product's equipmentRequirements.

### Step 4: Create `src/app/components/AlternativesModal.tsx` (NEW)

Dialog that:
- Takes: category, supplierId (current), onSelect callback
- Queries `api.suppliers.findAlternatives({ category, excludeId: supplierId })`
- Also queries `api.supplierPromotions.listActive` for promotion badges
- Shows supplier cards with: name, rating, region, pricing
- Max 4 alternatives selection
- On confirm: returns array of `alternativeItems` to parent

### Step 5: Enhance `QuoteEditor.tsx` — Equipment aggregation

**File:** `src/app/components/QuoteEditor.tsx`

New collapsible section (between pricing and timeline). `useMemo` to collect + deduplicate `equipmentRequirements` from all items, showing which activities need each item. PDF export button (disabled placeholder for Plan 14).

### Step 6: Enhance `QuoteEditor.tsx` — Timeline hide toggle + timing

Add toggle button "הסתר מהלקוח" to timeline section header. Store `timelineHidden` as a field on the project (add to `projects.update` args: `timelineHidden: v.optional(v.boolean())`). For each timeline event linked to a quoteItem, show gross/net time. Total duration summary at bottom.

**Schema note:** Add `timelineHidden: v.optional(v.boolean())` to `projects` table in `convex/schema.ts`.

### Step 7: Enhance `QuoteEditor.tsx` — Pricing summary

Extend the existing animated summary with:
- Total supplier cost = Σ(producerPrice × participants)
- Total addons = Σ(selected addon prices × participants)
- Total client price = Σ(clientPrice × participants) + addon markup
- Gross profit, margin %, per-participant price
- Keep existing color-coded profit bar

### Step 8: Enhance `QuoteEditor.tsx` — Availability badges per item

In Components tab item cards, add availability status badge:
- `not_checked` → gray "לא נבדק"
- `pending` → amber "ממתין"
- `approved` → green "אושר"
- `declined` → red "נדחה"

Add buttons per item: "חלופות" (opens AlternativesModal), "בדוק זמינות" (stub for Plan 07).

### Step 9: Enhance `QuoteEditor.tsx` — Action buttons bar

Bottom sticky bar:
- "שלח הצעה ללקוח" → copy `/quote/${projectId}` link
- "שמור טיוטה" → explicit save (reuse existing auto-save)
- "ייצא PDF" → disabled placeholder
- "שתף ללא מחירים" → copy `/quote/${projectId}?mode=noPrices` link

### Verification B1
```bash
bun lint && bun tsc && bun ultracite
```

---

## B2a — Plan 07: Availability & Booking (parallel with B2b)

### Step 1: Enhance `convex/availabilityRequests.ts`

**File:** `convex/availabilityRequests.ts`

**a) Enhance `create`** — After inserting, patch quoteItem's availabilityStatus to "pending".

**b) Enhance `respond`** — After patching:
- Update linked quoteItem's availabilityStatus to match response
- If approved: auto-create booking via `ctx.db.insert("bookings", ...)` with expiresAt = Date.now() + 7 days
- If declined: no auto-action (frontend shows alternatives)

**c) Add `createBulk`** mutation — Loop over all quoteItems for projectId where `availabilityStatus` is undefined or "not_checked", create request for each, set status to "pending".

**d) Add `listPendingBySupplier`** query — Filter by supplierId + status "pending".

### Step 2: Create `convex/notificationSender.ts` (NEW)

**File:** `convex/notificationSender.ts`

Convex action with stub functions (console.log only):
- `sendAvailabilityRequest` — logs WhatsApp/SMS/email message
- `sendBookingConfirmation` — logs confirmation
- `sendCancellationNotice` — logs cancellation

### Step 3: Enhance `convex/bookings.ts`

**File:** `convex/bookings.ts`

Add:
- `confirm` mutation: patch status → "confirmed", clear expiresAt
- `checkExpired` as `internalMutation`: query bookings where status="reserved" and expiresAt < Date.now(), patch each to "expired"

Import `internalMutation` from `./_generated/server`.

### Step 4: Add booking expiry cron to `convex/crons.ts`

**File:** `convex/crons.ts`

```ts
crons.cron("check booking expiry", "0 * * * *", internal.bookings.checkExpired);
```

### Step 5: Create `src/app/components/supplier/RequestsPage.tsx` (NEW)

**File:** `src/app/components/supplier/RequestsPage.tsx`

Tabbed page for supplier portal:
- Tab 1: "בקשות ממתינות" — pending requests with approve/decline/propose-alternative buttons
- Tab 2: "שריונות פעילים" — active bookings with cancel button
- Tab 3: "היסטוריה" — past requests/bookings

Queries: `api.availabilityRequests.listBySupplier`, `api.bookings.listBySupplier`.
Get supplierId from user profile (useAuth → user.supplierId).

### Step 6: Create `src/app/components/AlternativeProposalCard.tsx` (NEW)

Inline card for QuoteEditor item cards when supplier proposed alternative. Shows original vs proposed with accept/reject actions.

### Step 7: Wire RequestsPage into supplier router

**File:** `src/app/routes.ts` (line 75)

Replace `SupplierRequestsPlaceholder` with `RequestsPage`:
```ts
import { RequestsPage } from "./components/supplier/RequestsPage";
// ...
{ path: "requests", Component: RequestsPage },
```

### Step 8: Add availability summary bar to `QuoteEditor.tsx`

New bar below header: "X/Y אושרו | Z ממתינים | W לא נבדקו" with progress bar + "בדוק הכל" button calling `createBulk`.

### Verification B2a
```bash
bun lint && bun tsc && bun ultracite
```

---

## B2b — Plan 08: Client Proposal Page (parallel with B2a)

### Step 1: Extend `convex/publicQuote.ts` with new mutations

**File:** `convex/publicQuote.ts`

**a) Enhance `getQuote`** — Return additional item fields: images (resolve storageIds), alternativeItems (strip supplierId — no supplier names for client), selectedAddons, equipmentRequirements, grossTime, netTime, selectedByClient. Accept optional `mode` arg; if "noPrices" omit all price fields. Include project quoteVersion, timelineHidden flag.

**b) Add `selectAlternative`** mutation — args: quoteItemId, selectedAlternativeIndex (-1 = original). Patch quoteItem's `selectedByClient` and mark alternative.

**c) Add `toggleUpsell`** mutation — args: projectId, quoteItemId, addonId, selected. Insert/update `quoteUpsells` table record.

**d) Add `requestChanges`** mutation — args: projectId, items array (quoteItemId + reason), generalNotes, clientName, clientPhone. Insert into `quoteChangeRequests` table.

**e) Add `saveSignature`** mutation — args: projectId (string), signatureStorageId, signerName, signerRole, signerCompany. Find project, patch with digitalSignatureId, set status "אושר".

### Step 2: Enhance `ClientQuote.tsx` — Activity cards

**File:** `src/app/components/ClientQuote.tsx`

Major rewrite of activities section. Each card shows:
- Full-width image from item images
- Activity name + AI description (NO supplier name — remove `provider` field display)
- Time slot + gross/net duration
- Equipment requirements
- Upsell checkboxes (toggleable via `publicQuote.toggleUpsell`)
- Alternative radio buttons (via `publicQuote.selectAlternative`)

### Step 3: Add "no prices" mode to `ClientQuote.tsx`

Read `mode` from `useSearchParams()`. When `noPrices`:
- Hide price summary section
- Hide per-item pricing
- Show banner "תצוגה ללא מחירים — לצפייה בלבד"
- Hide approve button

### Step 4: Create `src/app/components/ClientQuoteSignature.tsx` (NEW)

Modal with:
- Text inputs: name, role, company
- HTML5 Canvas for signature drawing (mouse + touch events)
- Clear button, checkbox "אני מאשר/ת את ההצעה על כל תנאיה"
- On submit: canvas → blob → upload via `generateUploadUrl` → call `saveSignature`
- Follow `useImageUpload.ts` pattern for file upload

### Step 5: Create `src/app/components/ClientQuoteChangeRequest.tsx` (NEW)

Modal with:
- Checkboxes for each quote item
- Per-item reason radio: "יקר" / "לא מעניין" / "תאריך" / "אחר" (with text input)
- General notes textarea
- Submit calls `publicQuote.requestChanges`

### Step 6: Version management in `QuoteEditor.tsx`

Add version display in QuoteEditor header showing current `quoteVersion`. Add "שכפל גרסה" button that:
1. Copies all current quoteItems with incremented version tag
2. Increments project `quoteVersion`

For MVP: version number in header + duplicate button. Full version comparison is Plan 15 polish.

### Step 7: Post-approval confirmation in `ClientQuote.tsx`

Replace the simple inline confirmation (lines ~446-451) with full-screen confirmation view:
- Green checkmark animation
- Trip name, date, project number
- "נציג יצור איתך קשר בקרוב"
- "הורד PDF" disabled placeholder

### Verification B2b
```bash
bun lint && bun tsc && bun ultracite
```

---

## B3 — Plan 09: Supplier Orders & Invoicing

### Step 1: Extend `convex/supplierOrders.ts`

**File:** `convex/supplierOrders.ts`

**a) Add `generateOrdersForProject`** mutation — Loop quoteItems for project, create supplierOrder + invoiceTracking record per supplier. Set project `archiveBlocked: true`.

**b) Add `sendOrder`** action — Stub that logs message. Uses `ctx.runMutation` for internal `markSent` helper to update status to "sent".

**c) Add `confirmOrder`** mutation — Set status "confirmed".

**d) Add `cancelOrder`** mutation — Set status "cancelled", patch cancellation reason.

### Step 2: Extend `convex/invoiceTracking.ts`

**File:** `convex/invoiceTracking.ts`

Add:
- `uploadInvoice` mutation — args: id, invoiceNumber, amount, fileId. Patch with status "received", receivedAt.
- `verify` mutation — Set status "verified".
- `checkAllReceived` query — Given projectId, return `{ allReceived: boolean, pending: number, total: number }`.
- `sendNagReminders` as `internalMutation` — Find projects with archiveBlocked=true, list pending invoices, create notification per project.

### Step 3: Add invoice nagging cron to `convex/crons.ts`

**File:** `convex/crons.ts`

```ts
crons.cron("nag missing invoices", "0 8 * * *", internal.invoiceTracking.sendNagReminders);
```

### Step 4: Create `src/app/components/orders/ProjectOrders.tsx` (NEW)

Props: `projectId`. Queries `api.supplierOrders.listByProject`. Shows:
- Order cards with supplier name, date, participants, price, status
- Send/view/cancel buttons per order
- "שלח הכל" button for all pending orders
- Custom format warning badge

### Step 5: Create `src/app/components/orders/InvoiceTracker.tsx` (NEW)

Props: `projectId`. Queries `api.invoiceTracking.listByProject`. Shows:
- Per-supplier row: status badge, invoice number, amount, upload button
- Upload uses `generateUploadUrl` pattern
- Summary: "X/Y חשבוניות התקבלו"
- Warning: "לא ניתן להעביר לארכיון עד לקבלת הכל"

### Step 6: Archive gate in `convex/projects.ts`

**File:** `convex/projects.ts`

In the `update` mutation, if status is being changed to "ארכיון":
- Query invoiceTracking for the project
- If any have status "pending", throw error with message listing missing invoices

### Step 7: Wire orders/invoices into QuoteEditor

**File:** `src/app/components/QuoteEditor.tsx`

When project status is "אושר" or later, show additional tabs:
- "הזמנות" → renders `<ProjectOrders projectId={...} />`
- "חשבוניות" → renders `<InvoiceTracker projectId={...} />`

### Step 8: Trigger order generation on approval

**File:** `convex/publicQuote.ts`

In `approveQuote` mutation (and `saveSignature`), after setting status to "אושר", call order generation via `ctx.scheduler.runAfter(0, internal.supplierOrders.generateOrdersForProject, { projectId })`.

Note: `generateOrdersForProject` needs to be exported as `internalMutation` for this to work. Keep the existing `create` as public mutation for manual order creation.

### Verification B3
```bash
bun lint && bun tsc && bun ultracite
```

---

## Schema Changes Summary

**`convex/schema.ts`:**
- Add `timelineHidden: v.optional(v.boolean())` to `projects` table

No other schema changes needed — all tables and fields already exist.

---

## New Files Summary

| File | Plan | Type |
|------|------|------|
| `src/app/components/AlternativesModal.tsx` | 06 | Component |
| `convex/notificationSender.ts` | 07 | Backend action |
| `src/app/components/supplier/RequestsPage.tsx` | 07 | Page |
| `src/app/components/AlternativeProposalCard.tsx` | 07 | Component |
| `src/app/components/ClientQuoteSignature.tsx` | 08 | Component |
| `src/app/components/ClientQuoteChangeRequest.tsx` | 08 | Component |
| `src/app/components/orders/ProjectOrders.tsx` | 09 | Page |
| `src/app/components/orders/InvoiceTracker.tsx` | 09 | Page |

## Modified Files Summary

| File | Plans |
|------|-------|
| `convex/quoteItems.ts` | 06 |
| `convex/suppliers.ts` | 06 |
| `convex/schema.ts` | 06 (timelineHidden on projects) |
| `src/app/components/ItemEditor.tsx` | 06 |
| `src/app/components/QuoteEditor.tsx` | 06, 07, 08, 09 |
| `convex/availabilityRequests.ts` | 07 |
| `convex/bookings.ts` | 07 |
| `convex/crons.ts` | 07, 09 |
| `src/app/routes.ts` | 07 |
| `src/app/components/ClientQuote.tsx` | 08 |
| `convex/publicQuote.ts` | 08, 09 |
| `convex/supplierOrders.ts` | 09 |
| `convex/invoiceTracking.ts` | 09 |
| `convex/projects.ts` | 09 |

## Final Verification

After all 4 plans complete:
```bash
bun lint && bun tsc && bun ultracite
```

Manual testing:
1. Open QuoteEditor → add item → select supplier → select product → verify 4-tier pricing auto-fills
2. Toggle addons, add alternatives, check equipment aggregation
3. Click "בדוק זמינות" → verify availability request created
4. In supplier portal /requests → approve request → verify booking created
5. Open /quote/:id → verify activity cards, upsells, alternatives, no supplier names
6. Test signature flow → verify project status changes to "אושר"
7. Verify supplier orders auto-generated on approval
8. Upload invoice → verify archive gate works
