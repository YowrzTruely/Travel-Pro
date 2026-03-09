import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    channel: v.union(
      v.literal("in_app"),
      v.literal("email"),
      v.literal("sms"),
      v.literal("whatsapp")
    ),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) =>
        q.eq("userId", args.userId).eq("read", false)
      )
      .collect();
    for (const doc of unread) {
      await ctx.db.patch(doc._id, { read: true });
    }
    return { count: unread.length };
  },
});
