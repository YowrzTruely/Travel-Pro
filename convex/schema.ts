import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

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
    location: v.optional(
      v.object({ lat: v.number(), lng: v.number() })
    ),
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_category", ["category"])
    .index("by_region", ["region"])
    .index("by_verificationStatus", ["verificationStatus"]),

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
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_supplierId", ["supplierId"]),

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
  })
    .index("by_legacyId", ["legacyId"])
    .index("by_status", ["status"]),

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

  metadata: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});
