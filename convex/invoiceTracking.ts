import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("invoiceTracking")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    orderId: v.optional(v.id("supplierOrders")),
    invoiceNumber: v.optional(v.string()),
    amount: v.optional(v.number()),
    fileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("invoiceTracking", {
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

export const markReceived = mutation({
  args: { id: v.id("invoiceTracking") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "received",
      receivedAt: Date.now(),
    });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});
