import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("supplierPromotions")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    title: v.string(),
    description: v.optional(v.string()),
    discountPercent: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    startsAt: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierPromotions", {
      ...args,
      isActive: true,
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
    id: v.id("supplierPromotions"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    discountPercent: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    startsAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
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

export const listActive = query({
  args: { supplierId: v.optional(v.id("suppliers")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const { supplierId } = args;
    const docs = supplierId
      ? await ctx.db
          .query("supplierPromotions")
          .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
          .collect()
      : await ctx.db.query("supplierPromotions").collect();
    const active = docs.filter((d) => d.isActive && d.expiresAt > now);
    return active.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const deactivate = mutation({
  args: { id: v.id("supplierPromotions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});
