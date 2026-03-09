import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProductId = query({
  args: { productId: v.id("supplierProducts") },
  handler: async (ctx, { productId }) => {
    const addons = await ctx.db
      .query("productAddons")
      .withIndex("by_productId", (q) => q.eq("productId", productId))
      .collect();
    return addons.map((a) => ({ ...a, id: a._id }));
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
    const id = await ctx.db.insert("productAddons", {
      productId: args.productId,
      name: args.name,
      description: args.description,
      listPrice: args.listPrice,
      directPrice: args.directPrice,
      producerPrice: args.producerPrice,
      unit: args.unit,
    });
    const addon = await ctx.db.get(id);
    if (!addon) {
      throw new Error("Product addon not found after creation");
    }
    return { ...addon, id: addon._id };
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
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Product addon not found");
    }
    await ctx.db.patch(id, updates);
    const addon = await ctx.db.get(id);
    if (!addon) {
      throw new Error("Product addon not found after update");
    }
    return { ...addon, id: addon._id };
  },
});

export const remove = mutation({
  args: { id: v.id("productAddons") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
