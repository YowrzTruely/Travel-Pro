# Plan 04 — Supplier Documents & Compliance

**Phase:** 2 (Supplier Module — PRD Priority #1)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth)
**Blocks:** Plan 07 (Availability & Booking — compliance checks)
**PRD refs:** §3.4 (Document Management & Insurance)

---

## Goal

Build document management for suppliers with specific document types (insurance 3rd party + employer, business license, kosher cert), expiry 7-day-timer alerts, "I don't have it" option with reminder every 2 days, and post-first-deal insurance requirement.

---

## Current State

- `supplierDocuments` table exists with basic CRUD in `convex/supplierDocuments.ts`
- SupplierDetail has a "מסמכים" tab showing uploaded documents
- No document type classification
- No expiry tracking or alerts
- No compliance enforcement (e.g., post-deal insurance requirement)

---

## Implementation

### 1. Document Types & Requirements (PRD §3.4)

**Document types:**
| Document | Hebrew | When Required | Expiry Tracked |
|----------|--------|---------------|----------------|
| 3rd Party Insurance | ביטוח צד ג' | After first deal (mandatory) | Yes — 7-day warning |
| Employer Liability Insurance | ביטוח חבות מעבידים | After first deal (mandatory) | Yes — 7-day warning |
| Business License | רישיון עסק | Recommended | Yes — 7-day warning |
| Kosher Certificate | תעודת כשרות | If food-related category — yes/no toggle: if "כן" → upload immediately + alerts | Yes — 7-day warning |

### 2. My Documents Page (Supplier View)

**File: `src/app/components/supplier/MyDocuments.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  המסמכים שלי                         [+ העלאת מסמך]  │
│                                                     │
│  צ'קליסט מסמכים נדרשים:                              │
│  ┌────────────────────────────────────────────┐     │
│  │ ☑ ביטוח צד ג'     | תקף עד 12/2026 | ✅   │     │
│  │ ☑ ביטוח חבות מעב. | תקף עד 06/2026 | 🟡   │     │
│  │ ☐ רישיון עסק      | לא הועלה       | ⚠️   │     │
│  │   [אין לי ↗]                               │     │
│  │ ☐ תעודת כשרות     | לא הועלה       | ⚠️   │     │
│  │   [אין לי ↗]                               │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  [Uploaded Documents Table]                          │
│  שם | סוג | תוקף | סטטוס | [צפה] [עדכן] [מחק]     │
└─────────────────────────────────────────────────────┘
```

Features:
- Predefined document types checklist per PRD §3.4
- Status indicators: ✅ valid (>30 days), 🟡 expiring soon (≤30 days), 🔴 expired, ⚠️ missing
- Upload modal: select document type → upload file → set expiry date
- **"אין לי" (I don't have it)** button: marks document as acknowledged-missing, triggers reminder cron
- Color-coded expiry: green (>30 days), yellow (≤30 days), red (expired)
- Kosher cert row only shown for suppliers in "food" category
- Kosher cert has a **yes/no toggle** ("תעודת כשרות - כן/לא"): if "כן" → immediately prompt to upload + enable expiry alerts; if "לא" → skip row

### 3. "I Don't Have It" Flow (PRD §3.4)

When supplier clicks "אין לי":
1. Record timestamp of acknowledgment
2. Start 2-day reminder cycle
3. System sends reminder every 2 days: "תזכורת: עדיין לא הועלה {document type}"
4. Does NOT block the supplier — just nags

**Schema addition to `supplierDocuments`:**
```ts
// Add fields:
acknowledged: v.optional(v.boolean()),      // "I don't have it" clicked
acknowledgedAt: v.optional(v.number()),
lastReminderAt: v.optional(v.number()),
reminderCount: v.optional(v.number()),
```

### 4. 7-Day Expiry Timer (PRD §3.4)

**File: `convex/crons.ts`** (new or extend)

Daily cron job that:
1. Queries all supplier documents with expiry dates
2. Documents expiring within 7 days → create notification for supplier
3. Documents already expired → create notification for supplier + linked producers
4. Documents with "I don't have it" + last reminder >2 days ago → send reminder
5. Deduplicates (don't re-notify for already-notified docs)

```ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "check-document-expiry",
  { hourUTC: 6, minuteUTC: 0 },  // 9:00 Israel time
  internal.supplierDocuments.checkExpiry
);

crons.daily(
  "send-document-reminders",
  { hourUTC: 7, minuteUTC: 0 },  // 10:00 Israel time
  internal.supplierDocuments.sendReminders
);

export default crons;
```

### 5. Post-First-Deal Insurance Requirement (PRD §3.1 Stage 3)

When a project involving this supplier closes (status → "completed"):
1. Check if supplier has uploaded insurance documents
2. If not: show prominent banner on supplier dashboard + MyDocuments
3. Send notification: "סגרת עסקה ראשונה! יש להעלות ביטוח צד ג' וביטוח חבות מעבידים"
4. Block further booking requests until insurance uploaded (soft block — warning, not hard block)

**File: `convex/supplierDocuments.ts`** (extend)

```ts
checkExpiry: internalMutation({
  // Called by cron — check all docs for expiry
})

sendReminders: internalMutation({
  // Called by cron — send "I don't have it" reminders
})

checkInsuranceCompliance: query({
  args: { supplierId: v.id("suppliers") },
  // Returns { hasThirdPartyInsurance, hasEmployerInsurance, hasCompletedDeal, compliant }
})

markAcknowledgedMissing: mutation({
  args: { supplierId: v.id("suppliers"), documentType: v.string() },
  // Record "I don't have it" acknowledgment
})
```

### 6. Producer View — Document Alerts

Enhance SupplierDetail's "מסמכים" tab to show compliance status:

**File: `src/app/components/SupplierDetail.tsx`** (modify)

Add to documents tab:
- Compliance badge on supplier: ✅ compliant / ⚠️ missing docs / 🔴 expired docs
- Inline warnings for expired/missing documents
- Alert if insurance is required (post-deal) but missing

---

## New Files

| File | Type |
|------|------|
| `src/app/components/supplier/MyDocuments.tsx` | Page |
| `convex/crons.ts` | Scheduled jobs |

## Modified Files

| File | Changes |
|------|---------|
| `convex/supplierDocuments.ts` | Add checkExpiry, sendReminders, checkInsuranceCompliance, markAcknowledgedMissing |
| `convex/schema.ts` | Add acknowledged/reminder fields to supplierDocuments (Plan 01) |
| `src/app/components/SupplierDetail.tsx` | Compliance badges on documents tab |
