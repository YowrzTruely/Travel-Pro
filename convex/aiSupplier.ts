"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const generateMarketingDescription = action({
  args: { supplierId: v.id("suppliers") },
  handler: async (_ctx, _args) => {
    return "תיאור שיווקי ייווצר כאן בעזרת AI";
  },
});

export const cleanProductImage = action({
  args: { productId: v.id("supplierProducts") },
  handler: async (_ctx, _args) => {
    return "ניקוי תמונה באמצעות AI יהיה זמין בקרוב";
  },
});

export const generateTripName = action({
  args: {
    activities: v.array(v.string()),
    region: v.optional(v.string()),
    participants: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const region = args.region || "ישראל";
    const count = args.participants ? ` ל-${args.participants} משתתפים` : "";
    return `יום כיף ב${region}${count} — ${args.activities.slice(0, 2).join(" + ")}`;
  },
});

export const analyzeInvoice = action({
  args: { fileId: v.string() },
  handler: async (_ctx, _args) => {
    return {
      amount: null,
      date: null,
      supplierName: null,
      invoiceNumber: null,
      confidence: 0,
      message: "ניתוח חשבוניות באמצעות AI יהיה זמין בקרוב",
    };
  },
});
