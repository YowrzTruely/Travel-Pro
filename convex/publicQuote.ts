import { v } from "convex/values";
import { internal } from "./_generated/api";
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

export const getQuote = query({
  args: { id: v.string(), mode: v.optional(v.string()) },
  handler: async (ctx, { id, mode }) => {
    const project = await findProject(ctx, id);
    if (!project) {
      return null;
    }

    const allItems = await ctx.db
      .query("quoteItems")
      .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
      .collect();

    const noPrices = mode === "noPrices";

    // Map items — strip supplier info for client view, include extended fields
    const items = allItems.map((qi) => ({
      quoteItemId: qi._id,
      type: qi.type,
      icon: qi.icon,
      name: qi.name,
      description: qi.description,
      ...(noPrices ? {} : { sellingPrice: qi.sellingPrice }),
      images: qi.images,
      alternativeItems: qi.alternativeItems
        ? qi.alternativeItems.map(
            (alt: {
              supplierId: Id<"suppliers">;
              productId?: Id<"supplierProducts">;
              name: string;
              price: number;
              description?: string;
              imageUrl?: string;
            }) => ({
              productId: alt.productId,
              name: alt.name,
              price: alt.price,
              description: alt.description,
              imageUrl: alt.imageUrl,
            })
          )
        : undefined,
      selectedAddons: qi.selectedAddons,
      equipmentRequirements: qi.equipmentRequirements,
      grossTime: qi.grossTime,
      netTime: qi.netTime,
      selectedByClient: qi.selectedByClient,
    }));

    const timeline = await ctx.db
      .query("timelineEvents")
      .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
      .collect();
    timeline.sort((a, b) => (a.time || "").localeCompare(b.time || ""));

    return {
      name: project.name,
      company: project.company || project.client,
      participants: project.participants,
      region: project.region,
      ...(noPrices
        ? {}
        : {
            totalPrice: project.totalPrice,
            pricePerPerson: project.pricePerPerson,
          }),
      quoteVersion: project.quoteVersion,
      timelineHidden: project.timelineHidden,
      date: project.date,
      status: project.status,
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
    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(project._id, {
      status: "אושר",
      statusColor: "#22c55e",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.supplierOrders.generateOrdersForProject,
      { projectId: project._id }
    );

    return { success: true };
  },
});

export const selectAlternative = mutation({
  args: {
    quoteItemId: v.id("quoteItems"),
    selectedAlternativeIndex: v.number(), // -1 = original
  },
  handler: async (ctx, { quoteItemId, selectedAlternativeIndex }) => {
    const item = await ctx.db.get(quoteItemId);
    if (!item) {
      throw new Error("Quote item not found");
    }
    await ctx.db.patch(quoteItemId, {
      selectedByClient: selectedAlternativeIndex === -1,
    });
    return { success: true };
  },
});

export const toggleUpsell = mutation({
  args: {
    projectId: v.id("projects"),
    quoteItemId: v.id("quoteItems"),
    addonId: v.id("productAddons"),
    name: v.string(),
    price: v.number(),
    selected: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("quoteUpsells")
      .withIndex("by_quoteItemId", (q) => q.eq("quoteItemId", args.quoteItemId))
      .collect();
    const match = existing.find((u) => u.addonId === args.addonId);
    if (match) {
      await ctx.db.patch(match._id, { selectedByClient: args.selected });
    } else {
      await ctx.db.insert("quoteUpsells", {
        projectId: args.projectId,
        quoteItemId: args.quoteItemId,
        addonId: args.addonId,
        name: args.name,
        price: args.price,
        selectedByClient: args.selected,
        createdAt: Date.now(),
      });
    }
    return { success: true };
  },
});

export const requestChanges = mutation({
  args: {
    projectId: v.id("projects"),
    items: v.array(
      v.object({
        quoteItemId: v.id("quoteItems"),
        reason: v.string(),
      })
    ),
    generalNotes: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("quoteChangeRequests", {
      projectId: args.projectId,
      items: args.items,
      generalNotes: args.generalNotes,
      clientName: args.clientName,
      clientPhone: args.clientPhone,
      status: "pending",
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

export const saveSignature = mutation({
  args: {
    projectId: v.string(),
    signatureStorageId: v.string(),
    signerName: v.string(),
    signerRole: v.optional(v.string()),
    signerCompany: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const project = await findProject(ctx, args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    await ctx.db.patch(project._id, {
      digitalSignatureId: args.signatureStorageId,
      status: "אושר",
      statusColor: "#22c55e",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.supplierOrders.generateOrdersForProject,
      { projectId: project._id }
    );

    return { success: true };
  },
});
