import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// ─── SLNG SMS Delivery Report Webhook ───
http.route({
  path: "/slng/dlr",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      const phoneNumber = body.PHONE_NUMBER as string | undefined;
      const status = body.STATUS as string | undefined;
      const reasonMsg = body.REASON_MSG as string | undefined;
      const customerMsgId = body.CUSTOMER_MSG_ID as string | undefined;

      console.log(
        `[SLNG DLR] Phone: ${phoneNumber}, Status: ${status}, Reason: ${reasonMsg}, MsgId: ${customerMsgId}`
      );

      // If we have a notification ID in CUSTOMER_MSG_ID, update its status
      if (customerMsgId) {
        // Map SLNG status to our delivery status
        const deliveryStatus =
          status === "DELIVRD" || status === "DELIVERED"
            ? ("sent" as const)
            : ("failed" as const);

        try {
          const notificationId = customerMsgId as any;
          await ctx.runMutation(internal.notifications.updateDeliveryStatus, {
            notificationId,
            status: deliveryStatus,
          });
        } catch (error) {
          console.warn(
            `[SLNG DLR] Could not update notification ${customerMsgId}:`,
            error
          );
        }
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[SLNG DLR] Failed to process delivery report:", error);
      return new Response(JSON.stringify({ ok: false }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
