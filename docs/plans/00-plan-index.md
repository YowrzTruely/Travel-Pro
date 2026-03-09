# TravelPro — Implementation Plan Index

Master plan to bring TravelPro to full MVP spec per `YOMKEF PRD.docx.md`.

Plans are ordered by **business priority** (not just technical dependency), matching the PRD's development priorities:
1. Supplier Module (Critical)
2. Proposal Builder (Critical)
3. CRM & Projects (High)
4. Field Operations (High)
5. Dashboard, Notifications & Digital Assets (Medium)

## Current State Summary

**Built:** Login/signup with 3-role auth (admin/producer/supplier), role-gated routing, supplier self-registration, 3-stage progressive onboarding, supplier pending approval flow, Dashboard, Projects list, QuoteEditor, SupplierBank (list+map), SupplierDetail (4 tabs), ImportWizard, ClassificationWizard, ClientsPage, DocumentsPage, CalendarPage, ClientQuote (public), KanbanBoard (no route), GlobalSearch, NotificationsPanel. Schema expanded with 25+ tables (4-tier pricing, volume pricing, leads, bookings, field ops, etc.). Shared supplier constants (8 categories, 11 regions).

**Not built:** Supplier product management UI (Plan 03), supplier documents/compliance (Plan 04), supplier public profile (Plan 05), quote editor enhancements (Plan 06), availability+booking workflow (Plan 07), client proposal enhancements (Plan 08), supplier orders/invoicing (Plan 09), CRM pipeline (Plan 10), field operations HQ (Plan 11), role-specific dashboards (Plan 12), notifications backend (Plan 13), digital assets (Plan 14), cross-system polish (Plan 15).

---

## Implementation Phases

### Phase 1: Foundation — COMPLETE

| # | Plan | Status | Description |
|---|------|--------|-------------|
| 01 | [Data Model Expansion](./01-data-model-expansion.md) | **DONE** | 25+ tables in schema, 4-tier + volume pricing, all CRUD stubs |
| 02 | [Multi-Role Auth & Supplier Registration](./02-multi-role-auth.md) | **DONE** | 3 roles, role-gated routing, self-registration, 3-stage onboarding, shared constants (8 categories, 11 regions) |

### Phase 2: Supplier Module (PRD Priority #1 — Critical)

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 03 | [Supplier Profile & Products](./03-supplier-profile-products.md) | 4-tier pricing with volume pricing, product gallery, equipment/gear, timing, 11 regions, 8 categories (closed list), AI cleanup + descriptions from URL, AI-assisted onboarding | Supplier portal pages + backend |
| 04 | [Supplier Documents & Compliance](./04-supplier-documents-compliance.md) | Document types, expiry 7-day-timer, "I don't have it" reminders, post-deal insurance | Documents page + cron jobs |
| 05 | [Supplier Public Profile & Promotions](./05-supplier-public-profile.md) | "How I look" preview, promotions board, star ratings, public profile page | New pages + public routes |

### Phase 3: Proposal Builder (PRD Priority #2 — Critical)

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 06 | [Quote Editor Enhancements](./06-quote-editor-enhancements.md) | Trip name + AI opening paragraph, 4-tier pricing with volume, equipment aggregation, visual timeline (hideable), upsells, 2-4 alternatives, price toggle, margin calculator | Extend QuoteEditor |
| 07 | [Availability & Booking Workflow](./07-availability-booking-workflow.md) | Multi-channel notifications (WhatsApp+SMS+email), unregistered supplier flow, booking/reservation with expiry | New workflow + UI |
| 08 | [Client Proposal Page](./08-client-proposal-page.md) | Client alternative selection, "share without prices", digital signature, upsells, version management | Extend ClientQuote |
| 09 | [Supplier Orders & Invoicing](./09-supplier-orders-invoicing.md) | Auto-generate orders per supplier, custom order formats, invoice tracking, archive gate | New module |

### Phase 4: CRM & Projects (PRD Priority #3 — High)

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 10 | [CRM Pipeline & Lead Management](./10-crm-pipeline.md) | Mandatory loss reason, auto-create client, lead sources per PRD, pipeline Kanban | New CRM module |

