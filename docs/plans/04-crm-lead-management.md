# Plan 04 — CRM & Lead Management

**Phase:** 2 (Core Features)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth)
**Blocks:** Plan 08 (Client Quote Enhancements — negotiation loop)

---

## Goal

Build a full CRM module for producers: lead intake from multiple sources, Kanban-style pipeline, detailed client file with communication history, and lead-to-project conversion.

---

## Current State

- `ClientsPage.tsx` exists with basic CRUD (name, company, phone, email, status, notes)
- `convex/clients.ts` has list/get/create/update/remove
- No `leads` table or CRM pipeline
- No communication logging

---

## Implementation

### 1. Backend — Lead Functions

**File: `convex/leads.ts`** (new)

```ts
// Queries
list            — all leads, filterable by status/source/assignedTo
get             — single lead by _id
listByStatus    — leads grouped by pipeline stage (for Kanban)
stats           — count per status (for pipeline header badges)
search          — text search across name/phone/email

// Mutations
create          — create new lead (manual entry or webhook)
update          — update lead fields
updateStatus    — move lead through pipeline stages (+ auto-log in communications)
assignTo        — assign lead to a producer
convertToProject — create project from lead, link leadId↔projectId, update status
remove          — soft delete or archive
```

**File: `convex/leadCommunications.ts`** (new)

```ts
// Queries
listByLeadId    — all communications for a lead, sorted by createdAt desc

// Mutations
create          — log a call, whatsapp, email, note, or system event
```

### 2. CRM Pipeline Page (Kanban View)

**File: `src/app/components/crm/CRMPipeline.tsx`** (new)

Kanban board for lead lifecycle, similar to existing KanbanBoard but specialized:

```
┌──────────────────────────────────────────────────────────────────┐
│  CRM Pipeline                                    [+ ליד חדש]     │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │ ליד חדש  │ │  שיחה    │ │  בירור   │ │  בניית   │ │  הצעה  ││
│  │   (12)   │ │ ראשונה   │ │  צרכים   │ │  תוכנית  │ │  נשלחה ││
│  │          │ │   (5)    │ │   (3)    │ │   (2)    │ │  (4)   ││
│  │ ┌──────┐ │ │ ┌──────┐ │ │          │ │          │ │        ││
│  │ │ דני  │ │ │ │ רונה │ │ │          │ │          │ │        ││
│  │ │ FB   │ │ │ │ IG   │ │ │          │ │          │ │        ││
│  │ │ 20ppl│ │ │ │ 15ppl│ │ │          │ │          │ │        ││
│  │ └──────┘ │ │ └──────┘ │ │          │ │          │ │        ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                                  │
│  Drag & Drop between stages                                     │
└──────────────────────────────────────────────────────────────────┘
```

Features:
- 6 columns matching lead statuses: new → first_contact → needs_assessment → building_plan → quote_sent → approved/closed
- Drag & drop between columns (react-dnd, same pattern as KanbanBoard)
- Lead cards show: name, source icon, participant count, budget, days since creation
- Click card → navigate to lead detail page
- Header badges show count per column
- Filter bar: source, date range, assigned producer

### 3. Lead Card Component

**File: `src/app/components/crm/LeadCard.tsx`** (new)

```ts
interface LeadCardProps {
  lead: Lead;
  onDragStart: () => void;
}
```

Displays: name, source icon (FB/IG/TT/YT/WA/Tel), participant count, event type badge, time since creation, assigned producer avatar.

### 4. New Lead Modal

**File: `src/app/components/crm/NewLeadModal.tsx`** (new)

Form with fields per spec:
- שם מלא (required)
- טלפון
- אימייל
- מקור — dropdown: Facebook, Instagram, TikTok, YouTube, LinkedIn, WhatsApp, טלפון, ידני
- מס' משתתפים
- תאריך מבוקש
- תקציב
- סוג אירוע — dropdown: גיבוש, כנס, אירוע חברה, טיול, סמינר, etc.
- אזור בארץ — dropdown: צפון, מרכז, דרום, ירושלים, שרון, שפלה
- הערות חופשי

### 5. Lead Detail Page (Client File)

**File: `src/app/components/crm/LeadDetail.tsx`** (new)

Tabbed detail page:

```
┌─────────────────────────────────────────────────────┐
│  [Header: שם לקוח + סטטוס badge + מקור icon]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Tab 1: פרטי לקוח]                                 │
│  Editable form: all lead fields                     │
│                                                     │
│  [Tab 2: היסטוריית תקשורת — Timeline]               │
│  Vertical timeline of all communications            │
│  Each entry: date, type icon, content, author       │
│                                                     │
│  [Tab 3: הצעות מחיר]                                │
│  List of linked projects/quotes with status         │
│                                                     │
│  [Tab 4: מסמכים & קבצים]                            │
│  Uploaded files related to this lead                │
│                                                     │
│  [Action Buttons Bar]                               │
│  [📞 רשום שיחה] [💬 שלח הודעה] [📋 צור פרויקט]     │
│  [📎 צרף קובץ] [🔄 שנה סטטוס]                      │
└─────────────────────────────────────────────────────┘
```

### 6. Log Communication Modal

**File: `src/app/components/crm/LogCommunicationModal.tsx`** (new)

Modal for logging interactions:
- Type selector: שיחה טלפונית, WhatsApp, אימייל, הערה
- Content textarea
- Duration (for calls)
- Auto-stamps: createdBy, createdAt

### 7. Lead → Project Conversion

When a producer clicks "צור פרויקט" on a lead:
1. Create new project with lead's data (name, participants, budget, region, date)
2. Link project.leadId ↔ lead
3. Optionally create/link a client record
4. Update lead status to "building_plan"
5. Navigate to QuoteEditor for the new project

**Add to `convex/leads.ts`:**
```ts
convertToProject: mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    // Create project from lead data
    // Link leadId on project
    // Update lead status
    // Return projectId for navigation
  },
})
```

### 8. CRM Route Registration

**File: `src/app/routes.ts`** (modify)

Add to producer routes:
```ts
{ path: "/crm", element: CRMPipeline },
{ path: "/crm/:id", element: LeadDetail },
```

### 9. Integration with Existing ClientsPage

- `ClientsPage` continues to exist for managing confirmed clients
- When a lead converts to a project and the deal closes, a client record is auto-created or linked
- Add `leadId` column to clients table for traceability

---

## New Files

| File | Type |
|------|------|
| `convex/leads.ts` | Backend |
| `convex/leadCommunications.ts` | Backend |
| `src/app/components/crm/CRMPipeline.tsx` | Page |
| `src/app/components/crm/LeadCard.tsx` | Component |
| `src/app/components/crm/LeadDetail.tsx` | Page |
| `src/app/components/crm/NewLeadModal.tsx` | Component |
| `src/app/components/crm/LogCommunicationModal.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/routes.ts` | Add /crm and /crm/:id routes |
| `src/app/components/Layout.tsx` | Add CRM nav item to producer sidebar |
| `convex/projects.ts` | Accept optional leadId on create |
| `convex/clients.ts` | Accept optional leadId on create |
