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
    websiteUrl: v.optional(v.string()),
    facebookUrl: v.optional(v.string()),
    operatingHours: v.optional(v.string()),
    seasonalAvailability: v.optional(v.string()),
    defaultMarginPercent: v.optional(v.number()),
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

function normalizePhone(phone: string): string {
  return phone
    .replace(/[-\s]/g, "")
    .replace(/^\+972/, "0")
    .replace(/^972/, "0");
}

export const findAlternatives = query({
  args: {
    category: v.string(),
    region: v.optional(v.string()),
    date: v.optional(v.string()),
    excludeId: v.optional(v.id("suppliers")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    const categories = args.category.split(",").map((c) => c.trim());

    const allSuppliers = await ctx.db.query("suppliers").collect();
    const promotions = await ctx.db
      .query("supplierPromotions")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
    const promoSupplierIds = new Set(
      promotions.map((p) => String(p.supplierId))
    );

    let candidates = allSuppliers.filter((s) => {
      if (args.excludeId && s._id === args.excludeId) {
        return false;
      }
      if (s.category === "ארכיון") {
        return false;
      }
      const sCats = s.category.split(",").map((c) => c.trim());
      return sCats.some((c) => categories.includes(c));
    });

    if (args.region) {
      const regionFiltered = candidates.filter((s) => s.region === args.region);
      if (regionFiltered.length > 0) {
        candidates = regionFiltered;
      }
    }

    // Check availability conflicts if date provided
    let unavailableIds = new Set<string>();
    if (args.date) {
      const availEntries = await ctx.db.query("supplierAvailability").collect();
      unavailableIds = new Set(
        availEntries
          .filter((a) => a.date === args.date && !a.available)
          .map((a) => String(a.supplierId))
      );
    }

    const scored = candidates.map((s) => {
      let score = (s.rating || 0) * 10;
      if (s.verificationStatus === "verified") {
        score += 15;
      }
      if (promoSupplierIds.has(String(s._id))) {
        score += 10;
      }
      if (unavailableIds.has(String(s._id))) {
        score -= 50;
      }
      return { supplier: s, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(({ supplier }) => ({
      ...supplier,
      id: supplier._id,
    }));
  },
});

export const recommend = query({
  args: {
    category: v.optional(v.string()),
    region: v.optional(v.string()),
    date: v.optional(v.string()),
    excludeIds: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const excludeSet = new Set(args.excludeIds ?? []);

    const allSuppliers = await ctx.db.query("suppliers").collect();
    const promotions = await ctx.db
      .query("supplierPromotions")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
    const promoSupplierIds = new Set(
      promotions.map((p) => String(p.supplierId))
    );

    const now = Date.now();
    const allDocs = await ctx.db.query("supplierDocuments").collect();
    const suppliersWithValidDocs = new Set<string>();
    for (const doc of allDocs) {
      if (doc.expiry && new Date(doc.expiry).getTime() > now) {
        suppliersWithValidDocs.add(String(doc.supplierId));
      }
    }

    const candidates = allSuppliers.filter((s) => {
      if (excludeSet.has(String(s._id))) {
        return false;
      }
      if (s.category === "ארכיון") {
        return false;
      }
      if ((s.rating || 0) < 4.0) {
        return false;
      }
      if (args.category) {
        const sCats = s.category.split(",").map((c) => c.trim());
        const filterCats = args.category.split(",").map((c) => c.trim());
        if (!sCats.some((c) => filterCats.includes(c))) {
          return false;
        }
      }
      if (args.region && s.region !== args.region) {
        return false;
      }
      return true;
    });

    const results = candidates.slice(0, limit).map((s) => {
      const reasons: string[] = [];
      if ((s.rating || 0) >= 4.5) {
        reasons.push("דירוג גבוה");
      } else if ((s.rating || 0) >= 4.0) {
        reasons.push("דירוג טוב");
      }
      if (promoSupplierIds.has(String(s._id))) {
        reasons.push("מבצע פעיל");
      }
      if (suppliersWithValidDocs.has(String(s._id))) {
        reasons.push("מסמכים תקינים");
      }
      if (s.verificationStatus === "verified") {
        reasons.push("מאומת");
      }

      return {
        ...s,
        id: s._id,
        reason: reasons[0] || "מומלץ",
      };
    });

    return results;
  },
});

export const findDuplicates = query({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allSuppliers = await ctx.db.query("suppliers").collect();
    const nameLower = args.name.toLowerCase().trim();
    const normalizedPhone = args.phone ? normalizePhone(args.phone) : null;
    const emailLower = args.email?.toLowerCase().trim() || null;

    const matches = allSuppliers
      .map((s) => {
        let score = 0;
        const sNameLower = s.name.toLowerCase().trim();

        if (sNameLower === nameLower) {
          score += 100;
        } else if (
          sNameLower.includes(nameLower) ||
          nameLower.includes(sNameLower)
        ) {
          score += 60;
        }

        if (normalizedPhone && s.phone) {
          const sPhone = normalizePhone(s.phone);
          if (sPhone === normalizedPhone && sPhone.length > 3) {
            score += 100;
          }
        }

        if (
          emailLower &&
          s.email &&
          s.email.toLowerCase().trim() === emailLower
        ) {
          score += 100;
        }

        return { ...s, id: s._id, score };
      })
      .filter((m) => m.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return matches;
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