### Phase 5: Field Operations (PRD Priority #4 — High)

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 11 | [Field Operations HQ (חמ"ל שטח)](./11-field-operations.md) | Planned vs actual times, quantity updates, time-shift button, supplier signatures, road expenses | New mobile-first module |

### Phase 6: Dashboard, Notifications & Digital Assets (PRD Priority #5 — Medium)

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 12 | [Dashboards & Morning HQ](./12-dashboards-morning-hq.md) | Morning HQ widget, event-day headcount check with supplier alerts, quote heat meter, urgent alerts, drag-drop widgets, supplier+admin dashboards | Dashboard rewrites |
| 13 | [Notifications System](./13-notifications-system.md) | Multi-channel MVP (WhatsApp Business API + SMS + email), document expiry cron, reservation alerts | Backend + panel rewrite |
| 14 | [Digital Assets & Gallery](./14-digital-assets-gallery.md) | Save the Date, equipment list PDF, driver trip file, client trip file, post-event gallery (producer + participant uploads), B2C lead capture, participant ratings | New module |

### Phase 7: Post-MVP & Stretch

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 15 | [Cross-System Polish](./15-cross-system-polish.md) | Supplier recommendations, duplicate detection, travel time, responsive polish, AI integrations (Gemini Flash), payment system integration, settings | Stretch features |

---

## Removed from MVP (per PRD Section 10)

| Feature | Reason |
|---------|--------|
| In-app messaging system (chat) | PRD uses WhatsApp/SMS/email, not in-app chat |
| Standalone Kanban board | Not mentioned in PRD as standalone feature |
| Team management | Not mentioned in PRD |
| Google Calendar sync | PRD explicitly excludes from MVP |
| Payment & commission system | PRD Priority #6, explicitly post-MVP |
| Mobile app (App Store/Play) | PRD states Web App only |
| B2C customer flow | PRD defers to later |
| Canva API integration | PRD defers to later |
| ManyChat integration | PRD defers to later |

---

## Dependency Graph

```
Phase 1 (Foundation)
  01 Data Model ─────┐
  02 Multi-Role Auth ─┤
                      ▼
Phase 2 (Supplier Module — PRD #1)
  03 Supplier Profile & Products ──┐
  04 Supplier Documents ───────────┤
  05 Supplier Public Profile ──────┤
                                   ▼
Phase 3 (Proposal Builder — PRD #2)
  06 Quote Editor Enhancements ───────┐
  07 Availability & Booking ──────────┤  (depends on 03 + 06)
  08 Client Proposal Page ────────────┤  (depends on 06 + 07)
  09 Supplier Orders & Invoicing ─────┤  (depends on 07 + 08)
                                      ▼
Phase 4 (CRM — PRD #3)
  10 CRM Pipeline ────────────────────┤  (depends on 01 + 02)
                                      ▼
Phase 5 (Field Operations — PRD #4)
  11 Field Operations HQ ────────────┤  (depends on 09)
                                      ▼
Phase 6 (Dashboard & Assets — PRD #5)
  12 Dashboards & Morning HQ ────────┐
  13 Notifications System ────────────┤  (depends on all above)
  14 Digital Assets & Gallery ────────┤
                                      ▼
Phase 7 (Post-MVP)
  15 Cross-System Polish ─────────────┘
```

---

## PRD Traceability

| PRD Section | Plans |
|-------------|-------|
| §3 Supplier Module | 03, 04, 05 |
| §4 Proposal Builder | 06, 07, 08, 09 |
| §5 CRM & Leads | 10 |
| §6 Field Operations | 11 |
| §7 Digital Assets | 14 |
| §8 Dashboard & UI | 12 |
| §9 Technical Requirements | 01, 02, 13, 15 (AI + payments) |
| §10 Not in MVP | Removed features list above |

---

## Conventions

- **All UI is Hebrew RTL** (`dir="rtl"`)
- **Backend**: Convex functions in `convex/`, queries/mutations only (no actions unless external API needed)
- **Frontend**: React 18 + TypeScript, Tailwind v4, shadcn/ui components from `src/app/components/ui/`
- **State**: `useQuery` / `useMutation` from `convex/react` — no API client layer
- **Forms**: `react-hook-form` with `FormField` / `FormSelect` from `src/app/components/FormField.tsx`
- **Toasts**: `appToast.success()` / `appToast.error()` from `AppToast.tsx`
- **IDs**: Convex `_id` internally, `legacyId` for URL routing where applicable
- **Path alias**: `@` → `./src`
- **Linting**: After every change run `bun lint && bun tsc && bun ultracite`
