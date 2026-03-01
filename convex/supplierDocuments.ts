import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("supplierDocuments").collect();
    return docs.map((d) => ({ ...d, id: d._id }));
  },
});

export const listBySupplierId = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const docs = await ctx.db
      .query("supplierDocuments")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
      .collect();
    return docs.map((d) => ({ ...d, id: d._id }));
  },
});

export const create = mutation({
  args: {
    supplierId: v.id("suppliers"),
    name: v.string(),
    expiry: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("valid"), v.literal("warning"), v.literal("expired"))
    ),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierDocuments", {
      supplierId: args.supplierId,
      name: args.name,
      expiry: args.expiry || "",
      status: args.status || "valid",
      fileName: args.fileName,
    });
    const doc = await ctx.db.get(id);
    return { ...doc!, id: doc!._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("supplierDocuments"),
    name: v.optional(v.string()),
    expiry: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("valid"), v.literal("warning"), v.literal("expired"))
    ),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Document not found");
    await ctx.db.patch(id, updates);
    const doc = await ctx.db.get(id);
    return { ...doc!, id: doc!._id };
  },
});

export const remove = mutation({
  args: { id: v.id("supplierDocuments") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
