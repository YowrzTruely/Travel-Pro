import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByProjectId = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const items = await ctx.db
      .query("quoteItems")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
    return items.map((item) => ({
      ...item,
      id: item._id,
      images: item.images?.map((img) => ({
        ...img,
        url: img.storageId,
      })),
    }));
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    type: v.optional(v.string()),
    icon: v.optional(v.string()),
    name: v.string(),
    supplier: v.optional(v.string()),
    description: v.optional(v.string()),
    cost: v.optional(v.number()),
    directPrice: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    profitWeight: v.optional(v.number()),
    status: v.optional(v.string()),
    alternatives: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          description: v.string(),
          costPerPerson: v.number(),
          selected: v.boolean(),
        })
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("quoteItems", {
      projectId: args.projectId,
      type: args.type || "",
      icon: args.icon || "📦",
      name: args.name,
      supplier: args.supplier || "",
      description: args.description || "",
      cost: args.cost ?? 0,
      directPrice: args.directPrice ?? 0,
      sellingPrice: args.sellingPrice ?? 0,
      profitWeight: args.profitWeight ?? 3,
      status: args.status || "pending",
      alternatives: args.alternatives || [],
      notes: args.notes,
    });
    const item = await ctx.db.get(id);
    return { ...item!, id: item!._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("quoteItems"),
    type: v.optional(v.string()),
    icon: v.optional(v.string()),
    name: v.optional(v.string()),
    supplier: v.optional(v.string()),
    description: v.optional(v.string()),
    cost: v.optional(v.number()),
    directPrice: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    profitWeight: v.optional(v.number()),
    status: v.optional(v.string()),
    alternatives: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          description: v.string(),
          costPerPerson: v.number(),
          selected: v.boolean(),
        })
      )
    ),
    images: v.optional(
      v.array(
        v.object({
          id: v.string(),
          storageId: v.string(),
          name: v.string(),
        })
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Quote item not found");
    await ctx.db.patch(id, updates);
    const item = await ctx.db.get(id);
    return { ...item!, id: item!._id };
  },
});

export const remove = mutation({
  args: { id: v.id("quoteItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
