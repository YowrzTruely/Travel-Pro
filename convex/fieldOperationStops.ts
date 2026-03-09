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
