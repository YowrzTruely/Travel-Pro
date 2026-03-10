import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";

export const sendQuoteToClient = action({
  args: {
    projectId: v.id("projects"),
    channel: v.union(
      v.literal("sms"),
      v.literal("email"),
      v.literal("whatsapp")
    ),
    recipient: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    sent: boolean;
    channel: "whatsapp" | "sms" | "email";
    waLink?: string;
    error?: string;
  }> => {
    // Fetch project
    const project = await ctx.runQuery(api.projects.get, {
      id: args.projectId as string,
    });
    if (!project) {
      throw new Error("Project not found");
    }

    const quoteUrl: string = `${
      process.env.CONVEX_SITE_URL
        ? process.env.CONVEX_SITE_URL.replace(".convex.site", ".vercel.app")
        : "https://travelpro.co.il"
    }/quote/${args.projectId}`;
    const message: string = `שלום,\nהצעת המחיר עבור "${project.name}" מוכנה!\n${quoteUrl}`;

    if (args.channel === "whatsapp") {
      const phone: string = args.recipient
        .replace(/^0/, "972")
        .replace(/[^0-9]/g, "");
      const waLink: string = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      return { sent: true, channel: "whatsapp", waLink };
    }

    if (args.channel === "sms") {
      const result: { sent: boolean } = await ctx.runAction(
        internal.notificationSender.sendSMS,
        {
          phone: args.recipient,
          message,
        }
      );
      return {
        sent: result.sent,
        channel: "sms",
        error: result.sent ? undefined : "SMS sending failed",
      };
    }

    if (args.channel === "email") {
      const result: { sent: boolean } = await ctx.runAction(
        internal.notificationSender.sendEmail,
        {
          email: args.recipient,
          subject: `הצעת מחיר — ${project.name}`,
          body: message,
        }
      );
      return {
        sent: result.sent,
        channel: "email",
        error: result.sent ? undefined : "Email sending failed",
      };
    }

    return { sent: false, channel: args.channel, error: "Unknown channel" };
  },
});
