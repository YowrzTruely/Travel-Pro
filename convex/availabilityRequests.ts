import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("availabilityRequests")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("availabilityRequests")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

export const create = mutation({
  args: {
    quoteItemId: v.id("quoteItems"),
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    requestedBy: v.id("users"),
    date: v.string(),
    participants: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("availabilityRequests", {
      ...args,
      status: "pending",
      requestedAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted document");
    }

    // Generate invite token if supplier has no linked user account
    let inviteToken: string | undefined;
    const supplier = await ctx.db.get(args.supplierId);
    if (supplier && !supplier.userId) {
      inviteToken = crypto.randomUUID();
      await ctx.db.insert("availabilityInviteTokens", {
        token: inviteToken,
        availabilityRequestId: id,
        supplierId: args.supplierId,
        supplierPhone: supplier.phone ?? "",
        createdBy: args.requestedBy,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        status: "pending",
      });
    }

    // Notify supplier of availability request via multi-channel
    if (supplier) {
      const project = await ctx.db.get(args.projectId);
      let productName = "";
      if (args.productId) {
        const product = await ctx.db.get(args.productId);
        productName = product?.name ?? "";
      }
      const requestor = await ctx.db.get(args.requestedBy);
      const producerName = requestor?.name ?? requestor?.company ?? "מפיק";

      const siteUrl = process.env.CONVEX_SITE_URL
        ? process.env.CONVEX_SITE_URL.replace(".convex.site", ".vercel.app")
        : "https://travelpro.co.il";

      const link = inviteToken
        ? `${siteUrl}/availability-invite/${inviteToken}`
        : `${siteUrl}/requests`;

      const body = [
        `${producerName} בודק איתך זמינות לאירוע "${project?.name ?? ""}" ב-${args.date}.`,
        args.participants ? `${args.participants} משתתפים` : "",
        productName ? `מוצר: ${productName}` : "",
        args.notes ? `הערות: ${args.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const channels: string[] = ["in_app"];
      if (supplier.phone) {
        channels.push("sms", "whatsapp");
      }
      if (supplier.email) {
        channels.push("email");
      }

      await ctx.scheduler.runAfter(
        0,
        internal.notificationSender.sendMultiChannel,
        {
          phone: supplier.phone,
          email: supplier.email,
          title: "בקשת זמינות חדשה",
          body,
          link,
          channels,
        }
      );
    }

    return { ...doc, id: doc._id, inviteToken };
  },
});

export const respond = mutation({
  args: {
    id: v.id("availabilityRequests"),
    status: v.union(
      v.literal("approved"),
      v.literal("declined"),
      v.literal("alternative_proposed")
    ),
    responseNotes: v.optional(v.string()),
    alternativeProductId: v.optional(v.id("supplierProducts")),
    alternativeDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      respondedAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read updated document");
    }
    // Sync availability status back to the quote item
    if (doc.quoteItemId) {
      const item = await ctx.db.get(doc.quoteItemId);
      if (item) {
        await ctx.db.patch(doc.quoteItemId, {
          availabilityStatus:
            args.status === "alternative_proposed" ? "declined" : args.status,
        });
      }
    }
    return { ...doc, id: doc._id };
  },
});
