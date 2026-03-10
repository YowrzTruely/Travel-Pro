import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByOperation = query({
  args: { fieldOperationId: v.id("fieldOperations") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("fieldOperationStops")
      .withIndex("by_fieldOperationId", (q) =>
        q.eq("fieldOperationId", args.fieldOperationId)
      )
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    fieldOperationId: v.id("fieldOperations"),
    quoteItemId: v.optional(v.id("quoteItems")),
    supplierId: v.id("suppliers"),
    supplierName: v.string(),
    orderIndex: v.number(),
    plannedStartTime: v.string(),
    plannedEndTime: v.string(),
    plannedQuantity: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("fieldOperationStops", {
      ...args,
      status: "upcoming",
    });
    const doc = await ctx.db.get(id);
    return { ...doc, id: doc?._id };
  },
});

export const startStop = mutation({
  args: { id: v.id("fieldOperationStops") },
  handler: async (ctx, args) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    await ctx.db.patch(args.id, {
      status: "in_progress",
      actualStartTime: `${hh}:${mm}`,
    });
    const doc = await ctx.db.get(args.id);
    return { ...doc, id: doc?._id };
  },
});

export const endStop = mutation({
  args: { id: v.id("fieldOperationStops") },
  handler: async (ctx, args) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    await ctx.db.patch(args.id, {
      status: "completed",
      actualEndTime: `${hh}:${mm}`,
    });
    const doc = await ctx.db.get(args.id);
    return { ...doc, id: doc?._id };
  },
});

export const updateQuantity = mutation({
  args: {
    id: v.id("fieldOperationStops"),
    actualQuantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { actualQuantity: args.actualQuantity });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      return { id: args.id };
    }

    // Auto-notify food suppliers on quantity change (Fix 7)
    const supplier = await ctx.db.get(doc.supplierId);
    if (supplier) {
      const category = (supplier.category || "").toLowerCase();
      if (
        category.includes("מסעדות ואוכל") ||
        category.includes("מזון") ||
        category.includes("קייטרינג")
      ) {
        console.log(
          `[NotificationStub] Food supplier "${supplier.name}" quantity updated to ${args.actualQuantity} (was ${doc.plannedQuantity}). Would send multi-channel notification.`
        );
      }
    }

    return { ...doc, id: doc._id };
  },
});

export const saveSignature = mutation({
  args: {
    id: v.id("fieldOperationStops"),
    supplierSignature: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      supplierSignature: args.supplierSignature,
    });
    const doc = await ctx.db.get(args.id);
    return { ...doc, id: doc?._id };
  },
});

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
  const newM = ((totalMinutes % 60) + 60) % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export const shiftTimes = mutation({
  args: {
    fieldOperationId: v.id("fieldOperations"),
    minutesShift: v.number(),
    fromOrderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const stops = await ctx.db
      .query("fieldOperationStops")
      .withIndex("by_fieldOperationId", (q) =>
        q.eq("fieldOperationId", args.fieldOperationId)
      )
      .collect();

    const affectedStops: typeof stops = [];
    for (const stop of stops) {
      if (stop.orderIndex >= args.fromOrderIndex) {
        await ctx.db.patch(stop._id, {
          plannedStartTime: addMinutesToTime(
            stop.plannedStartTime,
            args.minutesShift
          ),
          plannedEndTime: addMinutesToTime(
            stop.plannedEndTime,
            args.minutesShift
          ),
        });
        if (stop.status === "upcoming") {
          affectedStops.push(stop);
        }
      }
    }

    // Notify upcoming suppliers about time shift (Fix 8)
    for (const stop of affectedStops) {
      console.log(
        `[NotificationStub] Time shift: supplier "${stop.supplierName}" (stop #${stop.orderIndex}) shifted by ${args.minutesShift} minutes. Would send WhatsApp/multi-channel notification.`
      );
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("fieldOperationStops"),
    actualStartTime: v.optional(v.string()),
    actualEndTime: v.optional(v.string()),
    actualQuantity: v.optional(v.number()),
    supplierSignature: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("skipped")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    const doc = await ctx.db.get(id);
    return { ...doc, id: doc?._id };
  },
});
