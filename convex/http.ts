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

// ─── Lead Webhook Intake (Facebook, Instagram, TikTok, etc.) ───
http.route({
  path: "/api/leads/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { source, name, phone, email, message } = body as {
        source?: string;
        name?: string;
        phone?: string;
        email?: string;
        message?: string;
      };

      if (!name) {
        return new Response(
          JSON.stringify({ ok: false, error: "name is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      await ctx.runMutation(internal.leads.createFromWebhook, {
        source: source || "website",
        name,
        phone: phone || "",
        email: email || "",
        notes: message || "",
      });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[Lead Webhook] Failed:", error);
      return new Response(
        JSON.stringify({ ok: false, error: "Internal error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ─── WhatsApp Business Incoming Webhook ───

// GET: Verification endpoint for Meta webhook setup
http.route({
  path: "/api/whatsapp/webhook",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === "subscribe" && token && token === expectedToken) {
      console.log("[WhatsApp Webhook] Verification successful");
      return new Response(challenge ?? "", { status: 200 });
    }
    console.warn("[WhatsApp Webhook] Verification failed");
    return new Response("Forbidden", { status: 403 });
  }),
});

// POST: Receive incoming WhatsApp messages and create leads
http.route({
  path: "/api/whatsapp/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Validate X-Hub-Signature-256
      const signature = request.headers.get("x-hub-signature-256");
      const appSecret = process.env.WHATSAPP_APP_SECRET;
      const bodyText = await request.text();

      if (appSecret && signature) {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(appSecret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const sig = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(bodyText)
        );
        const expectedSig = `sha256=${Array.from(new Uint8Array(sig))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")}`;
        if (signature !== expectedSig) {
          console.warn("[WhatsApp Webhook] Invalid signature");
          return new Response("Unauthorized", { status: 401 });
        }
      }

      const body = JSON.parse(bodyText);

      // Parse Meta Cloud API format
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;
      const contacts = value?.contacts;

      if (!messages || messages.length === 0) {
        // Not a message event (could be status update) — acknowledge
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const msg = messages[0];
      const contact = contacts?.[0];
      const phone = msg.from ?? "";
      const text = msg.text?.body ?? "";
      const name = contact?.profile?.name ?? phone;

      // Create lead from incoming WhatsApp message
      await ctx.runMutation(internal.leads.createFromWebhook, {
        source: "whatsapp",
        name,
        phone,
        email: "",
        notes: text,
      });

      console.log(
        `[WhatsApp Webhook] Lead created from ${name} (${phone}): "${text.slice(0, 50)}"`
      );

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[WhatsApp Webhook] Failed:", error);
      return new Response(JSON.stringify({ ok: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
