# Flow Completion: Closing the Last 10% to 100%

## Context

The Eventos platform has 10 Figma flow diagrams. After thorough review, ~90% of the spec is already implemented. The remaining gaps are all about **wiring existing notification infrastructure to real actions** and **adding automated coordination crons**. No new UI pages are needed.

## Existing Infrastructure (already built)

- `notificationSender.ts`: `sendMultiChannel` (internalAction) with SMS (Twilio), Email (Resend), WhatsApp (wa.me links)
- `http.ts`: Lead webhook at `/api/leads/webhook` with `createFromWebhook`
- `crons.ts`: 5 crons already running (doc expiry, reminders, reservation alerts, promotions, order reminders)
- `PublicGallery`: B2C lead gate with registration form + marketing consent
- `EventRatings`: Public participant rating page at `/rate/:projectId`
- `sendQuote.ts`: Quote sharing via all 3 channels

## Convex Execution Model (applies to all gaps)

**Critical constraint**: In Convex, mutations cannot call actions directly. `sendMultiChannel` is an `internalAction`. All mutations that need to send notifications must use:
```typescript
await ctx.scheduler.runAfter(0, internal.notificationSender.sendMultiChannel, { ... });
```

This schedules the action to run immediately after the mutation commits. This pattern applies to Gaps 1, 2, 3, and 5.

For crons (Gap 4), use `internalAction` handlers that can call `ctx.runQuery` for DB reads and then call `sendMultiChannel` directly via `ctx.runAction`.

## Gap 1: Wire Availability Requests to Real Notifications

**Problem**: `sendAvailabilityRequest` in `notificationSender.ts` is a console.log stub.

**Solution**: In `convex/availabilityRequests.ts`, after creating a request, schedule `sendMultiChannel`.

**Files to modify**:
- `convex/availabilityRequests.ts` — after inserting a request, schedule notification with supplier's phone/email (requires joining to `suppliers` table)

**Message template**:
```
שלום {supplierName},
{producerName} בודק איתך זמינות לאירוע ב-{date}.
פרטים: {participants} משתתפים, {productName}
כנס לצפייה ואישור: {link}
```

Note: `productName` requires joining to `supplierProducts` via the request's `productId`.

**Channels**: SMS + Email + In-App notification (WhatsApp as wa.me link)

**Pattern**:
```typescript
// Inside the create mutation, after ctx.db.insert:
const supplier = await ctx.db.get(args.supplierId);
if (supplier) {
  await ctx.scheduler.runAfter(0, internal.notificationSender.sendMultiChannel, {
    phone: supplier.phone,
    email: supplier.email,
    title: "בקשת זמינות חדשה",
    body: `...`,
    link: `${siteUrl}/requests`,
    channels: ["sms", "email", "whatsapp", "in_app"],
  });
}
```

## Gap 2: Wire Supplier Order Notifications

**Problem**: `ProjectOrders` can send/confirm/cancel orders, but suppliers aren't notified externally.

**Files to modify**:
- `convex/supplierOrders.ts` — in `sendOrder` mutation, after status change, schedule `sendMultiChannel`
- `convex/supplierOrders.ts` — in `cancelOrder` mutation, after status change, schedule `sendMultiChannel` with cancellation reason

Note: `projectName` requires joining to `projects` table. `productName` requires joining to `supplierProducts`.

**Send order message**:
```
שלום {supplierName},
הזמנה חדשה עבור אירוע "{projectName}" ב-{date}.
מוצר: {productName}, כמות: {quantity}
כנס לצפייה ואישור: {link}
```

**Cancel order message**:
```
שלום {supplierName},
ההזמנה עבור "{projectName}" ב-{date} בוטלה.
סיבה: {reason}
```

## Gap 3: Add Notifications to Existing Cascade Cancel

**Problem**: The cascade cancel logic already exists in `convex/projects.ts` `update` mutation (lines 150-176) — when status is set to `"בוטל"`, all bookings and orders are cancelled. But suppliers are NOT notified externally.

**Solution**: Enhance the existing cascade cancel block (do NOT create a new mutation). After cancelling each order, schedule a notification to the supplier.

**Files to modify**:
- `convex/projects.ts` — inside the `if (updates.status === "בוטל")` block, after cancelling each order/booking, schedule `sendMultiChannel` to the affected supplier
- `src/app/components/QuoteEditor.tsx` — add a "Cancel Project" button with confirmation dialog that calls `projects.update` with `status: "בוטל"`

**Pattern** (inside existing cascade block):
```typescript
for (const order of orders) {
  if (order.status !== "cancelled" && order.status !== "completed") {
    await ctx.db.patch(order._id, { status: "cancelled" });
    // NEW: notify supplier
    const supplier = await ctx.db.get(order.supplierId);
    if (supplier?.phone || supplier?.email) {
      await ctx.scheduler.runAfter(0, internal.notificationSender.sendMultiChannel, {
        phone: supplier.phone,
        email: supplier.email,
        title: "ביטול הזמנה",
        body: `ההזמנה עבור "${project.name}" בוטלה. סיבה: פרויקט בוטל`,
        channels: ["sms", "email", "whatsapp"],
      });
    }
  }
}
```

## Gap 4: Pre-Event Coordination Crons

