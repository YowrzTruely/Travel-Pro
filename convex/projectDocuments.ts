import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("projectDocuments").collect();
    return docs.map((d) => ({ ...d, id: d._id }));
  },
});

export const listByProjectId = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const docs = await ctx.db
      .query("projectDocuments")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
    return docs.map((d) => ({ ...d, id: d._id }));
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    type: v.optional(v.string()),
    expiry: v.optional(v.string()),
    status: v.optional(v.string()),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("projectDocuments", {
      projectId: args.projectId,
      name: args.name,
      type: args.type || "other",
      expiry: args.expiry,
      status: args.status || "active",
      fileName: args.fileName,
      createdAt: new Date().toISOString().split("T")[0],
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Project document not found after creation");
    }
    return { ...doc, id: doc._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("projectDocuments"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    expiry: v.optional(v.string()),
    status: v.optional(v.string()),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Project document not found");
    }
    await ctx.db.patch(id, updates);
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Project document not found after update");
    }
    return { ...doc, id: doc._id };
  },
});

export const remove = mutation({
  args: { id: v.id("projectDocuments") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
