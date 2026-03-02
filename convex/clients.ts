import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").collect();
    return clients.map((c) => ({ ...c, id: c._id }));
  },
});

export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const client = await ctx.db.get(id);
    if (!client) {
      return null;
    }
    return { ...client, id: client._id };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("active"), v.literal("lead"), v.literal("inactive"))
    ),
    notes: v.optional(v.string()),
    totalProjects: v.optional(v.number()),
    totalRevenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("clients", {
      name: args.name,
      company: args.company || "",
      phone: args.phone || "",
      email: args.email || "",
      status: args.status || "lead",
      notes: args.notes || "",
      totalProjects: args.totalProjects ?? 0,
      totalRevenue: args.totalRevenue ?? 0,
      createdAt: new Date().toISOString().split("T")[0],
    });
    const client = await ctx.db.get(id);
    if (!client) {
      throw new Error("Client not found after creation");
    }
    return { ...client, id: client._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("active"), v.literal("lead"), v.literal("inactive"))
    ),
    notes: v.optional(v.string()),
    totalProjects: v.optional(v.number()),
    totalRevenue: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Client not found");
    }
    await ctx.db.patch(id, updates);
    const client = await ctx.db.get(id);
    if (!client) {
      throw new Error("Client not found after update");
    }
    return { ...client, id: client._id };
  },
});

export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
