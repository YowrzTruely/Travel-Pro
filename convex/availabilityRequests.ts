import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("availabilityRequests")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("availabilityRequests")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    quoteItemId: v.id("quoteItems"),
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    requestedBy: v.id("users"),
    date: v.string(),
    participants: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("availabilityRequests", {
      ...args,
      status: "pending",
      requestedAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});

export const respond = mutation({
  args: {
    id: v.id("availabilityRequests"),
    status: v.union(
      v.literal("approved"),
      v.literal("declined"),
      v.literal("alternative_proposed")
    ),
    responseNotes: v.optional(v.string()),
    alternativeProductId: v.optional(v.id("supplierProducts")),
    alternativeDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      respondedAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});
