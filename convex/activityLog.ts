import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    userId: v.optional(v.id("users")),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    details: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("activityLog", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    entityType: v.optional(v.string()),
    action: v.optional(v.string()),
    fromDate: v.optional(v.number()),
    toDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const q = ctx.db
      .query("activityLog")
      .withIndex("by_createdAt")
      .order("desc");

    const all = await q.collect();

    const filtered = all.filter((entry) => {
      if (args.userId && entry.userId !== args.userId) {
        return false;
      }
      if (args.entityType && entry.entityType !== args.entityType) {
        return false;
      }
      if (args.action && entry.action !== args.action) {
        return false;
      }
      if (args.fromDate && entry.createdAt < args.fromDate) {
        return false;
      }
      if (args.toDate && entry.createdAt > args.toDate) {
        return false;
      }
      return true;
    });

    return filtered.slice(0, limit).map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const listByEntity = query({
  args: {
    entityType: v.string(),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("activityLog")
      .withIndex("by_entityType", (q) => q.eq("entityType", args.entityType))
      .collect();

    return entries
      .filter((e) => e.entityId === args.entityId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((doc) => ({ ...doc, id: doc._id }));
  },
});
