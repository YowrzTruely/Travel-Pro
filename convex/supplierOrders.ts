import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("supplierOrders")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("supplierOrders")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
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
    usesCustomFormat: v.boolean(),
    customFormatNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierOrders", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("supplierOrders"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("sent"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    time: v.optional(v.string()),
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }
    await ctx.db.patch(id, patch);
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const generateOrdersForProject = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const items = await ctx.db
      .query("quoteItems")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();

    // Group items by supplierId
    const supplierItems = new Map<string, typeof items>();
    for (const item of items) {
      if (!item.supplierId) {
        continue;
      }
      const key = item.supplierId;
      if (!supplierItems.has(key)) {
        supplierItems.set(key, []);
      }
      supplierItems.get(key)?.push(item);
    }

    let ordersCreated = 0;
    for (const [supplierId, sItems] of supplierItems) {
      const supplier = await ctx.db.get(supplierId as Id<"suppliers">);
      const totalPrice = sItems.reduce((sum, i) => sum + (i.cost || 0), 0);

      const orderId = await ctx.db.insert("supplierOrders", {
        projectId,
        supplierId: supplierId as Id<"suppliers">,
        productId: sItems[0].productId,
        clientName: project.client || project.company || project.name,
        date: project.date || new Date().toISOString().split("T")[0],
        participants: project.participants,
        agreedPrice: totalPrice,
        usesCustomFormat: supplier?.usesCustomOrderFormat ?? false,
        customFormatNotes: supplier?.customOrderFormatNotes,
        status: "pending",
        createdAt: Date.now(),
      });

      await ctx.db.insert("invoiceTracking", {
        projectId,
        supplierId: supplierId as Id<"suppliers">,
        orderId,
        status: "pending",
        createdAt: Date.now(),
      });

      ordersCreated++;
    }

    // Block archiving until invoices received
    await ctx.db.patch(projectId, {
      archiveBlocked: true,
      archiveBlockReason: "ממתין לקבלת חשבוניות מספקים",
    });

    return { ordersCreated };
  },
});

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
      if (supplier.phone) {
        channels.push("sms", "whatsapp");
      }
      if (supplier.email) {
        channels.push("email");
      }

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

export const confirmOrder = mutation({
  args: { id: v.id("supplierOrders") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "confirmed" });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

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
      if (supplier.phone) {
        channels.push("sms", "whatsapp");
      }
      if (supplier.email) {
        channels.push("email");
      }

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

/** Daily cron: send reminders for orders with events in the next 7 days */
export const sendUpcomingReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split("T")[0];
    const in7DaysStr = in7Days.toISOString().split("T")[0];

    const orders = await ctx.db.query("supplierOrders").collect();
    let remindersSent = 0;

    for (const order of orders) {
      if (
        (order.status === "sent" || order.status === "confirmed") &&
        order.date >= todayStr &&
        order.date <= in7DaysStr
      ) {
        const supplier = await ctx.db.get(order.supplierId);
        if (supplier?.userId) {
          await ctx.db.insert("notifications", {
            userId: supplier.userId,
            type: "order_reminder",
            title: "תזכורת הזמנה",
            body: `הזמנה לתאריך ${order.date} — ${order.participants} משתתפים`,
            channel: "in_app",
            read: false,
            createdAt: Date.now(),
          });
          remindersSent++;
        }
      }
    }

    return { remindersSent };
  },
});