**Problem**: No automated reminders before events.

### Cron A: Client Coordination (4 days before)

**New file**: `convex/preEventCoordination.ts`

**Handler type**: `internalAction` (can call `ctx.runQuery` for DB + `ctx.runAction` for sending)

**Logic**:
1. Query projects where `date` = today + 4 days AND `status` = `"בביצוע"` or `"אושר"`
2. For each project, resolve client contact:
   - If `project.leadId` exists → query lead for phone/email
   - Else → search `clients` table by project client name
   - If no contact info found → skip (do not error)
3. Send via `sendMultiChannel`

**Message**:
```
שלום,
האירוע "{projectName}" מתקרב! ({date})
נא לאשר:
• מספר משתתפים סופי
• רגישויות מזון / העדפות תזונה
• איש קשר ביום האירוע
• נקודות איסוף
• בקשות מיוחדות

צרו קשר עם המפיק לעדכון.
```

Note: No link provided since there is no public logistics form. The message directs the client to contact the producer. Adding a public logistics form is out of scope for this iteration.

### Cron B: Supplier Quantity Update (2 days before)

**Logic**:
1. Query projects where `date` = today + 2 days AND `status` = `"בביצוע"`
2. For each project, get all supplier orders with status `"sent"` or `"confirmed"`
3. Send updated info to each supplier

**Message**:
```
שלום {supplierName},
תזכורת: האירוע "{projectName}" ב-{date}.
כמות משתתפים: {participants}
איש קשר: {contactName} - {contactPhone}
```

### Cron schedule:
- Client coordination (4d): `"0 6 * * *"` (06:00 UTC = 09:00 Israel) — shares slot with existing doc expiry check, acceptable load
- Supplier quantity (2d): `"30 6 * * *"` (06:30 UTC = 09:30 Israel) — staggered by 30 minutes

### Idempotency:
Add `lastCoordinationSentAt` field to projects schema. Before sending, check if already sent today. Update after sending. This prevents double notifications on cron retries or redeployments.

**Files to modify**:
- `convex/preEventCoordination.ts` — new file with 2 internalActions
- `convex/crons.ts` — add 2 new cron entries
- `convex/schema.ts` — add `lastCoordinationSentAt` optional field to projects table

## Gap 5: Auto-Notify Restaurant on Field Ops Quantity Change

**Problem**: When field ops manager updates actual participant count, food/catering suppliers don't know. The stub already exists in `convex/fieldOperationStops.ts` `updateQuantity` mutation (line 89-91).

**Solution**: Replace the console.log stub with a real `scheduler.runAfter` call to `sendMultiChannel`.

**Files to modify**:
- `convex/fieldOperationStops.ts` — in `updateQuantity`, replace the console.log with:

```typescript
if (supplier?.phone || supplier?.email) {
  await ctx.scheduler.runAfter(0, internal.notificationSender.sendMultiChannel, {
    phone: supplier.phone,
    email: supplier.email,
    title: "עדכון כמות משתתפים",
    body: `עדכון דחוף — ${project.name}\nכמות משתתפים עודכנה: ${doc.plannedQuantity} → ${args.actualQuantity}`,
    channels: ["sms", "whatsapp"],
  });
}
```

Note: category matching already implemented correctly at lines 83-88 using Hebrew category names (`"מסעדות ואוכל"`, `"מזון"`, `"קייטרינג"`).

Also need to look up the project name — get `fieldOperation` → `projectId` → `project.name`.

## Gap 6: WhatsApp Business Incoming Lead Capture

**Problem**: No webhook for inbound WhatsApp messages to auto-create leads.

**Files to modify**:
- `convex/http.ts` — add two routes:
  - `GET /api/whatsapp/webhook` — verification endpoint
  - `POST /api/whatsapp/webhook` — incoming message handler

### GET (Verification):
```typescript
http.route({
  path: "/api/whatsapp/webhook",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;
    if (mode === "subscribe" && token === expectedToken) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }),
});
```

### POST (Incoming messages):
Parse Meta Cloud API format. Validate `X-Hub-Signature-256` using `WHATSAPP_APP_SECRET` env var. Extract sender name/phone/message text. Call `createFromWebhook` with `source: "whatsapp"`.

**Security**: Validate the `X-Hub-Signature-256` header against the payload using HMAC-SHA256 with the app secret. Reject requests that fail validation.

**Environment variables needed**:
- `WHATSAPP_VERIFY_TOKEN` — for GET verification
- `WHATSAPP_APP_SECRET` — for POST signature validation

## Summary of Changes

| Gap | Files | Type |
|-----|-------|------|
| 1. Availability notifications | `availabilityRequests.ts` | Modify mutation |
| 2. Order notifications | `supplierOrders.ts` | Modify mutations |
| 3. Cascade cancel notifications | `projects.ts`, `QuoteEditor.tsx` | Modify mutation + add UI button |
| 4. Pre-event crons | `preEventCoordination.ts` (new), `crons.ts`, `schema.ts` | New file + modify 2 files |
| 5. Field ops qty notify | `fieldOperationStops.ts` | Modify mutation |
| 6. WhatsApp webhook | `http.ts` | Add HTTP routes |

**Total**: 7 Convex files modified, 1 new Convex file, 1 React component modified, 2 new env vars.
