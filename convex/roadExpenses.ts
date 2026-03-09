import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByOperation = query({
  args: { fieldOperationId: v.id("fieldOperations") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("roadExpenses")
      .withIndex("by_fieldOperationId", (q) =>
        q.eq("fieldOperationId", args.fieldOperationId)
      )
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    fieldOperationId: v.id("fieldOperations"),
    projectId: v.id("projects"),
    description: v.string(),
    amount: v.number(),
    receiptFileId: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("roadExpenses", {
      ...args,
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    return { ...doc, id: doc?._id };
  },
});
