import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Public query: look up an availability invite token (no auth required). */
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const invite = await ctx.db
      .query("availabilityInviteTokens")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!invite) {
      return null;
    }

    // Check expiry
    if (invite.expiresAt < Date.now()) {
      return { expired: true, registered: false };
    }

    if (invite.status === "registered") {
      return { expired: false, registered: true };
    }

    // Join context data
    const request = await ctx.db.get(invite.availabilityRequestId);
    const supplier = await ctx.db.get(invite.supplierId);
    const project = request ? await ctx.db.get(request.projectId) : null;
    const product = request?.productId
      ? await ctx.db.get(request.productId)
      : null;
    const createdByUser = await ctx.db.get(invite.createdBy);

    return {
      expired: false,
      registered: false,
      supplierPhone: invite.supplierPhone,
      supplierName: supplier?.name ?? "",
      projectName: project?.name ?? "",
      date: request?.date ?? "",
      participants: request?.participants ?? project?.participants ?? 0,
      producerName: createdByUser?.name ?? createdByUser?.company ?? "",
      productName: product?.name ?? "",
    };
  },
});

/** Public mutation: link a newly registered user to an existing supplier record. */
export const linkRegisteredUser = mutation({
  args: {
    token: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, { token, userId }) => {
    const invite = await ctx.db
      .query("availabilityInviteTokens")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!invite) {
      throw new Error("Invalid invite token");
    }

    if (invite.status === "registered") {
      throw new Error("Token already used");
    }

    if (invite.expiresAt < Date.now()) {
      throw new Error("Token expired");
    }

    // Link user to supplier
    const supplier = await ctx.db.get(invite.supplierId);
    if (supplier && !supplier.userId) {
      await ctx.db.patch(invite.supplierId, { userId });
    }

    // Update user with supplier link and registration source
    await ctx.db.patch(userId, {
      supplierId: invite.supplierId,
      registrationSource: "availability_invite" as const,
    });

    // Mark token as used
    await ctx.db.patch(invite._id, {
      status: "registered" as const,
      registeredUserId: userId,
    });

    return { success: true, supplierId: invite.supplierId };
  },
});
