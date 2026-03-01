import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const STATUS_COLORS: Record<string, string> = {
  "ליד חדש": "#3b82f6",
  "בניית הצעה": "#f97316",
  "הצעה נשלחה": "#8b5cf6",
  "אושר": "#22c55e",
  "מחיר בהערכה": "#eab308",
  "בביצוע": "#ff8c00",
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.map((p) => ({
      ...p,
      id: p.legacyId || p._id,
    }));
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    // Try legacy ID first
    let project = await ctx.db
      .query("projects")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", id))
      .first();
    // Try Convex _id
    if (!project) {
      try {
        project = await ctx.db.get(id as any);
      } catch {
        // invalid id format
      }
    }
    if (!project) return null;
    return { ...project, id: project.legacyId || project._id };
  },
});

export const getByLegacyId = query({
  args: { legacyId: v.string() },
  handler: async (ctx, { legacyId }) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", legacyId))
      .first();
    if (!project) return null;
    return { ...project, id: project.legacyId || project._id };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    client: v.optional(v.string()),
    company: v.optional(v.string()),
    participants: v.optional(v.number()),
    region: v.optional(v.string()),
    status: v.optional(v.string()),
    statusColor: v.optional(v.string()),
    totalPrice: v.optional(v.number()),
    pricePerPerson: v.optional(v.number()),
    profitMargin: v.optional(v.number()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const year = new Date().getFullYear().toString().slice(2);
    const seq = Math.floor(1000 + Math.random() * 9000);
    const legacyId = `${seq}-${year}`;
    const status = args.status || "ליד חדש";

    const id = await ctx.db.insert("projects", {
      legacyId,
      name: args.name,
      client: args.client || args.company || "",
      company: args.company || args.client || "",
      participants: args.participants ?? 0,
      region: args.region || "",
      status,
      statusColor: args.statusColor || STATUS_COLORS[status] || "#3b82f6",
      totalPrice: args.totalPrice ?? 0,
      pricePerPerson: args.pricePerPerson ?? 0,
      profitMargin: args.profitMargin ?? 0,
      date: args.date || new Date().toISOString().split("T")[0],
    });
    const project = await ctx.db.get(id);
    return { ...project!, id: project!.legacyId || project!._id };
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    client: v.optional(v.string()),
    company: v.optional(v.string()),
    participants: v.optional(v.number()),
    region: v.optional(v.string()),
    status: v.optional(v.string()),
    statusColor: v.optional(v.string()),
    totalPrice: v.optional(v.number()),
    pricePerPerson: v.optional(v.number()),
    profitMargin: v.optional(v.number()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    // Find by legacy ID or _id
    let project = await ctx.db
      .query("projects")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", id))
      .first();
    if (!project) {
      try {
        project = await ctx.db.get(id as any);
      } catch {
        throw new Error("Project not found");
      }
    }
    if (!project) throw new Error("Project not found");

    const patch: any = { ...updates };
    if (updates.status && updates.status !== project.status && !updates.statusColor) {
      patch.statusColor = STATUS_COLORS[updates.status] || project.statusColor;
    }

    await ctx.db.patch(project._id, patch);
    const updated = await ctx.db.get(project._id);
    return { ...updated!, id: updated!.legacyId || updated!._id };
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    let project = await ctx.db
      .query("projects")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", id))
      .first();
    if (!project) {
      try {
        project = await ctx.db.get(id as any);
      } catch {
        throw new Error("Project not found");
      }
    }
    if (!project) throw new Error("Project not found");
    await ctx.db.delete(project._id);
    return { success: true, id };
  },
});
