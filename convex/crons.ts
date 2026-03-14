import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 6:00 UTC = 9:00 Israel time — check document expiry statuses daily
crons.cron(
  "check document expiry",
  "0 6 * * *",
  internal.supplierDocuments.checkExpiry
);

// 7:00 UTC = 10:00 Israel time — send reminders for missing documents
crons.cron(
  "send document reminders",
  "0 7 * * *",
  internal.supplierDocuments.sendReminders
);

// 5:00 UTC = 8:00 Israel time — alert on bookings expiring in 2 days
crons.cron(
  "check reservation expiry alerts",
  "0 5 * * *",
  internal.bookings.sendExpiryAlerts
);

// 0:00 UTC = 3:00 Israel time — deactivate expired supplier promotions
crons.cron(
  "deactivate expired promotions",
  "0 0 * * *",
  internal.supplierPromotions.deactivateExpired
);

// 8:00 UTC = 11:00 Israel time — send reminders for orders with events in 7 days
crons.cron(
  "send order reminders",
  "0 8 * * *",
  internal.supplierOrders.sendUpcomingReminders
);

export default crons;
