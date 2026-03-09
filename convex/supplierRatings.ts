import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("supplierRatings")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const getAverageRating = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("supplierRatings")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return { average: sum / ratings.length, count: ratings.length };
  },
});

export const create = mutation({
  args: {
    supplierId: v.id("suppliers"),
    projectId: v.id("projects"),
    ratedBy: v.optional(v.id("users")),
    participantName: v.optional(v.string()),
    rating: v.number(),
    comment: v.optional(v.string()),
    isProducerRating: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierRatings", {
      ...args,
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});
