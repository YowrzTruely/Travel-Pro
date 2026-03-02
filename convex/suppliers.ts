import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const CATEGORY_COLORS: Record<string, string> = {
  תחבורה: "#3b82f6",
  מזון: "#22c55e",
  אטרקציות: "#a855f7",
  לינה: "#ec4899",
  בידור: "#f59e0b",
};
const CATEGORY_ICONS: Record<string, string> = {
  תחבורה: "🚌",
  מזון: "🍽️",
  אטרקציות: "🏃",
  לינה: "🏨",
  בידור: "🎭",
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const suppliers = await ctx.db.query("suppliers").collect();
    return suppliers.map((s) => ({ ...s, id: s._id }));
  },
});

export const get = query({
  args: { id: v.id("suppliers") },
  handler: async (ctx, { id }) => {
    const supplier = await ctx.db.get(id);
    if (!supplier) {
      return null;
    }
    return { ...supplier, id: supplier._id };
  },
});

export const getByLegacyId = query({
  args: { legacyId: v.string() },
  handler: async (ctx, { legacyId }) => {
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", legacyId))
      .first();
    if (!supplier) {
      return null;
    }
    return { ...supplier, id: supplier._id };
  },
});

export const summaries = query({
  args: {},
  handler: async (ctx) => {
    const suppliers = await ctx.db.query("suppliers").collect();
    const allDocs = await ctx.db.query("supplierDocuments").collect();
    const allContacts = await ctx.db.query("supplierContacts").collect();
    const allProducts = await ctx.db.query("supplierProducts").collect();

    const REQUIRED_DOCS = ["רישיון עסק", "תעודת כשרות", "ביטוח צד ג'"];
    const now = new Date();

    const summaries: Record<string, any> = {};

    for (const supplier of suppliers) {
      const sid = supplier._id;
      const docs = allDocs.filter((d) => d.supplierId === sid);
      const contacts = allContacts.filter((c) => c.supplierId === sid);
      const products = allProducts.filter((p) => p.supplierId === sid);

      let docsExpired = 0;
      let docsWarning = 0;
      let insuranceExpired = false;
      const docNames = new Set(docs.map((d) => d.name));
      const docsMissing = REQUIRED_DOCS.filter((name) => !docNames.has(name));

      for (const doc of docs) {
        if (!doc.expiry) {
          docsExpired++;
          continue;
        }
        const exp = new Date(doc.expiry);
        if (exp < now) {
          docsExpired++;
          if (doc.name === "ביטוח צד ג'") {
            insuranceExpired = true;
          }
        } else {
          const diff = exp.getTime() - now.getTime();
          if (diff / (1000 * 60 * 60 * 24) < 60) {
            docsWarning++;
          }
        }
      }

      summaries[sid] = {
        docsExpired,
        docsWarning,
        docsMissing: docsMissing.length,
        docsMissingNames: docsMissing,
        insuranceExpired,
        contactsCount: contacts.length,
        productsCount: products.length,
      };
    }

    return summaries;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryColor: v.optional(v.string()),
    region: v.optional(v.string()),
    rating: v.optional(v.number()),
    verificationStatus: v.optional(
      v.union(
        v.literal("verified"),
        v.literal("pending"),
        v.literal("unverified")
      )
    ),
    notes: v.optional(v.string()),
    icon: v.optional(v.string()),
    address: v.optional(v.string()),
    location: v.optional(v.object({ lat: v.number(), lng: v.number() })),
  },
  handler: async (ctx, args) => {
    const category = args.category || "";
    const id = await ctx.db.insert("suppliers", {
      name: args.name,
      phone: args.phone || "",
      email: args.email,
      category,
      categoryColor:
        args.categoryColor || CATEGORY_COLORS[category] || "#8d785e",
      region: args.region || "",
      rating: args.rating ?? 0,
      verificationStatus: args.verificationStatus || "unverified",
      notes: args.notes || "-",
      icon: args.icon || CATEGORY_ICONS[category] || "📦",
      address: args.address,
      location: args.location,
    });
    const supplier = await ctx.db.get(id);
    if (!supplier) {
      throw new Error("Supplier not found after creation");
    }
    return { ...supplier, id: supplier._id };
  },
});

