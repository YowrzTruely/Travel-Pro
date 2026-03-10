import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Helper: resolve the current user's _id from auth identity.
 * Returns null if not authenticated or user not found.
 */
async function resolveUserId(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: any;
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  // tokenIdentifier is "{issuer}|{userId}|{sessionId}"
  const parts = identity.tokenIdentifier.split("|");
  if (parts.length >= 2) {
    try {
      const userId = ctx.db.normalizeId("users", parts[1]);
      if (userId) {
        const user = await ctx.db.get(userId);
        if (user) {
          return user._id;
        }
      }
    } catch {
      // normalizeId may throw if the string isn't a valid ID
    }
  }

  // Fallback: try by authId index
  const byAuthId = await ctx.db
    .query("users")
    .withIndex("by_authId", (q: any) =>
      q.eq("authId", identity.tokenIdentifier)
    )
    .first();
  if (byAuthId) {
    return byAuthId._id;
  }

  return null;
}

// ─── Queries ───

export const listForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await resolveUserId(ctx);
    if (!userId) {
      return [];
    }

    const docs = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await resolveUserId(ctx);
    if (!userId) {
      return 0;
    }

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) =>
        q.eq("userId", userId).eq("read", false)
      )
      .collect();
    return unread.length;
  },
});

// ─── Mutations (user-facing) ───

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
  args: {},
  handler: async (ctx) => {
    const userId = await resolveUserId(ctx);
    if (!userId) {
      return { count: 0 };
    }

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) =>
        q.eq("userId", userId).eq("read", false)
      )
      .collect();
    for (const doc of unread) {
      await ctx.db.patch(doc._id, { read: true });
    }
    return { count: unread.length };
  },
});

// ─── Internal mutations (for crons & system use) ───

export const createForUser = internalMutation({
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
    triggerExternal: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { triggerExternal, ...notifFields } = args;

    const id = await ctx.db.insert("notifications", {
      ...notifFields,
      read: false,
      externalDeliveryStatus:
        notifFields.channel !== "in_app" ? "pending" : undefined,
      createdAt: Date.now(),
    });

    // If external delivery requested, schedule the sender action
    if (triggerExternal && notifFields.channel !== "in_app") {
      const user = await ctx.db.get(args.userId);
      if (user) {
        await ctx.scheduler.runAfter(
          0,
          internal.notificationSender.sendMultiChannel,
          {
            userId: args.userId,
            phone: user.phone,
            email: user.email,
            title: args.title,
            body: args.body,
            link: args.link,
            channels: [notifFields.channel],
          }
        );
      }
    }

    return id;
  },
});

export const createBulk = internalMutation({
  args: {
    userIds: v.array(v.id("users")),
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
    const { userIds, ...notifFields } = args;
    const ids: string[] = [];
    for (const userId of userIds) {
      const id = await ctx.db.insert("notifications", {
        ...notifFields,
        userId,
        read: false,
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return { count: ids.length };
  },
});
