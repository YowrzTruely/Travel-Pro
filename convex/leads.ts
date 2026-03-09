import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    return leads.map((lead) => ({
      ...lead,
      id: lead._id,
    }));
  },
});

export const listByStatus = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").withIndex("by_status").collect();
    return leads.map((lead) => ({
      ...lead,
      id: lead._id,
    }));
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    }
    return counts;
  },
});

export const convertToProject = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) {
      throw new Error("Lead not found");
    }

    // Create a client
    const clientId = await ctx.db.insert("clients", {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      status: "active",
      notes: lead.notes || "",
      totalProjects: 1,
      totalRevenue: 0,
      leadId: args.id,
      source: lead.source,
    });

    // Create a project with legacyId format
    const year = new Date().getFullYear().toString().slice(2);
    const seq = Math.floor(1000 + Math.random() * 9000);
    const legacyId = `${seq}-${year}`;

    const projectId = await ctx.db.insert("projects", {
      legacyId,
      name: lead.eventType || lead.name,
      client: lead.name,
      company: lead.name,
      participants: lead.participants ?? 0,
      region: lead.region || "",
      status: "ליד חדש",
      statusColor: "#3b82f6",
      totalPrice: lead.budget ?? 0,
      pricePerPerson: 0,
      profitMargin: 0,
      date: lead.dateRequested || new Date().toISOString().split("T")[0],
      leadId: args.id,
    });

    // Update lead with references and status
    await ctx.db.patch(args.id, {
      clientId,
      projectId,
      status: "closed_won",
    });

    const updatedLead = await ctx.db.get(args.id);
    return {
      ...updatedLead,
      id: args.id,
    };
  },
});

export const get = query({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) {
      return null;
    }
    return {
      ...lead,
      id: lead._id,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    source: v.union(
      v.literal("facebook"),
      v.literal("instagram"),
      v.literal("tiktok"),
      v.literal("youtube"),
      v.literal("linkedin"),
      v.literal("whatsapp"),
      v.literal("phone"),
      v.literal("manual"),
      v.literal("website")
    ),
    participants: v.optional(v.number()),
    dateRequested: v.optional(v.string()),
    budget: v.optional(v.number()),
    eventType: v.optional(v.string()),
    region: v.optional(v.string()),
    preferences: v.optional(v.string()),
    notes: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
    const lead = await ctx.db.get(leadId);
    return {
      ...lead,
      id: leadId,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("leads"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    participants: v.optional(v.number()),
    dateRequested: v.optional(v.string()),
    budget: v.optional(v.number()),
    eventType: v.optional(v.string()),
    region: v.optional(v.string()),
    preferences: v.optional(v.string()),
    notes: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    const lead = await ctx.db.get(id);
    return {
      ...lead,
      id,
    };
  },
});

export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.union(
      v.literal("new"),
      v.literal("first_contact"),
      v.literal("needs_assessment"),
      v.literal("building_plan"),
      v.literal("quote_sent"),
      v.literal("approved"),
      v.literal("closed_won"),
      v.literal("closed_lost")
    ),
    lossReason: v.optional(
      v.union(
        v.literal("expensive"),
        v.literal("competitor"),
        v.literal("disappeared"),
        v.literal("other")
      )
    ),
    lossReasonNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, lossReason, lossReasonNotes } = args;
    const patch: Record<string, unknown> = { status };
    if (lossReason !== undefined) {
      patch.lossReason = lossReason;
    }
    if (lossReasonNotes !== undefined) {
      patch.lossReasonNotes = lossReasonNotes;
    }
    await ctx.db.patch(id, patch);
    const lead = await ctx.db.get(id);
    return {
      ...lead,
      id,
    };
  },
});
