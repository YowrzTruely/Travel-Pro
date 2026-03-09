import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("bookings")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("bookings")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    availabilityRequestId: v.id("availabilityRequests"),
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    date: v.string(),
    participants: v.number(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("bookings", {
      ...args,
      status: "reserved",
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});

export const cancel = mutation({
  args: {
    id: v.id("bookings"),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "cancelled",
      cancellationReason: args.cancellationReason,
      cancelledAt: Date.now(),
    });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const expire = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "expired",
    });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});
