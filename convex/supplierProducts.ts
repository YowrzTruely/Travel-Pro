import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listBySupplierId = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const products = await ctx.db
      .query("supplierProducts")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
      .collect();
    return products.map((p) => ({
      ...p,
      id: p._id,
      images: p.images?.map((img) => ({
        ...img,
        url: img.storageId, // Will be resolved on client via getImageUrl
      })),
    }));
  },
});

export const create = mutation({
  args: {
    supplierId: v.id("suppliers"),
    name: v.string(),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    unit: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierProducts", {
      supplierId: args.supplierId,
      name: args.name,
      price: args.price ?? 0,
      description: args.description || "",
      unit: args.unit || "אדם",
      notes: args.notes,
    });
    const product = await ctx.db.get(id);
    if (!product) {
      throw new Error("Supplier product not found after creation");
    }
    return { ...product, id: product._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("supplierProducts"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    unit: v.optional(v.string()),
    notes: v.optional(v.string()),
    images: v.optional(
      v.array(
        v.object({
          id: v.string(),
          storageId: v.string(),
          name: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Product not found");
    }
    await ctx.db.patch(id, updates);
    const product = await ctx.db.get(id);
    if (!product) {
      throw new Error("Supplier product not found after update");
    }
    return { ...product, id: product._id };
  },
});

export const remove = mutation({
  args: { id: v.id("supplierProducts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
