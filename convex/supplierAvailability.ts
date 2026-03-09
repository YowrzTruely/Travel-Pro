import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByMonth = query({
  args: {
    supplierId: v.id("suppliers"),
    yearMonth: v.string(),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("supplierAvailability")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .filter((q) => q.gte(q.field("date"), args.yearMonth))
      .collect();
    const filtered = docs.filter((doc) => doc.date.startsWith(args.yearMonth));
    return filtered.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const setAvailability = mutation({
  args: {
    supplierId: v.id("suppliers"),
    date: v.string(),
    available: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("supplierAvailability")
      .withIndex("by_supplierId_date", (q) =>
        q.eq("supplierId", args.supplierId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        available: args.available,
        notes: args.notes,
      });
      const doc = await ctx.db.get(existing._id);
      if (!doc) {
        throw new Error("Failed to read updated document");
      }
      return { ...doc, id: doc._id };
    }

    const id = await ctx.db.insert("supplierAvailability", args);
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});
