import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/** Try to find a project by legacyId, then by _id. */
async function findProject(ctx: any, id: string) {
  let project = await ctx.db
    .query("projects")
    .withIndex("by_legacyId", (q: any) => q.eq("legacyId", id))
    .first();
  if (!project) {
    const normalizedId = ctx.db.normalizeId("projects", id);
    if (normalizedId) {
      project = await ctx.db.get(normalizedId as Id<"projects">);
    }
  }
  return project;
}

const STATUS_COLORS: Record<string, string> = {
  "ליד חדש": "#3b82f6",
  "בניית הצעה": "#f97316",
  "הצעה נשלחה": "#8b5cf6",
  אושר: "#22c55e",
  "מחיר בהערכה": "#eab308",
  בביצוע: "#ff8c00",
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
    const project = await findProject(ctx, id);
    if (!project) {
      return null;
    }
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
    if (!project) {
      return null;
    }
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
    if (!project) {
      throw new Error("Project not found after creation");
    }
    return { ...project, id: project.legacyId || project._id };
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
    quoteVersion: v.optional(v.number()),
    timelineHidden: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const project = await findProject(ctx, id);
    if (!project) {
      throw new Error("Project not found");
    }

    const patch: any = { ...updates };
    if (
      updates.status &&
      updates.status !== project.status &&
      !updates.statusColor
    ) {
      patch.statusColor = STATUS_COLORS[updates.status] || project.statusColor;
    }

    const projectId = project._id as Id<"projects">;
    await ctx.db.patch(projectId, patch);
    const updated = await ctx.db.get(projectId);
    if (!updated) {
      throw new Error("Project not found after update");
    }
    return { ...updated, id: updated.legacyId || updated._id };
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const project = await findProject(ctx, id);
    if (!project) {
      throw new Error("Project not found");
    }
    await ctx.db.delete(project._id);
    return { success: true, id };
  },
});
