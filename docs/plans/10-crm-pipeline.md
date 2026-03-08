# Plan 10 — CRM Pipeline & Lead Management

**Phase:** 4 (CRM & Projects — PRD Priority #3)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth)
**Blocks:** None directly
**PRD refs:** §5.1 (Lead Intake), §5.2 (Client File), §5.3 (Project Management)

---

## Goal

Build a full CRM module for producers: lead intake from multiple sources per PRD, Kanban-style pipeline, detailed client file with communication history, mandatory loss reason tracking, auto-create client record, and lead-to-project conversion.

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
create          — create new lead (manual or webhook)
                  → auto-creates client record (PRD §5.1)
update          — update lead fields
updateStatus    — move lead through pipeline stages
                  → if "closed_lost": require lossReason (PRD §5.2)
assignTo        — assign lead to a producer
convertToProject — create project from lead, link leadId↔projectId
remove          — soft delete or archive
```

### 2. Lead Sources (PRD §5.1)

Lead intake channels per PRD:
- Facebook
- Instagram
- TikTok
- YouTube
- LinkedIn
- WhatsApp
- Phone (טלפון)
- Manual (ידני)
- Website (דף נחיתה)
- Direct link (קישור ישיר)

Each lead automatically creates a client record (PRD §5.1: "לידים נכנסים לתיק לקוח אוטומטי — לא דורש מילוי ידני").

### 3. CRM Pipeline Page (Kanban View)

**File: `src/app/components/crm/CRMPipeline.tsx`** (new)

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
│  │ │ ₪50K │ │ │ │ ₪30K │ │ │          │ │          │ │        ││
│  │ └──────┘ │ │ └──────┘ │ │          │ │          │ │        ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                                  │
│  Drag & Drop between stages                                     │
│  ┌──────────┐ ┌──────────┐                                      │
│  │  נסגר ✅  │ │ הופסד ❌  │                                      │
│  │   (8)    │ │   (3)    │                                      │
│  └──────────┘ └──────────┘                                      │
└──────────────────────────────────────────────────────────────────┘
```

Features:
- 8 columns matching lead statuses
- Drag & drop between columns (react-dnd)
- **When dragging to "הופסד"**: mandatory loss reason modal (PRD §5.2)
- Lead cards show: name, source icon, participant count, budget, days since creation
- Filter bar: source, date range, assigned producer
- Header badges show count per column

### 4. Mandatory Loss Reason (PRD §5.2)

**File: `src/app/components/crm/LossReasonModal.tsx`** (new)

When lead moves to "closed_lost":

```
┌────────────────────────────────────┐
│  סיבת הפסד (חובה)                  │
│                                    │
│  ○ יקר מדי                         │
│  ○ מתחרה אחר                      │
│  ○ נעלם / לא עונה                  │
│  ○ אחר: ___________               │
│                                    │
│  הערות: ___________                │
│                                    │
│  [שמור]  [ביטול]                    │
└────────────────────────────────────┘
```

This is mandatory per PRD — "נדרש לדשבורד בינה עסקית BI". Cannot close as lost without selecting a reason.

### 5. New Lead Modal

**File: `src/app/components/crm/NewLeadModal.tsx`** (new)

```
┌────────────────────────────────────┐
│  ליד חדש                           │
│                                    │
│  שם מלא: ___________  (חובה)      │
│  טלפון: ___________               │
│  אימייל: ___________              │
│  חברה: ___________                │
│  מקור: [dropdown — PRD sources]   │
│  מס' משתתפים: ____                │
│  תאריך מבוקש: [date picker]       │
│  טווח תאריכים: [date range]       │
│  תקציב: ₪ ____                    │
│  אזור: [dropdown — 11 regions]    │
│  העדפות: ___________              │
│  הערות: ___________               │
│                                    │
│  [צור ליד]                         │
└────────────────────────────────────┘
```

On create: auto-creates client record linked to lead.

### 6. Lead Detail Page (Client File — PRD §5.2)

**File: `src/app/components/crm/LeadDetail.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  [Header: שם לקוח + סטטוס badge + מקור icon]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Tab 1: פרטי לקוח]                                 │
│  Editable form: all lead + client fields             │
│  צרכים: משתתפים, תאריך, תקציב, אזור, העדפות        │
│                                                     │
│  [Tab 2: היסטוריית תקשורת — Timeline]               │
│  Vertical timeline of all communications             │
│  Each entry: date, type icon, content, author        │
│                                                     │
│  [Tab 3: הצעות מחיר]                                │
│  List of linked projects/quotes with status          │
│  Version history (V1, V2, V3)                       │
│                                                     │
│  [Tab 4: מסמכים & קבצים]                            │
│  Uploaded files related to this lead                 │
│                                                     │
│  [Action Buttons Bar]                               │
│  [📞 רשום שיחה] [📋 צור פרויקט] [🔄 שנה סטטוס]    │
└─────────────────────────────────────────────────────┘
```

**Status flow per PRD §5.2:**
```
חדש → נשלחה הצעה → בדיון → נסגר ✅ → פרויקט בביצוע
                           → הופסד ❌ (+ סיבה חובה)
```

### 7. Lead → Project Conversion

When producer clicks "צור פרויקט":
1. Create project with lead's data (name, participants, budget, region, date)
2. Link `project.leadId` ↔ `lead.projectId`
3. Auto-link or create client record
4. Update lead status to "building_plan"
5. Navigate to QuoteEditor for the new project

### 8. Communication Logging

**File: `src/app/components/crm/LogCommunicationModal.tsx`** (new)

```
┌────────────────────────────────────┐
│  רשום תקשורת                       │
│                                    │
│  סוג: ○ שיחה ○ WhatsApp ○ אימייל  │
│       ○ הערה                       │
│  תוכן: ___________                │
│  משך (לשיחות): ____ דקות          │
│                                    │
│  [שמור]                            │
└────────────────────────────────────┘
```

### 9. Routes

Add to producer routes:
```ts
{ path: "/crm", element: CRMPipeline },
{ path: "/crm/:id", element: LeadDetail },
```

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
| `src/app/components/crm/LossReasonModal.tsx` | Component |
| `src/app/components/crm/LogCommunicationModal.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/routes.ts` | Add /crm and /crm/:id routes |
| `src/app/components/Layout.tsx` | Add CRM nav item to producer sidebar |
| `convex/projects.ts` | Accept optional leadId on create |
| `convex/clients.ts` | Accept optional leadId on create, auto-create on lead intake |
