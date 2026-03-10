/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityLog from "../activityLog.js";
import type * as aiSupplier from "../aiSupplier.js";
import type * as auth from "../auth.js";
import type * as availabilityRequests from "../availabilityRequests.js";
import type * as bookings from "../bookings.js";
import type * as calendarEvents from "../calendarEvents.js";
import type * as clients from "../clients.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as eventGallery from "../eventGallery.js";
import type * as fieldOperationStops from "../fieldOperationStops.js";
import type * as fieldOperations from "../fieldOperations.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as invoiceTracking from "../invoiceTracking.js";
import type * as kanbanTasks from "../kanbanTasks.js";
import type * as leadCommunications from "../leadCommunications.js";
import type * as leads from "../leads.js";
import type * as notificationSender from "../notificationSender.js";
import type * as notifications from "../notifications.js";
import type * as pdfExport from "../pdfExport.js";
import type * as productAddons from "../productAddons.js";
import type * as projectDocuments from "../projectDocuments.js";
import type * as projects from "../projects.js";
import type * as publicQuote from "../publicQuote.js";
import type * as quoteItems from "../quoteItems.js";
import type * as roadExpenses from "../roadExpenses.js";
import type * as seed from "../seed.js";
import type * as supplierAvailability from "../supplierAvailability.js";
import type * as supplierContacts from "../supplierContacts.js";
import type * as supplierDocuments from "../supplierDocuments.js";
import type * as supplierOrders from "../supplierOrders.js";
import type * as supplierProducts from "../supplierProducts.js";
import type * as supplierPromotions from "../supplierPromotions.js";
import type * as supplierRatings from "../supplierRatings.js";
import type * as suppliers from "../suppliers.js";
import type * as timelineEvents from "../timelineEvents.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityLog: typeof activityLog;
  aiSupplier: typeof aiSupplier;
  auth: typeof auth;
  availabilityRequests: typeof availabilityRequests;
  bookings: typeof bookings;
  calendarEvents: typeof calendarEvents;
  clients: typeof clients;
  crons: typeof crons;
  dashboard: typeof dashboard;
  eventGallery: typeof eventGallery;
  fieldOperationStops: typeof fieldOperationStops;
  fieldOperations: typeof fieldOperations;
  http: typeof http;
  images: typeof images;
  invoiceTracking: typeof invoiceTracking;
  kanbanTasks: typeof kanbanTasks;
  leadCommunications: typeof leadCommunications;
  leads: typeof leads;
  notificationSender: typeof notificationSender;
  notifications: typeof notifications;
  pdfExport: typeof pdfExport;
  productAddons: typeof productAddons;
  projectDocuments: typeof projectDocuments;
  projects: typeof projects;
  publicQuote: typeof publicQuote;
  quoteItems: typeof quoteItems;
  roadExpenses: typeof roadExpenses;
  seed: typeof seed;
  supplierAvailability: typeof supplierAvailability;
  supplierContacts: typeof supplierContacts;
  supplierDocuments: typeof supplierDocuments;
  supplierOrders: typeof supplierOrders;
  supplierProducts: typeof supplierProducts;
  supplierPromotions: typeof supplierPromotions;
  supplierRatings: typeof supplierRatings;
  suppliers: typeof suppliers;
  timelineEvents: typeof timelineEvents;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
