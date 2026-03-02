import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("kanbanTasks").collect();
    return tasks.map((t) => ({ ...t, id: t._id }));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
    feature: v.optional(v.string()),
    estimate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    version: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.string(),
          dataUrl: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("kanbanTasks", {
      title: args.title,
      description: args.description || "",
      type: args.type || "TASK",
      priority: args.priority || "MEDIUM",
      status: args.status || "todo",
      feature: args.feature || "",
      estimate: args.estimate || "",
      tags: args.tags || [],
      createdAt: new Date().toISOString().split("T")[0],
      version: args.version || "V1",
      attachments: args.attachments,
    });
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error("Kanban task not found after creation");
    }
    return { ...task, id: task._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("kanbanTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
    feature: v.optional(v.string()),
    estimate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    version: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.string(),
          dataUrl: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Kanban task not found");
    }
    await ctx.db.patch(id, updates);
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error("Kanban task not found after update");
    }
    return { ...task, id: task._id };
  },
});

export const remove = mutation({
  args: { id: v.id("kanbanTasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});

export const seed = mutation({
  args: {
    tasks: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        type: v.optional(v.string()),
        priority: v.optional(v.string()),
        status: v.optional(v.string()),
        feature: v.optional(v.string()),
        estimate: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        version: v.optional(v.string()),
        createdAt: v.optional(v.string()),
      })
    ),
    version: v.string(),
  },
  handler: async (ctx, { tasks, version }) => {
    // Check if already seeded
    const meta = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", `kanban_seeded_${version}`))
      .first();
    if (meta) {
      return { skipped: true };
    }

    for (const t of tasks) {
      await ctx.db.insert("kanbanTasks", {
        title: t.title,
        description: t.description || "",
        type: t.type || "TASK",
        priority: t.priority || "MEDIUM",
        status: t.status || "todo",
        feature: t.feature || "",
        estimate: t.estimate || "",
        tags: t.tags || [],
        createdAt: t.createdAt || new Date().toISOString().split("T")[0],
        version: t.version || "V1",
      });
    }

    await ctx.db.insert("metadata", {
      key: `kanban_seeded_${version}`,
      value: { seededAt: new Date().toISOString(), count: tasks.length },
    });

    return { skipped: false, count: tasks.length };
  },
});

export const bulkUpdate = mutation({
  args: {
    tasks: v.array(
      v.object({
        id: v.id("kanbanTasks"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        type: v.optional(v.string()),
        priority: v.optional(v.string()),
        status: v.optional(v.string()),
        feature: v.optional(v.string()),
        estimate: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        version: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { tasks }) => {
    for (const { id, ...updates } of tasks) {
      const existing = await ctx.db.get(id);
      if (existing) {
        await ctx.db.patch(id, updates);
      }
    }
    return { updated: tasks.length };
  },
});
