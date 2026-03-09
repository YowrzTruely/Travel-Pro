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

export default crons;