export const update = mutation({
  args: {
    id: v.id("suppliers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryColor: v.optional(v.string()),
    region: v.optional(v.string()),
    rating: v.optional(v.number()),
    verificationStatus: v.optional(
      v.union(
        v.literal("verified"),
        v.literal("pending"),
        v.literal("unverified")
      )
    ),
    notes: v.optional(v.string()),
    icon: v.optional(v.string()),
    address: v.optional(v.string()),
    location: v.optional(v.object({ lat: v.number(), lng: v.number() })),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Supplier not found");
    }

    // Auto-set category color/icon if category changed
    const patch: any = { ...updates };
    if (updates.category && updates.category !== existing.category) {
      if (!updates.categoryColor) {
        patch.categoryColor =
          CATEGORY_COLORS[updates.category] || existing.categoryColor;
      }
      if (!updates.icon) {
        patch.icon = CATEGORY_ICONS[updates.category] || existing.icon;
      }
    }

    await ctx.db.patch(id, patch);
    const supplier = await ctx.db.get(id);
    if (!supplier) {
      throw new Error("Supplier not found after update");
    }
    return { ...supplier, id: supplier._id };
  },
});

export const remove = mutation({
  args: { id: v.id("suppliers") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});

export const archive = mutation({
  args: { id: v.id("suppliers") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { category: "ארכיון", categoryColor: "#94a3b8" });
    const supplier = await ctx.db.get(id);
    if (!supplier) {
      throw new Error("Supplier not found after archive");
    }
    return { ...supplier, id: supplier._id };
  },
});

export const bulkImport = mutation({
  args: {
    suppliers: v.array(
      v.object({
        name: v.string(),
        phone: v.optional(v.string()),
        email: v.optional(v.string()),
        category: v.optional(v.string()),
        region: v.optional(v.string()),
        notes: v.optional(v.string()),
        _action: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { suppliers }) => {
    const imported: any[] = [];
    const skipped: string[] = [];

    for (const s of suppliers) {
      const name = s.name.trim();
      if (!name) {
        skipped.push("(ללא שם)");
        continue;
      }
      if (s._action === "skip") {
        skipped.push(name);
        continue;
      }

      const category = (s.category || "").trim();
      const id = await ctx.db.insert("suppliers", {
        name,
        phone: (s.phone || "").trim(),
        email: (s.email || "").trim(),
        category,
        categoryColor: CATEGORY_COLORS[category] || "#8d785e",
        region: (s.region || "").trim(),
        rating: 0,
        verificationStatus: "unverified",
        notes: (s.notes || "").trim() || "-",
        icon: CATEGORY_ICONS[category] || "📦",
      });
      const supplier = await ctx.db.get(id);
      if (!supplier) {
        throw new Error(`Supplier not found after import: ${id}`);
      }
      imported.push({ ...supplier, id: supplier._id });
    }

    return {
      imported: imported.length,
      skipped: skipped.length,
      suppliers: imported,
    };
  },
});

export const bulkRollback = mutation({
  args: { supplierIds: v.array(v.id("suppliers")) },
  handler: async (ctx, { supplierIds }) => {
    let deleted = 0;
    let notFound = 0;

    for (const id of supplierIds) {
      const existing = await ctx.db.get(id);
      if (!existing) {
        notFound++;
        continue;
      }

      // Cascade delete contacts, products, documents
      const contacts = await ctx.db
        .query("supplierContacts")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", id))
        .collect();
      const products = await ctx.db
        .query("supplierProducts")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", id))
        .collect();
      const docs = await ctx.db
        .query("supplierDocuments")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", id))
        .collect();

      for (const c of contacts) {
        await ctx.db.delete(c._id);
      }
      for (const p of products) {
        await ctx.db.delete(p._id);
      }
      for (const d of docs) {
        await ctx.db.delete(d._id);
      }

      await ctx.db.delete(id);
      deleted++;
    }

    return { deleted, notFound };
  },
});
