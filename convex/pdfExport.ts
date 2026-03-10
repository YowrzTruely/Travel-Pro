import { v } from "convex/values";
import { action } from "./_generated/server";

/** Quote PDF — branded client proposal */
export const generateQuotePdf = action({
  args: { projectId: v.id("projects") },
  handler: async (_ctx, { projectId }) => {
    console.log(`[PDF STUB] Generating quote PDF for project ${projectId}`);
    return {
      success: true,
      message: "הפקת PDF תהיה זמינה בקרוב",
      url: null,
    };
  },
});

/** Equipment List PDF */
export const generateEquipmentPdf = action({
  args: { projectId: v.id("projects") },
  handler: async (_ctx, { projectId }) => {
    console.log(`[PDF STUB] Generating equipment PDF for project ${projectId}`);
    return {
      success: true,
      message: "הפקת PDF תהיה זמינה בקרוב",
      url: null,
    };
  },
});

/** Driver Trip File */
export const generateDriverTripFile = action({
  args: {
    projectId: v.id("projects"),
    includePhones: v.optional(v.boolean()),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[PDF STUB] Generating driver trip file for project ${args.projectId}`
    );
    return {
      success: true,
      message: "הפקת קובץ נהג תהיה זמינה בקרוב",
      url: null,
    };
  },
});

/** Client Trip File */
export const generateClientTripFile = action({
  args: { projectId: v.id("projects") },
  handler: async (_ctx, args) => {
    console.log(
      `[PDF STUB] Generating client trip file for project ${args.projectId}`
    );
    return {
      success: true,
      message: "הפקת קובץ לקוח תהיה זמינה בקרוב",
      url: null,
    };
  },
});
