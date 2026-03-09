import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
