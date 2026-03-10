import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

// ─── WhatsApp Business API stub ───

export const sendWhatsApp = internalAction({
  args: {
    phone: v.string(),
    message: v.string(),
    templateId: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[WhatsApp STUB] To: ${args.phone}, Message: ${args.message}${args.templateId ? `, Template: ${args.templateId}` : ""}`
    );
    return {
      sent: true,
      channel: "whatsapp" as const,
      deliveryId: `wa_${Date.now()}`,
    };
  },
});

// ─── SMS via Twilio stub ───

export const sendSMS = internalAction({
  args: {
    phone: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    console.log(`[SMS STUB] To: ${args.phone}, Message: ${args.message}`);
    return {
      sent: true,
      channel: "sms" as const,
      deliveryId: `sms_${Date.now()}`,
    };
  },
});

// ─── Email stub ───

export const sendEmail = internalAction({
  args: {
    email: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[Email STUB] To: ${args.email}, Subject: ${args.subject}, Body: ${args.body}`
    );
    return {
      sent: true,
      channel: "email" as const,
      deliveryId: `email_${Date.now()}`,
    };
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
