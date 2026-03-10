"use node";

import { v } from "convex/values";
import { Scrypt } from "lucia";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

export const changePassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Get current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, error: "לא מחובר" };
    }

    const email = identity.email;
    if (!email) {
      return { success: false, error: "לא נמצא אימייל" };
    }

    // Validate new password
    if (!args.newPassword || args.newPassword.length < 8) {
      return {
        success: false,
        error: "הסיסמה החדשה חייבת להכיל לפחות 8 תווים",
      };
    }

    try {
      // Get auth account to verify current password
      const account = await ctx.runQuery(
        internal.passwordChangeHelpers.getAuthAccount,
        { email, provider: "password" }
      );

      if (!account) {
        return { success: false, error: "חשבון לא נמצא" };
      }

      // Verify current password using Scrypt (same as @convex-dev/auth)
      const scrypt = new Scrypt();
      const isValid = await scrypt.verify(
        account.secret ?? "",
        args.currentPassword
      );

      if (!isValid) {
        return { success: false, error: "הסיסמה הנוכחית שגויה" };
      }

      // Hash new password
      const newHash = await scrypt.hash(args.newPassword);

      // Update the password hash
      await ctx.runMutation(
        internal.passwordChangeHelpers.updateAuthAccountSecret,
        { accountId: account._id, newSecret: newHash }
      );

      return { success: true };
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, error: "שגיאה בשינוי הסיסמה" };
    }
  },
});
