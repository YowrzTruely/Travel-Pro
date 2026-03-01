import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("calendarEvents").collect();
    return events.map((e) => ({ ...e, id: e._id }));
  },
});

export const get = query({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, { id }) => {
    const event = await ctx.db.get(id);
    if (!event) return null;
    return { ...event, id: event._id };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    type: v.optional(v.string()),
    color: v.optional(v.string()),
    projectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("calendarEvents", {
      title: args.title,
      description: args.description || "",
      date: args.date,
      startTime: args.startTime || "09:00",
      endTime: args.endTime || "10:00",
      type: args.type || "meeting",
      color: args.color || "#3b82f6",
      projectId: args.projectId,
    });
    const event = await ctx.db.get(id);
    return { ...event!, id: event!._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    type: v.optional(v.string()),
    color: v.optional(v.string()),
    projectId: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Calendar event not found");
    await ctx.db.patch(id, updates);
    const event = await ctx.db.get(id);
    return { ...event!, id: event!._id };
  },
});

export const remove = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});
