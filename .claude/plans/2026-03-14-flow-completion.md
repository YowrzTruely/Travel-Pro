# Flow Completion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire existing notification stubs to real multi-channel sending and add automated pre-event coordination crons — closing the last ~10% of Figma flow coverage.

**Architecture:** All changes are backend mutations/actions in Convex + one UI button. The existing `sendMultiChannel` internalAction (SMS via Twilio, Email via Resend, WhatsApp via wa.me) is the single delivery mechanism. Mutations schedule it via `ctx.scheduler.runAfter(0, ...)`. Crons use `internalAction` handlers that call it via `ctx.runAction`.

**Tech Stack:** Convex (TypeScript), React 18, Vite

**Spec:** `docs/specs/2026-03-14-flow-completion-design.md`

---

## Chunk 1: Notification Wiring (Gaps 1, 2, 5)

### Task 1: Wire Availability Request Notifications

**Files:**
- Modify: `convex/availabilityRequests.ts:26-66`

- [ ] **Step 1: Add internal import**

At the top of `convex/availabilityRequests.ts`, add the import for internal API and the scheduler:

```typescript
import { internal } from "./_generated/api";
```

The file already imports `mutation, query` from `"./_generated/server"` and `v` from `"convex/values"`. Just add the `internal` import.

- [ ] **Step 2: Add notification scheduling to `create` mutation**

After line 63 (after the invite token block, before the return), add notification scheduling:

```typescript
    // Notify supplier of availability request via multi-channel
    if (supplier) {
      const project = await ctx.db.get(args.projectId);
      let productName = "";
      if (args.productId) {
        const product = await ctx.db.get(args.productId);
        productName = product?.name ?? "";
      }
      const requestor = await ctx.db.get(args.requestedBy);
      const producerName = requestor?.name ?? requestor?.company ?? "מפיק";

      const siteUrl = process.env.CONVEX_SITE_URL
        ? process.env.CONVEX_SITE_URL.replace(".convex.site", ".vercel.app")
        : "https://travelpro.co.il";

      const link = inviteToken
        ? `${siteUrl}/availability-invite/${inviteToken}`
        : `${siteUrl}/requests`;

      const body = [
        `${producerName} בודק איתך זמינות לאירוע ב-${args.date}.`,
        args.participants ? `${args.participants} משתתפים` : "",
        productName ? `מוצר: ${productName}` : "",
        args.notes ? `הערות: ${args.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const channels: string[] = ["in_app"];
      if (supplier.phone) channels.push("sms", "whatsapp");
      if (supplier.email) channels.push("email");

      await ctx.scheduler.runAfter(
        0,
        internal.notificationSender.sendMultiChannel,
        {
          phone: supplier.phone,
          email: supplier.email,
          title: "בקשת זמינות חדשה",
          body,
          link,
          channels,
        }
      );
    }
