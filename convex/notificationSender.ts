import { v } from "convex/values";
import { action } from "./_generated/server";

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
