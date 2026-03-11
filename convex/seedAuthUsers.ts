"use node";

/**
 * Reset password hashes for the three QA test users.
 * Run with: npx convex run seedAuthUsers:run
 *
 * Requires SEED_AUTH_SECRET env var in Convex Dashboard to match,
 * or pass --no-push and run locally (dev deployment only).
 */

import { Scrypt } from "lucia";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const TEST_USERS = [
  { email: "ro.levin@icloud.com", password: "Inacce551bleEncrypt10n", role: "admin" },
  { email: "orangeayx@gmail.com", password: "Inacce551bleEncrypt10n", role: "producer" },
  { email: "head0.25s@gmail.com", password: "Unbre4k4ble4m4t10n", role: "supplier" },
] as const;

export const run = action({
  args: {
    secretKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expected =
      process.env.SEED_AUTH_SECRET ?? "dev-seed-allow-local-only";
    if (args.secretKey !== expected) {
      throw new Error(
        `Invalid secretKey. Pass secretKey: "dev-seed-allow-local-only" for local dev, or set SEED_AUTH_SECRET in Convex Dashboard and pass matching secretKey.`
      );
    }

    const scrypt = new Scrypt();
    const results: { email: string; status: "updated" | "not_found" }[] = [];

    for (const user of TEST_USERS) {
      const account = await ctx.runQuery(
        internal.passwordChangeHelpers.getAuthAccount,
        { email: user.email, provider: "password" }
      );

      if (!account) {
        results.push({ email: user.email, status: "not_found" });
        continue;
      }

      const newHash = await scrypt.hash(user.password);
      await ctx.runMutation(
        internal.passwordChangeHelpers.updateAuthAccountSecret,
        { accountId: account._id, newSecret: newHash }
      );
      results.push({ email: user.email, status: "updated" });
    }

    return { results };
  },
});
