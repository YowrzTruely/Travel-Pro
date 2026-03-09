import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { id: v.id("fieldOperations") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      return null;
    }
    return { ...doc, id: doc._id };
  },
});

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("fieldOperations")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .first();
    if (!doc) {
      return null;
    }
    return { ...doc, id: doc._id };
  },
});

export const create = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("fieldOperations", {
      projectId: args.projectId,
      status: "planned",
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    return { ...doc, id: doc?._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("fieldOperations"),
    status: v.optional(
      v.union(
        v.literal("planned"),
        v.literal("in_progress"),
        v.literal("completed")
      )
    ),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    const doc = await ctx.db.get(id);
    return { ...doc, id: doc?._id };
  },
});
