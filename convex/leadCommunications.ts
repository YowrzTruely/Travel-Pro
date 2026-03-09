import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByLeadId = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const communications = await ctx.db
      .query("leadCommunications")
      .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
      .collect();
    return communications.map((comm) => ({
      ...comm,
      id: comm._id,
    }));
  },
});

export const create = mutation({
  args: {
    leadId: v.id("leads"),
    type: v.union(
      v.literal("call"),
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("sms"),
      v.literal("note"),
      v.literal("system")
    ),
    content: v.string(),
    duration: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const commId = await ctx.db.insert("leadCommunications", {
      ...args,
      createdAt: Date.now(),
    });
    const comm = await ctx.db.get(commId);
    return {
      ...comm,
      id: commId,
    };
  },
});
