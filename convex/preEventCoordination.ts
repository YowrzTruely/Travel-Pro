import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

/**
 * Cron A: Client coordination — 4 days before event.
 * Sends reminder to client to confirm participants, dietary needs, contact.
 */
export const sendClientCoordination = internalAction({
  args: {},
  handler: async (ctx) => {
    const target = new Date();
    target.setDate(target.getDate() + 4);
    const targetDate = target.toISOString().split("T")[0];

    const projects = await ctx.runQuery(
      internal.preEventCoordination.projectsByDate,
      { date: targetDate }
    );

    let sent = 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const project of projects) {
      // Idempotency: skip if already sent today
      if (
        project.lastClientCoordinationAt &&
        project.lastClientCoordinationAt > todayStart.getTime()
      ) {
        continue;
      }

      // Resolve client contact
      let phone: string | undefined;
      let email: string | undefined;

      if (project.leadId) {
        const lead = await ctx.runQuery(
          internal.preEventCoordination.getLeadContact,
          { leadId: project.leadId }
        );
        if (lead) {
          phone = lead.phone;
          email = lead.email;
        }
      }

      if (!(phone || email)) {
        continue;
      }

      const channels: string[] = [];
      if (phone) {
        channels.push("sms", "whatsapp");
      }
      if (email) {
        channels.push("email");
      }

      await ctx.runAction(internal.notificationSender.sendMultiChannel, {
        phone,
        email,
        title: `תיאום אירוע — ${project.name}`,
        body: [
          "שלום,",
          `האירוע "${project.name}" מתקרב! (${project.date})`,
          "נא לאשר:",
          "• מספר משתתפים סופי",
          "• רגישויות מזון / העדפות תזונה",
          "• איש קשר ביום האירוע",
          "• נקודות איסוף",
          "• בקשות מיוחדות",
          "",
          "צרו קשר עם המפיק לעדכון.",
        ].join("\n"),
        channels,
      });

      // Mark as sent
      await ctx.runMutation(internal.preEventCoordination.markClientSent, {
        projectId: project._id,
      });
      sent++;
    }

    console.log(
      `[PreEvent] Client coordination: ${sent} notifications sent for ${targetDate}`
    );
    return { sent };
  },
});

/**
 * Cron B: Supplier quantity update — 2 days before event.
 * Sends updated participant counts to all suppliers with active orders.
 */
export const sendSupplierQuantityUpdate = internalAction({
  args: {},
  handler: async (ctx) => {
    const target = new Date();
    target.setDate(target.getDate() + 2);
    const targetDate = target.toISOString().split("T")[0];

    const projects = await ctx.runQuery(
      internal.preEventCoordination.projectsByDate,
      { date: targetDate }
    );

    let sent = 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const project of projects) {
      if (
        project.lastSupplierCoordinationAt &&
        project.lastSupplierCoordinationAt > todayStart.getTime()
      ) {
        continue;
      }

      // Get active orders for this project
      const orders = await ctx.runQuery(
        internal.preEventCoordination.activeOrdersByProject,
        { projectId: project._id }
      );

      for (const order of orders) {
        const supplier = await ctx.runQuery(
          internal.preEventCoordination.getSupplierContact,
          { supplierId: order.supplierId }
        );

        if (!(supplier && (supplier.phone || supplier.email))) {
          continue;
        }

        const channels: string[] = [];
        if (supplier.phone) {
          channels.push("sms", "whatsapp");
        }
        if (supplier.email) {
          channels.push("email");
        }

        const contactLine =
          order.contactName && order.contactPhone
            ? `איש קשר: ${order.contactName} - ${order.contactPhone}`
            : "";

        await ctx.runAction(internal.notificationSender.sendMultiChannel, {
          phone: supplier.phone,
          email: supplier.email,
          title: `תזכורת אירוע — ${project.name}`,
          body: [
            `שלום ${supplier.name ?? ""},`,
            `תזכורת: האירוע "${project.name}" ב-${project.date}.`,
            `כמות משתתפים: ${project.participants}`,
            contactLine,
          ]
            .filter(Boolean)
            .join("\n"),
          channels,
        });
        sent++;
      }

      await ctx.runMutation(internal.preEventCoordination.markSupplierSent, {
        projectId: project._id,
      });
    }

    console.log(
      `[PreEvent] Supplier coordination: ${sent} notifications sent for ${targetDate}`
    );
    return { sent };
  },
});

// ─── Helper queries and mutations ───

export const projectsByDate = internalQuery({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.filter(
      (p) => p.date === date && (p.status === "בביצוע" || p.status === "אושר")
    );
  },
});

export const getLeadContact = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    return lead ? { phone: lead.phone, email: lead.email } : null;
  },
});

export const getSupplierContact = internalQuery({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    const s = await ctx.db.get(supplierId);
    return s ? { phone: s.phone, email: s.email, name: s.name } : null;
  },
});

export const activeOrdersByProject = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const orders = await ctx.db
      .query("supplierOrders")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
    return orders.filter(
      (o) => o.status === "sent" || o.status === "confirmed"
    );
  },
});

export const markClientSent = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await ctx.db.patch(projectId, {
      lastClientCoordinationAt: Date.now(),
    });
  },
});

export const markSupplierSent = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await ctx.db.patch(projectId, {
      lastSupplierCoordinationAt: Date.now(),
    });
  },
});
