import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("supplierDocuments").collect();
    return docs.map((d) => ({ ...d, id: d._id }));
  },
});

export const listBySupplierId = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const docs = await ctx.db
      .query("supplierDocuments")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
      .collect();
    return docs.map((d) => ({ ...d, id: d._id }));
  },
});

export const create = mutation({
  args: {
    supplierId: v.id("suppliers"),
    name: v.string(),
    expiry: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("valid"), v.literal("warning"), v.literal("expired"))
    ),
    fileName: v.optional(v.string()),
    documentType: v.optional(v.string()),
    storageId: v.optional(v.string()),
    acknowledged: v.optional(v.boolean()),
    acknowledgedAt: v.optional(v.number()),
    lastReminderAt: v.optional(v.number()),
    reminderCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplierDocuments", {
      supplierId: args.supplierId,
      name: args.name,
      expiry: args.expiry || "",
      status: args.status || "valid",
      fileName: args.fileName,
      documentType: args.documentType,
      storageId: args.storageId,
      acknowledged: args.acknowledged,
      acknowledgedAt: args.acknowledgedAt,
      lastReminderAt: args.lastReminderAt,
      reminderCount: args.reminderCount,
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Supplier document not found after creation");
    }
    return { ...doc, id: doc._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("supplierDocuments"),
    name: v.optional(v.string()),
    expiry: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("valid"), v.literal("warning"), v.literal("expired"))
    ),
    fileName: v.optional(v.string()),
    documentType: v.optional(v.string()),
    storageId: v.optional(v.string()),
    acknowledged: v.optional(v.boolean()),
    acknowledgedAt: v.optional(v.number()),
    lastReminderAt: v.optional(v.number()),
    reminderCount: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Document not found");
    }
    await ctx.db.patch(id, updates);
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Supplier document not found after update");
    }
    return { ...doc, id: doc._id };
  },
});

export const remove = mutation({
  args: { id: v.id("supplierDocuments") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});

// ─── Check expiry status of all documents ───
export const checkExpiry = internalMutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("supplierDocuments").collect();
    const now = new Date();

    for (const doc of docs) {
      if (!doc.expiry) {
        continue;
      }

      const expiryDate = new Date(doc.expiry);
      if (Number.isNaN(expiryDate.getTime())) {
        continue;
      }

      const diffMs = expiryDate.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      let newStatus: "valid" | "warning" | "expired";
      if (diffDays < 0) {
        newStatus = "expired";
      } else if (diffDays <= 30) {
        newStatus = "warning";
      } else {
        newStatus = "valid";
      }

      if (doc.status !== newStatus) {
        await ctx.db.patch(doc._id, { status: newStatus });
      }
    }
  },
});

// ─── Send reminders for acknowledged-missing documents ───
export const sendReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("supplierDocuments").collect();
    const now = Date.now();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

    for (const doc of docs) {
      // Only remind for acknowledged-missing docs (no actual file uploaded)
      if (!doc.acknowledged || doc.storageId) {
        continue;
      }

      const lastReminder = doc.lastReminderAt ?? 0;
      if (now - lastReminder < twoDaysMs) {
        continue;
      }

      // Stub: In the future, send actual notification here
      await ctx.db.patch(doc._id, {
        lastReminderAt: now,
        reminderCount: (doc.reminderCount ?? 0) + 1,
      });
    }
  },
});

// ─── Check insurance compliance for a supplier ───
export const checkInsuranceCompliance = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const docs = await ctx.db
      .query("supplierDocuments")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
      .collect();

    const now = new Date();

    const hasValidDoc = (docType: string) =>
      docs.some((d) => {
        if (d.documentType !== docType) {
          return false;
        }
        if (!d.storageId) {
          return false;
        }
        if (!d.expiry) {
          return true;
        }
        const expiryDate = new Date(d.expiry);
        return expiryDate.getTime() > now.getTime();
      });

    const hasThirdParty = hasValidDoc("third_party_insurance");
    const hasEmployer = hasValidDoc("employer_insurance");

    return {
      hasThirdParty,
      hasEmployer,
      compliant: hasThirdParty && hasEmployer,
    };
  },
});

// ─── Mark a document type as acknowledged-missing ───
export const markAcknowledgedMissing = mutation({
  args: {
    supplierId: v.id("suppliers"),
    documentType: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { supplierId, documentType, name }) => {
    // Check if there's an existing record for this doc type
    const existing = await ctx.db
      .query("supplierDocuments")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
      .collect();

    const match = existing.find((d) => d.documentType === documentType);

    if (match) {
      await ctx.db.patch(match._id, {
        acknowledged: true,
        acknowledgedAt: Date.now(),
        status: "expired" as const,
      });
      return { ...match, id: match._id };
    }

    const id = await ctx.db.insert("supplierDocuments", {
      supplierId,
      name,
      documentType,
      status: "expired",
      acknowledged: true,
      acknowledgedAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Document not found after creation");
    }
    return { ...doc, id: doc._id };
  },
});
