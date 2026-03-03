# TravelPro — Implementation Plan Index

Master plan to bring TravelPro from ~60% MVP to full spec per `תרשים זרימה.md`.

## Current State Summary

**Built:** Login/signup (single role), Dashboard, Projects list, QuoteEditor, SupplierBank (list+map), SupplierDetail (4 tabs), ImportWizard, ClassificationWizard, ClientsPage, DocumentsPage, CalendarPage, ClientQuote (public), KanbanBoard (no route), GlobalSearch, NotificationsPanel.

**Not built:** Multi-role auth, CRM/leads, supplier self-service portal, messaging, notifications backend, availability workflow, product add-ons, team management, and more.

---

## Implementation Phases

Phases are ordered by dependency — each phase builds on the previous ones.

### Phase 1: Foundation

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 01 | [Data Model Expansion](./01-data-model-expansion.md) | New schema tables + extend existing ones | `convex/schema.ts` + migrations |
| 02 | [Multi-Role Auth & Onboarding](./02-multi-role-auth.md) | 3 user roles (admin/producer/supplier), role-gated routing, onboarding flows | Auth, routing, Layout |

### Phase 2: Core Features

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 03 | [Role-Based Dashboards](./03-role-based-dashboards.md) | Separate dashboards for admin, producer, supplier | 3 new page components |
| 04 | [CRM & Lead Management](./04-crm-lead-management.md) | Lead intake, pipeline Kanban, client file with communication history | New module, ~8 components |
| 05 | [Supplier Portal](./05-supplier-portal.md) | Supplier self-service: products, documents, availability calendar | New portal layout + pages |

### Phase 3: Business Logic

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 06 | [Quote Editor Enhancements](./06-quote-editor-enhancements.md) | Add-ons, alternatives, margin calculator, availability status per item | Extend existing QuoteEditor |
| 07 | [Availability Workflow](./07-availability-workflow.md) | Producer→Supplier availability requests, response flow, alternative proposals | New workflow + UI on both sides |
| 08 | [Client Quote Page Enhancements](./08-client-quote-enhancements.md) | "Request changes" flow, per-item feedback, negotiation loop | Extend ClientQuote |

### Phase 4: Communication

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 09 | [Messaging System](./09-messaging-system.md) | In-app chat: direct, project-threaded, producer↔client post-approval | New module, ~6 components |
| 10 | [Notifications System](./10-notifications-system.md) | In-app bell, email, SMS, WhatsApp triggers | Backend + NotificationsPanel rewrite |

### Phase 5: Integration & Polish

| # | Plan | Description | Estimated Scope |
|---|------|-------------|-----------------|
| 11 | [Kanban & Task Integration](./11-kanban-integration.md) | Route Kanban, link tasks to projects, auto-create tasks on approval | Extend KanbanBoard |
| 12 | [Team Management](./12-team-management.md) | Teams, member assignment, permission system | New admin pages |
| 13 | [Cross-System Polish](./13-cross-system-polish.md) | PDF export, supplier recommendations, duplicate detection, travel time, Google Calendar sync | Stretch features |

---

## Dependency Graph

```
Phase 1 (Foundation)
  01 Data Model ─────┐
  02 Multi-Role Auth ─┤
                      ▼
Phase 2 (Core Features)
  03 Role Dashboards ─────┐
  04 CRM & Leads ─────────┤
  05 Supplier Portal ──────┤
                           ▼
Phase 3 (Business Logic)
  06 Quote Enhancements ──────┐
  07 Availability Workflow ────┤  (depends on 05 + 06)
  08 Client Quote Enhance. ────┤  (depends on 06 + 07)
                               ▼
Phase 4 (Communication)
  09 Messaging ────────────────┐
  10 Notifications ─────────────┤  (depends on all above)
                                ▼
Phase 5 (Integration & Polish)
  11 Kanban Integration ────────┐
  12 Team Management ────────────┤
  13 Cross-System Polish ────────┘
```

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
