import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("invoiceTracking")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    orderId: v.optional(v.id("supplierOrders")),
    invoiceNumber: v.optional(v.string()),
    amount: v.optional(v.number()),
    fileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("invoiceTracking", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }
    return { ...doc, id: doc._id };
  },
});

export const markReceived = mutation({
  args: { id: v.id("invoiceTracking") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "received",
      receivedAt: Date.now(),
    });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const uploadInvoice = mutation({
  args: {
    id: v.id("invoiceTracking"),
    invoiceNumber: v.string(),
    amount: v.number(),
    fileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      invoiceNumber: args.invoiceNumber,
      amount: args.amount,
      fileId: args.fileId,
      status: "received",
      receivedAt: Date.now(),
    });
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const verify = mutation({
  args: { id: v.id("invoiceTracking") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "verified" });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    return { ...doc, id: doc._id };
  },
});

export const checkAllReceived = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const docs = await ctx.db
      .query("invoiceTracking")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
    const pending = docs.filter((d) => d.status === "pending").length;
    return { allReceived: pending === 0, pending, total: docs.length };
  },
});

export const sendNagReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    const blocked = projects.filter((p) => p.archiveBlocked);
    let reminders = 0;
    for (const project of blocked) {
      const invoices = await ctx.db
        .query("invoiceTracking")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .collect();
      const pending = invoices.filter((i) => i.status === "pending");
      if (pending.length > 0) {
        console.log(
          `[InvoiceTracking] Nag reminder: Project ${project.name} has ${pending.length} pending invoices`
        );
        reminders++;
      }
    }
    return { reminders };
  },
});
