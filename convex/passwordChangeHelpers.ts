import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getAuthAccount = internalQuery({
  args: {
    email: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", args.provider).eq("providerAccountId", args.email)
      )
      .unique();

    if (!account) {
      return null;
    }

    return {
      _id: account._id,
      secret: account.secret,
    };
  },
});

export const getUserEmailByTokenIdentifier = internalQuery({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // tokenIdentifier is "{issuer}|{userId}|{sessionId}"
    const parts = args.tokenIdentifier.split("|");
    if (parts.length >= 2) {
      try {
        const userId = ctx.db.normalizeId("users", parts[1]);
        if (userId) {
          const user = await ctx.db.get(userId);
          if (user?.email) {
            return user.email;
          }
        }
      } catch {
        // normalizeId may throw if the string isn't a valid ID
      }
    }

    // Fallback: try by authId index
    const byAuthId = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.tokenIdentifier))
      .first();
    if (byAuthId?.email) {
      return byAuthId.email;
    }

    return null;
  },
});

export const updateAuthAccountSecret = internalMutation({
  args: {
    accountId: v.id("authAccounts"),
    newSecret: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accountId, {
      secret: args.newSecret,
    });
  },
});
