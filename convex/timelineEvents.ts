import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByProjectId = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const events = await ctx.db
      .query("timelineEvents")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
    // Sort by time
    events.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    return events.map((e) => ({ ...e, id: e._id }));
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    time: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("timelineEvents", {
      projectId: args.projectId,
      time: args.time,
      title: args.title,
      description: args.description || "",
      icon: args.icon || "📌",
    });
    const event = await ctx.db.get(id);
    return { ...event!, id: event!._id };
  },
});

export const remove = mutation({
  args: { id: v.id("timelineEvents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
