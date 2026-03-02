import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listBySupplierId = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const contacts = await ctx.db
      .query("supplierContacts")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
      .collect();
    return contacts.map((c) => ({ ...c, id: c._id }));
  },
});

export const create = mutation({
  args: {
    supplierId: v.id("suppliers"),
    name: v.string(),
    role: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    primary: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierContacts", {
      supplierId: args.supplierId,
      name: args.name,
      role: args.role || "",
      phone: args.phone || "",
      email: args.email || "",
      primary: args.primary ?? false,
    });
    const contact = await ctx.db.get(id);
    if (!contact) {
      throw new Error("Supplier contact not found after creation");
    }
    return { ...contact, id: contact._id };
  },
});

export const remove = mutation({
  args: { id: v.id("supplierContacts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