```

- [ ] **Step 3: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS — no errors

- [ ] **Step 4: Test manually**

Start `npx convex dev`, go to a project in the app, click "בדיקת זמינות" tab, send a request. Check Convex dashboard logs for `[Email]` or `[SMS]` log entries showing the notification was scheduled.

- [ ] **Step 5: Commit**

```bash
git add convex/availabilityRequests.ts
git commit -m "feat: wire availability requests to real multi-channel notifications"
```

---

### Task 2: Wire Supplier Order Notifications (send + cancel)

**Files:**
- Modify: `convex/supplierOrders.ts:1-4,156-200`

- [ ] **Step 1: Add internal import**

Add at top of `convex/supplierOrders.ts`:

```typescript
import { internal } from "./_generated/api";
```

- [ ] **Step 2: Add notification to `sendOrder` mutation**

Replace the `sendOrder` mutation body (lines 156-173) with:

```typescript
export const sendOrder = mutation({
  args: { id: v.id("supplierOrders") },
  handler: async (ctx, { id }) => {
    const order = await ctx.db.get(id);
    if (!order) {
      throw new Error("Order not found");
    }
    await ctx.db.patch(id, { status: "sent" });

    // Notify supplier
    const supplier = await ctx.db.get(order.supplierId);
    const project = await ctx.db.get(order.projectId);
    let productName = "";
    if (order.productId) {
      const product = await ctx.db.get(order.productId);
      productName = product?.name ?? "";
    }

    if (supplier && (supplier.phone || supplier.email)) {
      const channels: string[] = ["in_app"];
      if (supplier.phone) channels.push("sms", "whatsapp");
      if (supplier.email) channels.push("email");

      await ctx.scheduler.runAfter(
        0,
        internal.notificationSender.sendMultiChannel,
        {
          phone: supplier.phone,
          email: supplier.email,
          title: "הזמנה חדשה",
          body: [
            `הזמנה עבור אירוע "${project?.name ?? ""}" ב-${order.date}.`,
            productName ? `מוצר: ${productName}` : "",
            `כמות: ${order.participants} משתתפים`,
            `מחיר מוסכם: ₪${order.agreedPrice.toLocaleString()}`,
          ]
            .filter(Boolean)
            .join("\n"),
          channels,
        }
      );
    }

    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});
```

- [ ] **Step 3: Add notification to `cancelOrder` mutation**

Replace the `cancelOrder` mutation body (lines 187-200) with:

```typescript
export const cancelOrder = mutation({
  args: {
    id: v.id("supplierOrders"),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, { id, cancellationReason }) => {
    const order = await ctx.db.get(id);
    if (!order) {
      throw new Error("Order not found");
    }
    await ctx.db.patch(id, { status: "cancelled" });

    // Notify supplier of cancellation
    const supplier = await ctx.db.get(order.supplierId);
    const project = await ctx.db.get(order.projectId);

    if (supplier && (supplier.phone || supplier.email)) {
      const channels: string[] = ["in_app"];
      if (supplier.phone) channels.push("sms", "whatsapp");
      if (supplier.email) channels.push("email");

      await ctx.scheduler.runAfter(
        0,
        internal.notificationSender.sendMultiChannel,
        {
          phone: supplier.phone,
          email: supplier.email,
          title: "ביטול הזמנה",
          body: `ההזמנה עבור "${project?.name ?? ""}" ב-${order.date} בוטלה.${cancellationReason ? `\nסיבה: ${cancellationReason}` : ""}`,
          channels,
        }
      );
    }

    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});
```

- [ ] **Step 4: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add convex/supplierOrders.ts
git commit -m "feat: wire supplier order send/cancel to multi-channel notifications"
```

---

### Task 3: Wire Field Ops Quantity Change Notification

**Files:**
- Modify: `convex/fieldOperationStops.ts:1-2,68-97,121-161`

- [ ] **Step 1: Add internal import**

Add at top of `convex/fieldOperationStops.ts`:

```typescript
import { internal } from "./_generated/api";
```

- [ ] **Step 2: Replace console.log stub in `updateQuantity` with real notification**

Replace lines 80-93 in the `updateQuantity` handler with:

```typescript
    // Auto-notify food suppliers on quantity change
    const supplier = await ctx.db.get(doc.supplierId);
    if (supplier) {
      const category = (supplier.category || "").toLowerCase();
      if (
        category.includes("מסעדות ואוכל") ||
        category.includes("מזון") ||
        category.includes("קייטרינג")
      ) {
        // Look up project name via fieldOperation
        const fieldOp = await ctx.db.get(doc.fieldOperationId);
        const project = fieldOp
          ? await ctx.db.get(fieldOp.projectId)
          : null;

        if (supplier.phone || supplier.email) {
          const channels: string[] = [];
          if (supplier.phone) channels.push("sms", "whatsapp");
          if (supplier.email) channels.push("email");

          await ctx.scheduler.runAfter(
            0,
            internal.notificationSender.sendMultiChannel,
            {
              phone: supplier.phone,
              email: supplier.email,
              title: "עדכון כמות משתתפים",
              body: `עדכון דחוף — ${project?.name ?? "אירוע"}\nכמות משתתפים עודכנה: ${doc.plannedQuantity} → ${args.actualQuantity}`,
              channels,
            }
          );
        }
      }
    }
```

- [ ] **Step 3: Replace console.log stub in `shiftTimes` with real notification**

Replace lines 154-159 (the notification stub loop in `shiftTimes`) with:

```typescript
    // Notify upcoming suppliers about time shift
    for (const stop of affectedStops) {
      const supplier = await ctx.db.get(stop.supplierId);
      if (supplier && (supplier.phone || supplier.email)) {
        const channels: string[] = [];
        if (supplier.phone) channels.push("sms", "whatsapp");
        if (supplier.email) channels.push("email");

        const newStart = addMinutesToTime(
          stop.plannedStartTime,
          args.minutesShift
        );
        await ctx.scheduler.runAfter(
          0,
          internal.notificationSender.sendMultiChannel,
          {
            phone: supplier.phone,
            email: supplier.email,
            title: "עדכון לוח זמנים",
            body: `שעת ההגעה החדשה שלך: ${newStart} (הוזז ב-${args.minutesShift} דקות)`,
            channels,
          }
        );
      }
    }
```

- [ ] **Step 4: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add convex/fieldOperationStops.ts
git commit -m "feat: wire field ops quantity change and time shift to real notifications"
```

---

## Chunk 2: Cascade Cancel Notifications (Gap 3)

### Task 4: Add Supplier Notifications to Existing Cascade Cancel

**Files:**
- Modify: `convex/projects.ts:1-4,150-176`

- [ ] **Step 1: Add internal import**

Add at top of `convex/projects.ts`:

```typescript
import { internal } from "./_generated/api";
```

- [ ] **Step 2: Add notification scheduling inside existing cascade cancel block**

In the `update` mutation, inside the `if (updates.status === "בוטל")` block (line 151), after the orders cancellation loop (line 175), add notifications. Replace the entire block (lines 150-176) with:

```typescript
    // Cascade cancellation: if project is cancelled, cancel all active bookings and orders
    if (updates.status === "בוטל") {
      const bookings = await ctx.db
        .query("bookings")
        .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
        .collect();
      for (const booking of bookings) {
        if (booking.status === "reserved" || booking.status === "confirmed") {
          await ctx.db.patch(booking._id, {
            status: "cancelled",
            cancelledAt: Date.now(),
            cancellationReason: "פרויקט בוטל",
          });
        }
      }
      const orders = await ctx.db
        .query("supplierOrders")
        .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
        .collect();
      for (const order of orders) {
        if (order.status !== "cancelled" && order.status !== "completed") {
          await ctx.db.patch(order._id, {
            status: "cancelled",
          });
          // Notify supplier of cancellation
          const supplier = await ctx.db.get(order.supplierId);
          if (supplier && (supplier.phone || supplier.email)) {
            const channels: string[] = [];
            if (supplier.phone) channels.push("sms", "whatsapp");
            if (supplier.email) channels.push("email");

            await ctx.scheduler.runAfter(
              0,
              internal.notificationSender.sendMultiChannel,
              {
                phone: supplier.phone,
                email: supplier.email,
                title: "ביטול הזמנה",
                body: `ההזמנה עבור "${project.name}" בוטלה.\nסיבה: פרויקט בוטל`,
                channels,
              }
            );
          }
        }
      }
    }
```

- [ ] **Step 3: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add convex/projects.ts
git commit -m "feat: add supplier notifications to cascade project cancellation"
```

---

### Task 5: Add Cancel Project Button to QuoteEditor

**Files:**
- Modify: `src/app/components/QuoteEditor.tsx`

- [ ] **Step 1: Add cancel project button to the action bar**

Find the section with "שמור טיוטה" and "ייצא PDF" buttons (around line 1820-1880). After the "שתף ללא מחירים" button, add a cancel button:

```tsx
        {project?.status !== "בוטל" && (
          <button
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-red-600 text-[13px] transition-colors hover:bg-red-100"
            onClick={async () => {
              if (
                !window.confirm(
                  "האם אתה בטוח שברצונך לבטל את הפרויקט? כל ההזמנות והשריונות יבוטלו והספקים יקבלו הודעה."
                )
              ) {
                return;
              }
              try {
                await updateProject({
                  id: project!._id,
                  status: "בוטל",
                });
                appToast.success("הפרויקט בוטל", "כל הספקים קיבלו הודעת ביטול");
              } catch {
                appToast.error("שגיאה בביטול הפרויקט");
              }
            }}
            type="button"
          >
            <X size={15} />
            בטל פרויקט
          </button>
        )}
```

Note: `X` icon is already imported from lucide-react in QuoteEditor. `updateProject` is the existing mutation call to `api.projects.update`.

- [ ] **Step 2: Verify `updateProject` mutation reference exists**

Check that the QuoteEditor already has `const updateProject = useMutation(api.projects.update)` — it should. If not, add it.

- [ ] **Step 3: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 4: Test manually**

Open a project, scroll to bottom action bar, see "בטל פרויקט" button. Click it, confirm dialog appears. Cancel to verify it doesn't proceed.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/QuoteEditor.tsx
git commit -m "feat: add cancel project button with confirmation dialog"
```

---

## Chunk 3: Pre-Event Coordination Crons (Gap 4)

### Task 6: Add `lastCoordinationSentAt` to Projects Schema

**Files:**
- Modify: `convex/schema.ts:181-206`

- [ ] **Step 1: Add field to projects table**

In `convex/schema.ts`, inside the `projects` table definition, after `openingParagraph` (line 203), add:

```typescript
    lastClientCoordinationAt: v.optional(v.number()),
    lastSupplierCoordinationAt: v.optional(v.number()),
```

- [ ] **Step 2: Run `npx convex dev` to sync schema**

Run: `npx convex dev` (let it sync, then Ctrl+C)
Expected: Schema pushed successfully

- [ ] **Step 3: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add convex/schema.ts
git commit -m "feat: add coordination timestamp fields to projects schema"
```

---

### Task 7: Create Pre-Event Coordination Actions

**Files:**
- Create: `convex/preEventCoordination.ts`

- [ ] **Step 1: Create the new file with both internalActions**

```typescript
"use node";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

/**
 * Cron A: Client coordination — 4 days before event.
 * Sends reminder to client to confirm participants, dietary needs, contact.
 */
export const sendClientCoordination = internalAction({
  args: {},
  handler: async (ctx) => {
    const target = new Date();
    target.setDate(target.getDate() + 4);
    const targetDate = target.toISOString().split("T")[0];

    const projects: Array<{
      _id: any;
      name: string;
      date?: string;
      status: string;
      leadId?: any;
      client?: string;
      lastClientCoordinationAt?: number;
    }> = await ctx.runQuery(internal.preEventCoordination.projectsByDate, {
      date: targetDate,
    });

    let sent = 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const project of projects) {
      // Idempotency: skip if already sent today
      if (
        project.lastClientCoordinationAt &&
        project.lastClientCoordinationAt > todayStart.getTime()
      ) {
        continue;
      }

      // Resolve client contact
      let phone: string | undefined;
      let email: string | undefined;

      if (project.leadId) {
        const lead: { phone?: string; email?: string } | null =
          await ctx.runQuery(internal.preEventCoordination.getLeadContact, {
            leadId: project.leadId,
          });
        if (lead) {
          phone = lead.phone;
          email = lead.email;
        }
      }

      if (!phone && !email) continue;

      const channels: string[] = [];
      if (phone) channels.push("sms", "whatsapp");
      if (email) channels.push("email");

      await ctx.runAction(internal.notificationSender.sendMultiChannel, {
        phone,
        email,
        title: `תיאום אירוע — ${project.name}`,
        body: [
          `שלום,`,
          `האירוע "${project.name}" מתקרב! (${project.date})`,
          `נא לאשר:`,
          `• מספר משתתפים סופי`,
          `• רגישויות מזון / העדפות תזונה`,
          `• איש קשר ביום האירוע`,
          `• נקודות איסוף`,
          `• בקשות מיוחדות`,
          ``,
          `צרו קשר עם המפיק לעדכון.`,
        ].join("\n"),
        channels,
      });

      // Mark as sent
      await ctx.runMutation(internal.preEventCoordination.markClientSent, {
        projectId: project._id,
      });
      sent++;
    }

    console.log(
      `[PreEvent] Client coordination: ${sent} notifications sent for ${targetDate}`
    );
    return { sent };
  },
});

/**
 * Cron B: Supplier quantity update — 2 days before event.
 * Sends updated participant counts to all suppliers with active orders.
 */
export const sendSupplierQuantityUpdate = internalAction({
  args: {},
  handler: async (ctx) => {
    const target = new Date();
    target.setDate(target.getDate() + 2);
    const targetDate = target.toISOString().split("T")[0];

    const projects: Array<{
      _id: any;
      name: string;
      date?: string;
      status: string;
      participants: number;
      client?: string;
      lastSupplierCoordinationAt?: number;
    }> = await ctx.runQuery(internal.preEventCoordination.projectsByDate, {
      date: targetDate,
    });

    let sent = 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const project of projects) {
      if (
        project.lastSupplierCoordinationAt &&
        project.lastSupplierCoordinationAt > todayStart.getTime()
      ) {
        continue;
      }

      // Get active orders for this project
      const orders: Array<{
        _id: any;
        supplierId: any;
        status: string;
        date: string;
        contactName?: string;
        contactPhone?: string;
      }> = await ctx.runQuery(
        internal.preEventCoordination.activeOrdersByProject,
        { projectId: project._id }
      );

      for (const order of orders) {
        const supplier: { phone?: string; email?: string; name?: string } | null =
          await ctx.runQuery(internal.preEventCoordination.getSupplierContact, {
            supplierId: order.supplierId,
          });

        if (!supplier || (!supplier.phone && !supplier.email)) continue;

        const channels: string[] = [];
        if (supplier.phone) channels.push("sms", "whatsapp");
        if (supplier.email) channels.push("email");

        const contactLine =
          order.contactName && order.contactPhone
            ? `איש קשר: ${order.contactName} - ${order.contactPhone}`
            : "";

        await ctx.runAction(internal.notificationSender.sendMultiChannel, {
          phone: supplier.phone,
          email: supplier.email,
          title: `תזכורת אירוע — ${project.name}`,
          body: [
            `שלום ${supplier.name ?? ""},`,
            `תזכורת: האירוע "${project.name}" ב-${project.date}.`,
            `כמות משתתפים: ${project.participants}`,
            contactLine,
          ]
            .filter(Boolean)
            .join("\n"),
          channels,
        });
        sent++;
      }

      await ctx.runMutation(internal.preEventCoordination.markSupplierSent, {
        projectId: project._id,
      });
    }

    console.log(
      `[PreEvent] Supplier coordination: ${sent} notifications sent for ${targetDate}`
    );
    return { sent };
  },
});
```

- [ ] **Step 2: Add the helper queries and mutations (same file, append at bottom)**

```typescript
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const projectsByDate = internalQuery({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.filter(
      (p) =>
        p.date === date &&
        (p.status === "בביצוע" || p.status === "אושר")
    );
  },
});

export const getLeadContact = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    return lead ? { phone: lead.phone, email: lead.email } : null;
  },
});

export const getSupplierContact = internalQuery({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const s = await ctx.db.get(supplierId);
    return s ? { phone: s.phone, email: s.email, name: s.name } : null;
  },
});

export const activeOrdersByProject = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const orders = await ctx.db
      .query("supplierOrders")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
    return orders.filter(
      (o) => o.status === "sent" || o.status === "confirmed"
    );
  },
});

export const markClientSent = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await ctx.db.patch(projectId, {
      lastClientCoordinationAt: Date.now(),
    });
  },
});

export const markSupplierSent = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await ctx.db.patch(projectId, {
      lastSupplierCoordinationAt: Date.now(),
    });
  },
});
```

Note: The imports `v`, `internalMutation`, `internalQuery` must be at the top of the file alongside the existing imports. Reorganize so all imports are at top:

```typescript
"use node";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
```

- [ ] **Step 3: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add convex/preEventCoordination.ts
git commit -m "feat: add pre-event client and supplier coordination actions"
```

---

### Task 8: Register Pre-Event Crons

**Files:**
- Modify: `convex/crons.ts`

- [ ] **Step 1: Add 2 new cron entries**

After the existing `send order reminders` cron (line 38), add:

```typescript
// 6:00 UTC = 9:00 Israel time — send client coordination 4 days before event
crons.cron(
  "client coordination 4 days before",
  "0 6 * * *",
  internal.preEventCoordination.sendClientCoordination
);

// 6:30 UTC = 9:30 Israel time — send supplier quantity update 2 days before event
crons.cron(
  "supplier coordination 2 days before",
  "30 6 * * *",
  internal.preEventCoordination.sendSupplierQuantityUpdate
);
```

- [ ] **Step 2: Run `npx convex dev` to sync crons**

Run: `npx convex dev` (verify cron registration in logs)
Expected: "7 crons registered" (was 5)

- [ ] **Step 3: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add convex/crons.ts
git commit -m "feat: register pre-event coordination crons (4-day client, 2-day supplier)"
```

---

## Chunk 4: WhatsApp Webhook (Gap 6)

### Task 9: Add WhatsApp Business Incoming Webhook

**Files:**
- Modify: `convex/http.ts`

- [ ] **Step 1: Add GET verification route**

After the existing lead webhook route (line 105), before `export default http;`, add:

```typescript
// ─── WhatsApp Business Incoming Webhook ───

// GET: Verification endpoint for Meta webhook setup
http.route({
  path: "/api/whatsapp/webhook",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === "subscribe" && token && token === expectedToken) {
      console.log("[WhatsApp Webhook] Verification successful");
      return new Response(challenge ?? "", { status: 200 });
    }
    console.warn("[WhatsApp Webhook] Verification failed");
    return new Response("Forbidden", { status: 403 });
  }),
});

// POST: Receive incoming WhatsApp messages and create leads
http.route({
  path: "/api/whatsapp/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Validate X-Hub-Signature-256
      const signature = request.headers.get("x-hub-signature-256");
      const appSecret = process.env.WHATSAPP_APP_SECRET;
      const bodyText = await request.text();

      if (appSecret && signature) {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(appSecret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const sig = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(bodyText)
        );
        const expectedSig = `sha256=${Array.from(new Uint8Array(sig))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")}`;
        if (signature !== expectedSig) {
          console.warn("[WhatsApp Webhook] Invalid signature");
          return new Response("Unauthorized", { status: 401 });
        }
      }

      const body = JSON.parse(bodyText);

      // Parse Meta Cloud API format
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;
      const contacts = value?.contacts;

      if (!messages || messages.length === 0) {
        // Not a message event (could be status update) — acknowledge
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const msg = messages[0];
      const contact = contacts?.[0];
      const phone = msg.from ?? "";
      const text = msg.text?.body ?? "";
      const name = contact?.profile?.name ?? phone;

      // Create lead from incoming WhatsApp message
      await ctx.runMutation(internal.leads.createFromWebhook, {
        source: "whatsapp",
        name,
        phone,
        email: "",
        notes: text,
      });

      console.log(
        `[WhatsApp Webhook] Lead created from ${name} (${phone}): "${text.slice(0, 50)}"`
      );

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[WhatsApp Webhook] Failed:", error);
      return new Response(JSON.stringify({ ok: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});
```

- [ ] **Step 2: Run lint and type-check**

Run: `bun lint && bun tsc && bun ultracite`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add convex/http.ts
git commit -m "feat: add WhatsApp Business incoming webhook for auto lead capture"
```

---

## Chunk 5: Final Verification

### Task 10: Full Verification Pass

- [ ] **Step 1: Run all checks**

```bash
bun lint && bun tsc && bun ultracite
```

Expected: PASS — zero errors

- [ ] **Step 2: Start Convex dev and verify function registration**

Run: `npx convex dev`
Expected: All functions sync, 7 crons registered, no errors

- [ ] **Step 3: Verify in app — test each flow**

1. **Availability request**: Go to project → Availability tab → send request → check Convex logs for notification
2. **Order send**: Go to project → Orders tab → send order → check logs
3. **Order cancel**: Cancel an order → check logs for cancellation notification
4. **Project cancel**: Click "בטל פרויקט" → confirm → verify all orders cancelled + notifications sent
5. **Field ops qty**: Open field HQ → update participant count on a food supplier stop → check logs
6. **Time shift**: Shift times → check logs for supplier notifications

- [ ] **Step 4: Final commit if any lint fixes needed**

```bash
git add -A
git commit -m "chore: final lint fixes for flow completion"
```
