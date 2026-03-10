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

export const createBulk = mutation({
  args: {
    projectId: v.id("projects"),
    participantName: v.optional(v.string()),
    ratings: v.array(
      v.object({
        supplierId: v.id("suppliers"),
        rating: v.number(),
        comment: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids: string[] = [];
    for (const r of args.ratings) {
      const id = await ctx.db.insert("supplierRatings", {
        supplierId: r.supplierId,
        projectId: args.projectId,
        participantName: args.participantName,
        rating: r.rating,
        comment: r.comment,
        isProducerRating: false,
        createdAt: Date.now(),
      });
      ids.push(id);

      // Update supplier averageRating and totalRatings
      const supplier = await ctx.db.get(r.supplierId);
      if (supplier) {
        const currentTotal = supplier.totalRatings ?? 0;
        const currentAvg = supplier.averageRating ?? 0;
        const newTotal = currentTotal + 1;
        const newAvg = (currentAvg * currentTotal + r.rating) / newTotal;
        await ctx.db.patch(r.supplierId, {
          averageRating: Math.round(newAvg * 100) / 100,
          totalRatings: newTotal,
        });
      }
    }
    return { success: true, count: ids.length };
  },
});
