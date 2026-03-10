"use node";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

// ─── WhatsApp via wa.me links ───

export const sendWhatsApp = internalAction({
  args: {
    phone: v.string(),
    message: v.string(),
    templateId: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const phone = args.phone.replace(/^0/, "972").replace(/[^0-9]/g, "");
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(args.message)}`;
    console.log(`[WhatsApp] wa.me link generated: ${waLink}`);
    return {
      sent: true,
      channel: "whatsapp" as const,
      deliveryId: `wa_${Date.now()}`,
      waLink,
    };
  },
});

// ─── SMS via SLNG ───

export const sendSMS = internalAction({
  args: {
    phone: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const username = process.env.SLNG_USERNAME;
    const password = process.env.SLNG_PASSWORD;
    const fromMobile = process.env.SLNG_FROM_MOBILE ?? "TravelPro";

    if (!(username && password)) {
      console.warn("[SMS] SLNG not configured – missing env vars");
      return {
        sent: false,
        channel: "sms" as const,
        deliveryId: "",
        error: "SLNG not configured",
      };
    }

    try {
      const response = await fetch(
        "https://slng5.com/Api/SendSmsJsonBody.ashx",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Username: username,
            Password: password,
            MsgName: "TravelPro SMS",
            MsgBody: args.message,
            FromMobile: fromMobile,
            DeliveryAckUrl: null,
            MsgScheduleTime: null,
            Mobiles: [{ Mobile: args.phone }],
          }),
        }
      );

      const result = (await response.json()) as {
        Status: boolean;
        Description: string;
        GeneralGUID: string;
      };

      console.log(
        `[SMS] SLNG response: Status=${result.Status}, Desc=${result.Description}, GUID=${result.GeneralGUID}`
      );

      return {
        sent: result.Status,
        channel: "sms" as const,
        deliveryId: result.GeneralGUID ?? "",
        error: result.Status ? undefined : result.Description,
      };
    } catch (error) {
      console.error("[SMS] SLNG request failed:", error);
      return {
        sent: false,
        channel: "sms" as const,
        deliveryId: "",
        error: String(error),
      };
    }
  },
});

// ─── Email via Resend ───

export const sendEmail = internalAction({
  args: {
    email: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("[Email] Resend not configured – missing RESEND_API_KEY");
      return {
        sent: false,
        channel: "email" as const,
        deliveryId: "",
        error: "Email not configured",
      };
    }

    const fromAddress =
      process.env.EMAIL_FROM_ADDRESS ?? "TravelPro <noreply@travelpro.co.il>";

    const html = `<div dir="rtl" style="font-family: Assistant, sans-serif; direction: rtl; text-align: right;">${args.body}</div>`;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [args.email],
          subject: args.subject,
          html,
        }),
      });

      const result = (await response.json()) as {
        id?: string;
        error?: { message: string };
      };

      if (!response.ok || result.error) {
        const errorMsg = result.error?.message ?? `HTTP ${response.status}`;
        console.error(`[Email] Resend error: ${errorMsg}`);
        return {
          sent: false,
          channel: "email" as const,
          deliveryId: "",
          error: errorMsg,
        };
      }

      console.log(`[Email] Sent via Resend, id=${result.id}`);
      return {
        sent: true,
        channel: "email" as const,
        deliveryId: result.id ?? "",
      };
    } catch (error) {
      console.error("[Email] Resend request failed:", error);
      return {
        sent: false,
        channel: "email" as const,
        deliveryId: "",
        error: String(error),
      };
    }
  },
});

// ─── Multi-channel sender ───

export const sendMultiChannel = internalAction({
  args: {
    userId: v.optional(v.id("users")),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    channels: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const results: Array<{
      channel: string;
      sent: boolean;
      deliveryId?: string;
      error?: string;
    }> = [];

    for (const channel of args.channels) {
      try {
        switch (channel) {
          case "whatsapp": {
            if (args.phone) {
              const result = await ctx.runAction(
                internal.notificationSender.sendWhatsApp,
                {
                  phone: args.phone,
                  message: `${args.title}\n${args.body}${args.link ? `\n${args.link}` : ""}`,
                }
              );
              results.push(result);
            } else {
              results.push({
                channel,
                sent: false,
                error: "No phone number provided",
              });
            }
            break;
          }
          case "sms": {
            if (args.phone) {
              const result = await ctx.runAction(
                internal.notificationSender.sendSMS,
                {
                  phone: args.phone,
                  message: `${args.title}: ${args.body}`,
                }
              );
              results.push(result);
            } else {
              results.push({
                channel,
                sent: false,
                error: "No phone number provided",
              });
            }
            break;
          }
          case "email": {
            if (args.email) {
              const result = await ctx.runAction(
                internal.notificationSender.sendEmail,
                {
                  email: args.email,
                  subject: args.title,
                  body: `${args.body}${args.link ? `\n\nקישור: ${args.link}` : ""}`,
                }
              );
              results.push(result);
            } else {
              results.push({
                channel,
                sent: false,
                error: "No email address provided",
              });
            }
            break;
          }
          case "in_app": {
            // In-app notification is created via createForUser mutation,
            // not through the sender action
            results.push({
              channel,
              sent: true,
              deliveryId: `inapp_${Date.now()}`,
            });
            break;
          }
          default: {
            results.push({
              channel,
              sent: false,
              error: `Unknown channel: ${channel}`,
            });
          }
        }
      } catch (error) {
        results.push({
          channel,
          sent: false,
          error: String(error),
        });
      }
    }

    return { results };
  },
});

// ─── Legacy stubs (kept for backward compatibility) ───

export const sendAvailabilityRequest = action({
  args: {
    supplierName: v.string(),
    supplierPhone: v.optional(v.string()),
    projectName: v.string(),
    date: v.string(),
    participants: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[NotificationSender] Availability request to ${args.supplierName}`,
      `Project: ${args.projectName}, Date: ${args.date}, Participants: ${args.participants ?? "N/A"}`,
      `Phone: ${args.supplierPhone ?? "N/A"}`
    );
    return { sent: true, channel: "stub" };
  },
});

export const sendBookingConfirmation = action({
  args: {
    supplierName: v.string(),
    projectName: v.string(),
    date: v.string(),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[NotificationSender] Booking confirmed: ${args.supplierName} for ${args.projectName} on ${args.date}`
    );
    return { sent: true, channel: "stub" };
  },
});

export const sendCancellationNotice = action({
  args: {
    supplierName: v.string(),
    projectName: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[NotificationSender] Cancellation: ${args.supplierName} for ${args.projectName}. Reason: ${args.reason ?? "N/A"}`
    );
    return { sent: true, channel: "stub" };
  },
});
