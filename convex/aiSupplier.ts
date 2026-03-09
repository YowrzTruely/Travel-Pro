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
