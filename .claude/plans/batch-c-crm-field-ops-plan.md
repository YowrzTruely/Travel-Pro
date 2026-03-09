# Batch C Execution Plan — CRM + Field Ops (Plans 10, 11) ✅ COMPLETE

## Context

Batch C implements two independent features in parallel: CRM Pipeline (Plan 10) and Field Operations HQ (Plan 11). Batches A and B are complete. Backend schemas and basic CRUD already exist for both — the work is primarily frontend components + extending backend functions.

## Approach

Run Plan 10 and Plan 11 as **parallel subagents** per the batch prompt. Each agent reads its plan file, implements all components, extends backend, wires routes/nav, and verifies with lint/tsc/ultracite.

---

## Plan 10 — CRM Pipeline & Lead Management

### Backend Extensions (`convex/leads.ts`)
- Add `listByStatus` query (group leads by status for Kanban)
- Add `stats` query (count per status for column badges)
- Add `convertToProject` mutation (creates client + project, links lead bidirectionally)
- Extend `convex/clients.ts` and `convex/projects.ts` to accept optional `leadId`

### Frontend Components (all in `src/app/components/crm/`)
- `LeadsPage.tsx` — Kanban board with 8 status columns, react-dnd drag-drop (pattern from `KanbanBoard.tsx`)
- `NewLeadModal.tsx` — Form with source dropdown (9 options), contact info, event details (pattern from `EventFormModal.tsx`)
- `LeadDetail.tsx` — Full lead view with details tab, communication history, status tracking
- `LeadCard.tsx` — Compact card for Kanban columns (source icon, budget, days since creation)
- `LossReasonModal.tsx` — Mandatory when dragging to closed_lost (4 reason options)
- `LogCommunicationModal.tsx` — Add call/whatsapp/email/sms/note entries

### Integration
- Add CRM routes to producer router (`/crm`, `/crm/:id`) in `src/app/routes.ts`
- Add CRM nav item to producer sidebar in `Layout.tsx`
- Add `Lead` and `LeadCommunication` interfaces to `data.ts`

### Key Patterns to Reuse
- `KanbanBoard.tsx` — react-dnd column/card pattern
- `EventFormModal.tsx` — modal + react-hook-form pattern
- `ClientsPage.tsx` — list page with CRUD pattern
- `appToast` for notifications
- `useQuery`/`useMutation` with `"skip"` for conditional queries

---

## Plan 11 — Field Operations HQ

### Backend Extensions
- `convex/fieldOperations.ts` — Add `startOperation`, `completeOperation` mutations
- `convex/fieldOperationStops.ts` — Add `startStop`, `endStop`, `updateQuantity`, `saveSignature` mutations, `shiftTimes` mutation (shift remaining stops by N minutes)
- `convex/roadExpenses.ts` — Already has CRUD, may need category enum
- Stub WhatsApp notification on quantity change for food suppliers

### Frontend Components (all in `src/app/components/field/`)
- `FieldOperationsHQ.tsx` — Full-screen mobile-first view, scrollable stops timeline, event header
- `FieldStop.tsx` — Per-stop card: planned vs actual times/quantity, status indicators, start/end/signature buttons
- `TimeShiftModal.tsx` — Shift remaining schedule by N minutes with preview
- `SignaturePad.tsx` — HTML5 Canvas signature (pattern from `ClientQuoteSignature.tsx`)
- `RoadExpenseForm.tsx` — Description, amount, category dropdown, camera receipt capture
- `FieldSummary.tsx` — Post-event summary: time deltas, quantity comparison, signatures, expenses

### Integration
- Add route `/field/:projectId` to producer router in `src/app/routes.ts`
- All components use large touch targets (min 44px), mobile-first layout
- Use `useImageUpload` hook for receipt photos and signatures

### Key Patterns to Reuse
- `ClientQuoteSignature.tsx` — Canvas drawing, touch events, blob upload
- `useImageUpload.ts` — File storage upload flow
- `use-mobile.ts` — Mobile detection
- `appToast` for notifications

---

## Verification

After both plans complete:
```bash
bun lint && bun tsc && bun ultracite
```
Fix any errors before considering work complete.

## Critical Files
- `convex/schema.ts` — Already has all needed tables (leads, leadCommunications, fieldOperations, fieldOperationStops, roadExpenses)
- `src/app/routes.ts` — Add CRM + field routes
- `src/app/components/Layout.tsx` — Add CRM nav item
- `src/app/components/data.ts` — Add Lead interface
- `convex/leads.ts` — Extend with listByStatus, stats, convertToProject
- `convex/fieldOperations.ts` — Extend with start/complete
- `convex/fieldOperationStops.ts` — Extend with start/end/shift
