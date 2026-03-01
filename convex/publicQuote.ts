import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

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

export const getQuote = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const project = await findProject(ctx, id);
    if (!project) return null;

    const allItems = await ctx.db
      .query("quoteItems")
      .withIndex("by_projectId", (q) => q.eq("projectId", project!._id))
      .collect();

    // Only expose public fields (no cost data)
    const items = allItems.map((qi) => ({
      type: qi.type,
      icon: qi.icon,
      name: qi.name,
      supplier: qi.supplier,
      description: qi.description,
      sellingPrice: qi.sellingPrice,
    }));

    const timeline = await ctx.db
      .query("timelineEvents")
      .withIndex("by_projectId", (q) => q.eq("projectId", project!._id))
      .collect();
    timeline.sort((a, b) => (a.time || "").localeCompare(b.time || ""));

    return {
      name: project.name,
      company: project.company || project.client,
      participants: project.participants,
      region: project.region,
      totalPrice: project.totalPrice,
      pricePerPerson: project.pricePerPerson,
      items,
      timeline: timeline.map((t) => ({
        id: t._id,
        time: t.time,
        title: t.title,
        description: t.description,
        icon: t.icon,
      })),
    };
  },
});

export const approveQuote = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const project = await findProject(ctx, id);
    if (!project) throw new Error("Project not found");

    await ctx.db.patch(project._id, {
      status: "אושר",
      statusColor: "#22c55e",
    });

    return { success: true };
  },
});
