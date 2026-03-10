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
