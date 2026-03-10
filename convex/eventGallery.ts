import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** List all gallery items for a project, sorted by createdAt desc */
export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("eventGallery")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return docs.map((doc) => ({ ...doc, id: doc._id }));
  },
});

/** Count photos and videos for a project */
export const getStats = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("eventGallery")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    const photos = docs.filter((d) => d.fileType === "photo").length;
    const videos = docs.filter((d) => d.fileType === "video").length;
    return { photos, videos, total: docs.length };
  },
});

/** Upload a gallery entry */
export const upload = mutation({
  args: {
    projectId: v.id("projects"),
    uploadedBy: v.optional(v.id("users")),
    participantName: v.optional(v.string()),
    participantPhone: v.optional(v.string()),
    fileId: v.string(),
    fileType: v.union(v.literal("photo"), v.literal("video")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("eventGallery", {
      ...args,
      createdAt: Date.now(),
    });
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Failed to read inserted gallery item");
    }
    return { ...doc, id: doc._id };
  },
});

/** Delete a gallery entry */
export const remove = mutation({
  args: { id: v.id("eventGallery") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true, id };
  },
});

/** Register participant for download access */
export const registerAndDownload = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    phone: v.string(),
    marketingConsent: v.boolean(),
  },
  handler: async (_ctx, args) => {
    // For now, just log the registration — no separate table needed
    console.log(
      `[GALLERY] Participant registered: ${args.name} (${args.phone}), marketing: ${args.marketingConsent}, project: ${args.projectId}`
    );
    return { success: true };
  },
});
