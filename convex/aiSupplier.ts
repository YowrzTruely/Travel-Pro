"use node";

import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callOpenRouterWithVision(
  systemPrompt: string,
  imageUrl: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
              {
                type: "text",
                text: "Please analyze this invoice image and extract the requested data.",
              },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export const generateMarketingDescription = action({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args): Promise<string> => {
    const supplier = await ctx.runQuery(api.suppliers.get, {
      id: args.supplierId,
    });
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return "תיאור שיווקי ייווצר כאן בעזרת AI";
    }

    const details: string = [
      `שם הספק: ${supplier.name}`,
      `קטגוריה: ${supplier.category}`,
      supplier.region ? `אזור: ${supplier.region}` : null,
      supplier.notes ? `הערות: ${supplier.notes}` : null,
      supplier.websiteUrl ? `אתר: ${supplier.websiteUrl}` : null,
      supplier.facebookUrl ? `פייסבוק: ${supplier.facebookUrl}` : null,
      supplier.operatingHours
        ? `שעות פעילות: ${supplier.operatingHours}`
        : null,
      supplier.address ? `כתובת: ${supplier.address}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return await callOpenRouter(
      "You are a marketing copywriter for Israeli tourism. Write in Hebrew. Output ONLY the description text itself — nothing else. No titles, no headings, no introductory phrases like 'הנה תיאור' or 'בטח'. No markdown formatting whatsoever — no **, no ##, no bullet points, no dashes. Just plain Hebrew text with proper punctuation. Write a compelling, professional marketing description (3-5 sentences) for a supplier/venue that event producers would use for group trips and team-building events.",
      `Write a marketing description for this supplier. Output ONLY the plain text description, no preamble:\n${details}`
    );
  },
});

export const cleanProductImage = action({
  args: { productId: v.id("supplierProducts") },
  handler: async (_ctx, _args) => {
    return "ניקוי תמונה דורש שירות עיבוד תמונות ייעודי";
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

    if (!process.env.OPENROUTER_API_KEY) {
      return `יום כיף ב${region}${count} — ${args.activities.slice(0, 2).join(" + ")}`;
    }

    const participantsInfo = args.participants
      ? `${args.participants} משתתפים`
      : "קבוצה";

    const result = await callOpenRouter(
      "You are a creative Israeli event naming expert. Generate a single creative, fun Hebrew trip name. Return ONLY the name, nothing else. No quotes, no explanation.",
      `Create a creative Hebrew trip name for an event with these details:\nActivities: ${args.activities.join(", ")}\nRegion: ${region}\nParticipants: ${participantsInfo}`
    );

    return result.trim();
  },
});

export const generateOpeningParagraph = action({
  args: {
    activities: v.array(v.string()),
    region: v.optional(v.string()),
    participants: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const region = args.region || "ישראל";
    const count = args.participants ? `${args.participants} משתתפים` : "הקבוצה";
    const activities = args.activities.slice(0, 3).join(", ");

    if (!process.env.OPENROUTER_API_KEY) {
      return `יום מושלם מחכה ל${count} באזור ${region}! תוכנית עשירה הכוללת ${activities} — חוויה בלתי נשכחת שתחזק את הצוות ותיצור זכרונות משותפים.`;
    }

    const participantsInfo = args.participants
      ? `${args.participants} משתתפים`
      : "קבוצה";

    return await callOpenRouter(
      "You are an Israeli event proposal writer. Write an engaging Hebrew opening paragraph (2-3 sentences) for a group event proposal. The tone should be professional yet exciting. Do not include a title or heading.",
      `Write an opening paragraph for an event proposal with these details:\nActivities: ${args.activities.join(", ")}\nRegion: ${region}\nParticipants: ${participantsInfo}`
    );
  },
});

export const analyzeInvoice = action({
  args: { fileId: v.string() },
  handler: async (ctx, args) => {
    const fallbackResult = {
      amount: null as number | null,
      date: null as string | null,
      supplierName: null as string | null,
      invoiceNumber: null as string | null,
      confidence: 0,
      message: "",
    };

    if (!process.env.OPENROUTER_API_KEY) {
      return {
        ...fallbackResult,
        message: "ניתוח חשבוניות באמצעות AI יהיה זמין בקרוב",
      };
    }

    const url = await ctx.storage.getUrl(args.fileId as never);
    if (!url) {
      return {
        ...fallbackResult,
        message: "לא ניתן לגשת לקובץ",
      };
    }

    try {
      const rawResult = await callOpenRouterWithVision(
        'You are an invoice analysis AI specializing in Israeli invoices (Hebrew). Extract structured data from this invoice image. Return ONLY valid JSON with these fields: {"amount": number_or_null, "date": "YYYY-MM-DD_or_null", "supplierName": "string_or_null", "invoiceNumber": "string_or_null"}. If you cannot determine a field, use null. Do not include any text outside the JSON.',
        url
      );

      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          ...fallbackResult,
          confidence: 0.1,
          message: "לא הצלחתי לחלץ נתונים מהחשבונית",
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        amount: typeof parsed.amount === "number" ? parsed.amount : null,
        date: typeof parsed.date === "string" ? parsed.date : null,
        supplierName:
          typeof parsed.supplierName === "string" ? parsed.supplierName : null,
        invoiceNumber:
          typeof parsed.invoiceNumber === "string"
            ? parsed.invoiceNumber
            : null,
        confidence: 0.8,
        message: "ניתוח הושלם בהצלחה",
      };
    } catch (error) {
      return {
        ...fallbackResult,
        confidence: 0,
        message: `שגיאה בניתוח החשבונית: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});
