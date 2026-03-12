/**
 * One-off cleanup: delete authAccounts + authSessions whose linked
 * user record no longer exists. This fixes the
 * "Cannot read properties of null (reading '_id')" crash in
 * @convex-dev/auth's Password provider.
 *
 * Run via Convex Dashboard → Functions → cleanupOrphanedAuth:cleanup
 * or: npx convex run cleanupOrphanedAuth:cleanup
 *
 * Safe to delete this file after running.
 */
import { mutation } from "./_generated/server";

export const cleanup = mutation({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("authAccounts").collect();
    let deletedAccounts = 0;
    let deletedSessions = 0;

    for (const account of accounts) {
      const user = await ctx.db.get(account.userId);
      if (user === null) {
        // Delete sessions linked to this account first
        const sessions = await ctx.db
          .query("authSessions")
          .withIndex("userId", (q) => q.eq("userId", account.userId))
          .collect();
        for (const session of sessions) {
          await ctx.db.delete(session._id);
          deletedSessions++;
        }
        await ctx.db.delete(account._id);
        deletedAccounts++;
      }
    }

    return { deletedAccounts, deletedSessions };
  },
});
