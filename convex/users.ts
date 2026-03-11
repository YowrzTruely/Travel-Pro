import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/** Map category value to Hebrew label for supplier display */
const CATEGORY_LABELS: Record<string, string> = {
  attractions: "אטרקציות ופעילויות",
  food: "מסעדות ואוכל",
  transport: "תחבורה",
  photography: "צילום ומגנטים",
  entertainment: "בידור ומוזיקה",
  workshops: "סדנאות יצירה ולמידה",
  accommodation: "לינה",
  other: "אחר",
};

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // The tokenIdentifier is "{issuer}|{userId}|{sessionId}".
    // Extract the userId (which is the _id in the users table).
    const parts = identity.tokenIdentifier.split("|");
    if (parts.length >= 2) {
      try {
        const userId = ctx.db.normalizeId("users", parts[1]);
        if (userId) {
          const user = await ctx.db.get(userId);
          if (user) {
            return { ...user, id: user._id };
          }
        }
      } catch {
        // normalizeId may throw if the string isn't a valid ID
      }
    }

    // Fallback: try by authId index
    const byAuthId = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.tokenIdentifier))
      .first();
    if (byAuthId) {
      return { ...byAuthId, id: byAuthId._id };
    }

    return null;
  },
});

export const getByAuthId = query({
  args: { authId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId))
      .unique();
    if (!user) {
      return null;
    }
    return { ...user, id: user._id };
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) {
      return null;
    }
    return { ...user, id: user._id };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({ ...user, id: user._id }));
  },
});

export const listByRole = query({
  args: {
    role: v.union(
      v.literal("admin"),
      v.literal("producer"),
      v.literal("supplier")
    ),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
    return users.map((user) => ({ ...user, id: user._id }));
  },
});

export const listPendingSuppliers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "supplier"))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
    return users.map((user) => ({ ...user, id: user._id }));
  },
});

const SUPPLIER_SEED_VALIDATOR = v.optional(
  v.object({
    businessName: v.string(),
    category: v.string(),
    firstProduct: v.string(),
    phone: v.optional(v.string()),
    region: v.string(),
  })
);

export const createProfile = mutation({
  args: {
    authId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("producer"),
      v.literal("supplier")
    ),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    registrationSource: v.optional(
      v.union(
        v.literal("manual"),
        v.literal("self_registration"),
        v.literal("availability_invite")
      )
    ),
    supplierSeed: SUPPLIER_SEED_VALIDATOR,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Extract userId from tokenIdentifier ("{issuer}|{userId}|{sessionId}")
    const parts = identity.tokenIdentifier.split("|");
    let existingUser: Doc<"users"> | null = null;
    if (parts.length >= 2) {
      try {
        const userId = ctx.db.normalizeId("users", parts[1]);
        if (userId) {
          existingUser = await ctx.db.get(userId);
        }
      } catch {
        // normalizeId may throw if the string isn't a valid ID
      }
    }

    // If we found the auth-created record and it already has a role, return it
    if (existingUser?.role) {
      return { ...existingUser, id: existingUser._id };
    }

    const seed = args.supplierSeed;
    const profileFields = {
      authId: identity.tokenIdentifier,
      email: args.email,
      name: args.name,
      role: args.role,
      phone: args.phone ?? seed?.phone,
      company: args.company ?? seed?.businessName,
      registrationSource: args.registrationSource,
      status:
        args.role === "supplier" ? ("pending" as const) : ("active" as const),
      onboardingCompleted: false,
      createdAt: Date.now(),
    };

    let userId: Id<"users">;

    if (existingUser) {
      await ctx.db.patch(existingUser._id, profileFields);
      const patched = await ctx.db.get(existingUser._id);
      if (!patched) {
        throw new Error("Failed to update user profile");
      }
      userId = patched._id;
    } else {
      userId = await ctx.db.insert("users", profileFields);
    }

    // Create supplier record and first product when role is supplier and seed provided
    if (
      args.role === "supplier" &&
      seed?.businessName &&
      seed?.category &&
      seed?.region
    ) {
      const categoryLabel = CATEGORY_LABELS[seed.category] || seed.category;
      const supplierId = await ctx.db.insert("suppliers", {
        name: seed.businessName,
        phone: seed.phone ?? "",
        email: args.email,
        category: categoryLabel,
        categoryColor: "#8d785e",
        region: seed.region,
        rating: 0,
        verificationStatus: "pending",
        notes: "-",
        icon: "📦",
        userId,
        registrationStatus: "pending",
        profileCompletionStage: "stage1",
      });
      await ctx.db.patch(userId, { supplierId });
      if (seed.firstProduct?.trim()) {
        await ctx.db.insert("supplierProducts", {
          supplierId,
          name: seed.firstProduct.trim(),
          price: 0,
          description: "",
          unit: "אדם",
        });
      }
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Failed to create user profile");
    }
    return { ...user, id: user._id };
  },
});

export const updateProfile = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    avatar: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
    onboardingStage: v.optional(
      v.union(v.literal("stage1"), v.literal("stage2"), v.literal("stage3"))
    ),
    supplierId: v.optional(v.id("suppliers")),
    notificationPreferences: v.optional(
      v.object({
        inApp: v.optional(v.boolean()),
        email: v.optional(v.boolean()),
        sms: v.optional(v.boolean()),
        whatsapp: v.optional(v.boolean()),
      })
    ),
    defaultMarginPercent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }
    await ctx.db.patch(id, filteredUpdates);
    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user, id: user._id };
  },
});

export const updateUserAdmin = mutation({
  args: {
    id: v.id("users"),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("producer"), v.literal("supplier"))
    ),
    status: v.optional(
      v.union(v.literal("active"), v.literal("pending"), v.literal("suspended"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }
    await ctx.db.patch(id, filteredUpdates);
    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user, id: user._id };
  },
});

export const approveSupplier = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "active" });
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user, id: user._id };
  },
});

export const rejectSupplier = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "suspended" });
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user, id: user._id };
  },
});
