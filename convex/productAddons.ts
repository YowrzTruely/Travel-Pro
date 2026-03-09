import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProductId = query({
  args: { productId: v.id("supplierProducts") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("productAddons")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    productId: v.id("supplierProducts"),
    name: v.string(),
    description: v.optional(v.string()),
    listPrice: v.number(),
    directPrice: v.optional(v.number()),
    producerPrice: v.optional(v.number()),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("productAddons", args);
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("productAddons"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    listPrice: v.optional(v.number()),
    directPrice: v.optional(v.number()),
    producerPrice: v.optional(v.number()),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const remove = mutation({
  args: { id: v.id("productAddons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});
