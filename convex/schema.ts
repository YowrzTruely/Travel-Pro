import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // ─── User profiles & roles ───
  // Note: authTables creates users with just {email}. All profile fields
  // must be v.optional() to coexist with auth-created records.
  users: defineTable({
    authId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("producer"), v.literal("supplier"))
    ),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    avatar: v.optional(v.string()),
    supplierId: v.optional(v.id("suppliers")),
    status: v.optional(
      v.union(v.literal("active"), v.literal("pending"), v.literal("suspended"))
    ),
    onboardingCompleted: v.optional(v.boolean()),
    onboardingStage: v.optional(
      v.union(v.literal("stage1"), v.literal("stage2"), v.literal("stage3"))
    ),
    registrationSource: v.optional(
      v.union(
        v.literal("manual"),
        v.literal("self_registration"),
        v.literal("availability_invite")
      )
    ),
    invitedBy: v.optional(v.id("users")),
    createdAt: v.optional(v.number()),
  })
    .index("by_authId", ["authId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  // ─── Suppliers ───
  suppliers: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    category: v.string(),
    categoryColor: v.string(),
    region: v.optional(v.string()),
    rating: v.number(),
    verificationStatus: v.union(
      v.literal("verified"),
      v.literal("pending"),
      v.literal("unverified")
    ),
    notes: v.optional(v.string()),
    icon: v.optional(v.string()),
    address: v.optional(v.string()),
    location: v.optional(v.object({ lat: v.number(), lng: v.number() })),
    // New fields
    userId: v.optional(v.id("users")),
    approvedByAdmin: v.optional(v.boolean()),
    approvedAt: v.optional(v.number()),
    registrationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    invitedBy: v.optional(v.id("users")),
    profileCompletionStage: v.optional(
      v.union(v.literal("stage1"), v.literal("stage2"), v.literal("stage3"))
    ),
    // URLs for AI marketing description generation (PRD §3.5)
    websiteUrl: v.optional(v.string()),
    facebookUrl: v.optional(v.string()),
    operatingHours: v.optional(v.string()),
    seasonalAvailability: v.optional(v.string()),
    defaultMarginPercent: v.optional(v.number()),
    averageRating: v.optional(v.number()),
    totalRatings: v.optional(v.number()),
    usesCustomOrderFormat: v.optional(v.boolean()),
    customOrderFormatNotes: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_category", ["category"])
    .index("by_region", ["region"])
    .index("by_verificationStatus", ["verificationStatus"])
    .index("by_userId", ["userId"]),

  supplierContacts: defineTable({
    legacyId: v.optional(v.string()),
    supplierId: v.id("suppliers"),
    name: v.string(),
    role: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    primary: v.boolean(),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_supplierId", ["supplierId"]),

  supplierProducts: defineTable({
    legacyId: v.optional(v.string()),
    supplierId: v.id("suppliers"),
    name: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
    unit: v.optional(v.string()),
    images: v.optional(
      v.array(
        v.object({
          id: v.string(),
          storageId: v.string(),
          name: v.string(),
        })
      )
    ),
    notes: v.optional(v.string()),
    // New fields — 4-tier pricing
    listPrice: v.optional(v.number()),
    directPrice: v.optional(v.number()),
    producerPrice: v.optional(v.number()),
    clientPrice: v.optional(v.number()),
    // Volume pricing (PRD §3.3 — different price above quantity "X")
    volumeThreshold: v.optional(v.number()),
    volumeListPrice: v.optional(v.number()),
    volumeDirectPrice: v.optional(v.number()),
    volumeProducerPrice: v.optional(v.number()),
    // Timing
    grossTime: v.optional(v.number()),
    netTime: v.optional(v.number()),
    // Equipment & requirements
    equipmentRequirements: v.optional(v.array(v.string())),
    // Capacity & logistics
    capacity: v.optional(v.number()),
    location: v.optional(v.string()),
    cancellationTerms: v.optional(v.string()),
    // AI-generated content
    aiDescription: v.optional(v.string()),
    aiCleanedImageId: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_supplierId", ["supplierId"]),

  supplierDocuments: defineTable({
    legacyId: v.optional(v.string()),
    supplierId: v.id("suppliers"),
    name: v.string(),
    expiry: v.optional(v.string()),
    status: v.union(
      v.literal("valid"),
      v.literal("warning"),
      v.literal("expired")
    ),
    fileName: v.optional(v.string()),
    documentType: v.optional(v.string()),
    storageId: v.optional(v.string()),
    acknowledged: v.optional(v.boolean()),
    acknowledgedAt: v.optional(v.number()),
    lastReminderAt: v.optional(v.number()),
    reminderCount: v.optional(v.number()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_supplierId", ["supplierId"]),

  // ─── Projects ───
  projects: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    client: v.optional(v.string()),
    company: v.optional(v.string()),
    participants: v.number(),
    region: v.optional(v.string()),
    status: v.string(),
    statusColor: v.optional(v.string()),
    totalPrice: v.number(),
    pricePerPerson: v.number(),
    profitMargin: v.number(),
    date: v.optional(v.string()),
    // New fields
    leadId: v.optional(v.id("leads")),
    assignedTo: v.optional(v.id("users")),
    quoteVersion: v.optional(v.number()),
    digitalSignatureId: v.optional(v.string()),
    archiveBlocked: v.optional(v.boolean()),
    archiveBlockReason: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_status", ["status"]),

  quoteItems: defineTable({
    legacyId: v.optional(v.string()),
    projectId: v.id("projects"),
    type: v.optional(v.string()),
    icon: v.optional(v.string()),
    name: v.string(),
    supplier: v.optional(v.string()),
    description: v.optional(v.string()),
    cost: v.number(),
    directPrice: v.number(),
    sellingPrice: v.number(),
    profitWeight: v.number(),
    status: v.string(),
    alternatives: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          description: v.string(),
          costPerPerson: v.number(),
          selected: v.boolean(),
        })
      )
    ),
    images: v.optional(
      v.array(
        v.object({
          id: v.string(),
          storageId: v.string(),
          name: v.string(),
        })
      )
    ),
    notes: v.optional(v.string()),
    // New fields
    supplierId: v.optional(v.id("suppliers")),
    productId: v.optional(v.id("supplierProducts")),
    availabilityStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("declined"),
        v.literal("not_checked")
      )
    ),
    selectedAddons: v.optional(
      v.array(
        v.object({
          addonId: v.id("productAddons"),
          name: v.string(),
          price: v.number(),
        })
      )
    ),
    equipmentRequirements: v.optional(v.array(v.string())),
    grossTime: v.optional(v.number()),
    netTime: v.optional(v.number()),
    alternativeItems: v.optional(
      v.array(
        v.object({
          supplierId: v.id("suppliers"),
          productId: v.optional(v.id("supplierProducts")),
          name: v.string(),
          price: v.number(),
          description: v.optional(v.string()),
          imageUrl: v.optional(v.string()),
        })
      )
    ),
    selectedByClient: v.optional(v.boolean()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_projectId", ["projectId"]),

  timelineEvents: defineTable({
    legacyId: v.optional(v.string()),
    projectId: v.id("projects"),
    time: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_projectId", ["projectId"]),

  projectDocuments: defineTable({
    legacyId: v.optional(v.string()),
    projectId: v.id("projects"),
    name: v.string(),
    type: v.optional(v.string()),
    expiry: v.optional(v.string()),
    status: v.string(),
    fileName: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_projectId", ["projectId"]),

  // ─── Clients ───
  clients: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("lead"),
      v.literal("inactive")
    ),
    notes: v.optional(v.string()),
    totalProjects: v.number(),
    totalRevenue: v.number(),
    createdAt: v.optional(v.string()),
    // New fields
    leadId: v.optional(v.id("leads")),
    userId: v.optional(v.id("users")),
    source: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_status", ["status"]),

  // ─── Calendar ───
  calendarEvents: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    type: v.optional(v.string()),
    color: v.optional(v.string()),
    projectId: v.optional(v.string()),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_date", ["date"]),

  // ─── Kanban ───
  kanbanTasks: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    priority: v.string(),
    status: v.string(),
    feature: v.optional(v.string()),
    estimate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.optional(v.string()),
    version: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.string(),
          dataUrl: v.string(),
        })
      )
    ),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_status", ["status"]),

  // ─── Metadata ───
  metadata: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  // ═══════════════════════════════════════════
  // NEW TABLES (Plan 01)
  // ═══════════════════════════════════════════

  // ─── CRM: Leads ───
  leads: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    source: v.union(
      v.literal("facebook"),
      v.literal("instagram"),
      v.literal("tiktok"),
      v.literal("youtube"),
      v.literal("linkedin"),
      v.literal("whatsapp"),
      v.literal("phone"),
      v.literal("manual"),
      v.literal("website")
    ),
    participants: v.optional(v.number()),
    dateRequested: v.optional(v.string()),
    budget: v.optional(v.number()),
    eventType: v.optional(v.string()),
    region: v.optional(v.string()),
    preferences: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("first_contact"),
      v.literal("needs_assessment"),
      v.literal("building_plan"),
      v.literal("quote_sent"),
      v.literal("approved"),
      v.literal("closed_won"),
      v.literal("closed_lost")
    ),
    lossReason: v.optional(
      v.union(
        v.literal("expensive"),
        v.literal("competitor"),
        v.literal("disappeared"),
        v.literal("other")
      )
    ),
    lossReasonNotes: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_source", ["source"])
    .index("by_createdAt", ["createdAt"]),

  // ─── CRM: Lead Communications ───
  leadCommunications: defineTable({
    leadId: v.id("leads"),
    type: v.union(
      v.literal("call"),
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("sms"),
      v.literal("note"),
      v.literal("system")
    ),
    content: v.string(),
    duration: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_leadId", ["leadId"]),

  // ─── Product Addons (Upsells) ───
  productAddons: defineTable({
    productId: v.id("supplierProducts"),
    name: v.string(),
    description: v.optional(v.string()),
    listPrice: v.number(),
    directPrice: v.optional(v.number()),
    producerPrice: v.optional(v.number()),
    unit: v.optional(v.string()),
  }).index("by_productId", ["productId"]),

  // ─── Availability Requests ───
  availabilityRequests: defineTable({
    quoteItemId: v.id("quoteItems"),
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    requestedBy: v.id("users"),
    date: v.string(),
    participants: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("alternative_proposed")
    ),
    responseNotes: v.optional(v.string()),
    alternativeProductId: v.optional(v.id("supplierProducts")),
    alternativeDate: v.optional(v.string()),
    requestedAt: v.number(),
    respondedAt: v.optional(v.number()),
    notificationChannels: v.optional(v.array(v.string())),
  })
    .index("by_supplierId", ["supplierId"])
    .index("by_projectId", ["projectId"])
    .index("by_quoteItemId", ["quoteItemId"])
    .index("by_status", ["status"]),

  // ─── Bookings ───
  bookings: defineTable({
    availabilityRequestId: v.id("availabilityRequests"),
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    date: v.string(),
    participants: v.number(),
    status: v.union(
      v.literal("reserved"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    expiresAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_supplierId", ["supplierId"])
    .index("by_status", ["status"])
    .index("by_expiresAt", ["expiresAt"]),

  // ─── Supplier Orders ───
  supplierOrders: defineTable({
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    bookingId: v.optional(v.id("bookings")),
    clientName: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    participants: v.number(),
    agreedPrice: v.number(),
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    usesCustomFormat: v.boolean(),
    customFormatNotes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_supplierId", ["supplierId"])
    .index("by_status", ["status"]),

  // ─── Invoice Tracking ───
  invoiceTracking: defineTable({
    projectId: v.id("projects"),
    supplierId: v.id("suppliers"),
    orderId: v.optional(v.id("supplierOrders")),
    invoiceNumber: v.optional(v.string()),
    amount: v.optional(v.number()),
    fileId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("received"),
      v.literal("verified")
    ),
    receivedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_supplierId", ["supplierId"])
    .index("by_status", ["status"]),

  // ─── Supplier Promotions ───
  supplierPromotions: defineTable({
    supplierId: v.id("suppliers"),
    productId: v.optional(v.id("supplierProducts")),
    title: v.string(),
    description: v.optional(v.string()),
    discountPercent: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    startsAt: v.number(),
    expiresAt: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_supplierId", ["supplierId"])
    .index("by_isActive", ["isActive"])
    .index("by_expiresAt", ["expiresAt"]),

  // ─── Field Operations ───
  fieldOperations: defineTable({
    projectId: v.id("projects"),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_status", ["status"]),

  fieldOperationStops: defineTable({
    fieldOperationId: v.id("fieldOperations"),
    quoteItemId: v.optional(v.id("quoteItems")),
    supplierId: v.id("suppliers"),
    supplierName: v.string(),
    orderIndex: v.number(),
    plannedStartTime: v.string(),
    plannedEndTime: v.string(),
    actualStartTime: v.optional(v.string()),
    actualEndTime: v.optional(v.string()),
    plannedQuantity: v.number(),
    actualQuantity: v.optional(v.number()),
    supplierSignature: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("skipped")
    ),
  })
    .index("by_fieldOperationId", ["fieldOperationId"])
    .index("by_supplierId", ["supplierId"]),

  // ─── Road Expenses ───
  roadExpenses: defineTable({
    fieldOperationId: v.id("fieldOperations"),
    projectId: v.id("projects"),
    description: v.string(),
    amount: v.number(),
    receiptFileId: v.optional(v.string()),
    category: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_fieldOperationId", ["fieldOperationId"])
    .index("by_projectId", ["projectId"]),

  // ─── Notifications ───
  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    read: v.boolean(),
    channel: v.union(
      v.literal("in_app"),
      v.literal("email"),
      v.literal("sms"),
      v.literal("whatsapp")
    ),
    externalDeliveryStatus: v.optional(
      v.union(v.literal("pending"), v.literal("sent"), v.literal("failed"))
    ),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_read", ["userId", "read"])
    .index("by_createdAt", ["createdAt"]),

  // ─── Supplier Availability ───
  supplierAvailability: defineTable({
    supplierId: v.id("suppliers"),
    date: v.string(),
    available: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_supplierId", ["supplierId"])
    .index("by_supplierId_date", ["supplierId", "date"]),

  // ─── Quote Change Requests ───
  quoteChangeRequests: defineTable({
    projectId: v.id("projects"),
    items: v.array(
      v.object({
        quoteItemId: v.id("quoteItems"),
        reason: v.string(),
      })
    ),
    generalNotes: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("addressed")),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_status", ["status"]),

  // ─── Quote Upsells ───
  quoteUpsells: defineTable({
    projectId: v.id("projects"),
    quoteItemId: v.id("quoteItems"),
    addonId: v.id("productAddons"),
    name: v.string(),
    price: v.number(),
    selectedByClient: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_quoteItemId", ["quoteItemId"]),

  // ─── Event Gallery ───
  eventGallery: defineTable({
    projectId: v.id("projects"),
    uploadedBy: v.optional(v.id("users")),
    participantName: v.optional(v.string()),
    participantPhone: v.optional(v.string()),
    fileId: v.string(),
    fileType: v.union(v.literal("photo"), v.literal("video")),
    createdAt: v.number(),
  }).index("by_projectId", ["projectId"]),

  // ─── Supplier Ratings ───
  supplierRatings: defineTable({
    supplierId: v.id("suppliers"),
    projectId: v.id("projects"),
    ratedBy: v.optional(v.id("users")),
    participantName: v.optional(v.string()),
    rating: v.number(),
    comment: v.optional(v.string()),
    isProducerRating: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_supplierId", ["supplierId"])
    .index("by_projectId", ["projectId"]),
});
