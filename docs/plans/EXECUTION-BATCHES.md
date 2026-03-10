# Execution Batches — Plans 03–15

Run each batch as a single session. Copy the prompt paragraph into Claude Code to execute.

**Order:** A → B → C → D → E

---

## Batch A — Supplier Module (Plans 03, 04, 05) — PARALLEL

Three independent plans, no dependencies between them. Run all three as parallel agents.

### Prompt

> Implement Plans 03, 04, and 05 from `docs/plans/` in parallel using subagents. Read each plan file fully before starting.
>
> **Plan 03 (Supplier Profile & Products):** Build the supplier-facing product management system. Create `src/app/components/supplier/MyProducts.tsx` (list all products for current supplier, card/list toggle), `src/app/components/supplier/SupplierProductEditor.tsx` (full product form with 4-tier pricing from `supplierConstants.ts`, volume pricing above quantity X, gross/net time, equipment requirements, capacity, upsells/addons section, AI description button stub, image gallery upload), `src/app/components/supplier/SupplierProfile.tsx` (profile editing: business name, contact, category multi-select from closed list with max 3 without admin approval, regions multi-select, address with Leaflet map, operating hours, seasonal availability, websiteUrl, facebookUrl, default margin), `src/app/components/supplier/AvailabilityCalendar.tsx` (monthly calendar where suppliers mark dates available/unavailable using `supplierAvailability` table). Create `convex/aiSupplier.ts` as a Convex action with stub functions `generateMarketingDescription` (accepts websiteUrl, returns shortDescription + longDescription) and `cleanProductImage`. Extend `convex/supplierProducts.ts` to handle the new 4-tier + volume pricing fields, timing, equipment. Extend `convex/productAddons.ts` with full CRUD. Wire all new pages into the supplier router in `src/app/routes.ts`. Use shared constants from `src/app/components/constants/supplierConstants.ts` for categories and regions everywhere.
>
> **Plan 04 (Supplier Documents & Compliance):** Build supplier document management. Create `src/app/components/supplier/MyDocuments.tsx` with a predefined document types checklist (ביטוח צד ג', ביטוח חבות מעבידים, רישיון עסק, תעודת כשרות). Show status indicators (valid >30 days green, expiring ≤30 days yellow, expired red, missing warning). Kosher cert row only for food category suppliers with a yes/no toggle — if yes, prompt upload immediately. Implement "אין לי" (I don't have it) button that records acknowledgment and starts 2-day reminder cycle without blocking the supplier. Extend `convex/supplierDocuments.ts` with `checkExpiry`, `sendReminders`, `checkInsuranceCompliance`, `markAcknowledgedMissing` functions. Create `convex/crons.ts` with daily cron jobs: `check-document-expiry` at 9:00 Israel time and `send-document-reminders` at 10:00 Israel time. Add compliance badges to `SupplierDetail.tsx` documents tab. Wire `MyDocuments` into supplier router.
>
> **Plan 05 (Supplier Public Profile & Promotions):** Build supplier public profile and promotions. Create `src/app/components/supplier/SupplierPreview.tsx` ("כך אני נראה בעיני מפיק / לקוח" preview with producer/client view toggle, missing fields nudge at bottom linking to edit sections). Create `src/app/components/supplier/SupplierPromotions.tsx` (manage time-limited promotions that don't change base price, shown in filtering). Create `src/app/components/supplier/SupplierRatings.tsx` (view ratings 1-5 from producer field feedback, future sources: client surveys + Google Business). Create `src/app/components/supplier/PublicSupplierProfile.tsx` as a public page at `/supplier/:id/public` (no auth, shows list price only, marketing description, products, active promotions, ratings). Wire into public router in `App.tsx`. Extend `convex/supplierPromotions.ts` with `listActive` query for filtering. Add promotion badges to `SupplierSearch.tsx`. Wire supplier pages into supplier router.
>
> After all three, run `bun lint && bun tsc && bun ultracite` and fix any errors.

---

## Batch B — Proposal Builder (Plans 06, 07, 08, 09) — SEQUENTIAL

06 first, then 07 and 08 can overlap, then 09 last.

### Prompt B1 — Plan 06 (Quote Editor Enhancements)

> Implement Plan 06 from `docs/plans/06-quote-editor-enhancements.md`. Read it fully first.
>
> Enhance `QuoteEditor.tsx` with: (1) Trip name + AI-generated opening paragraph section at top (stub AI call, editable text area), (2) Enhanced pricing summary showing supplier cost, addons total, client price, gross profit, margin %, price per participant with a visual profit bar. Enhance `ItemEditor.tsx` with: (1) 4-tier pricing fields (list/direct/producer/client) auto-filled from `supplierProducts` when supplier+product selected, with volume pricing auto-applied based on participant count, default 20% margin on producer price, (2) Upsells section below pricing showing checkboxes for `productAddons` of the selected product with prices, stored in `quoteItems.selectedAddons`, (3) Equipment requirements display from product, (4) Gross/net time display. Add equipment list aggregation section to `QuoteEditor.tsx` (deduplicated across all items, showing which activities need each item). Enhance the timeline section with a hide/show toggle ("הסתר לפני שליחה") and gross/net time per activity. Create `src/app/components/AlternativesModal.tsx` (search same-category suppliers, select 2-4 alternatives with pricing, stored in `quoteItems.alternativeItems`). Add `findAlternatives` query to `convex/suppliers.ts`. Add per-item availability status badges (not_checked/pending/approved/declined). Add action buttons bar: send to client, save draft, export PDF placeholder, share without prices. Update `convex/quoteItems.ts` to handle all new fields. Run `bun lint && bun tsc && bun ultracite`.

### Prompt B2 — Plans 07 + 08 (Availability + Client Proposal) — PARALLEL

> Implement Plans 07 and 08 from `docs/plans/` in parallel using subagents. Read each plan file fully.
>
> **Plan 07 (Availability & Booking Workflow):** Build the full availability request and booking system. Implement `convex/availabilityRequests.ts` with full mutations: `create` (creates request with status pending, updates quoteItem.availabilityStatus), `respond` (approve/decline/alternative_proposed, if approved auto-create booking, if declined auto-suggest alternatives from same category via `findAlternatives`), `createBulk` (batch check all unchecked items). Create `convex/notificationSender.ts` as a Convex action with stub `sendAvailabilityRequest` that logs the message (WhatsApp/SMS/email channels — actual integration later). Implement `convex/bookings.ts` with `create` (with expiry timer), `confirm`, `cancel` (notify supplier), `checkExpired` internal mutation. Add `check-booking-expiry` hourly cron to `convex/crons.ts`. Create `src/app/components/supplier/RequestsPage.tsx` (tabs: pending requests, active bookings, history; approve/decline/propose alternative actions). Create `src/app/components/AlternativeProposalCard.tsx` (shown on quote item when supplier proposes alternative). Add availability summary bar to QuoteEditor top. Wire RequestsPage into supplier router.
>
> **Plan 08 (Client Proposal Page):** Enhance `ClientQuote.tsx` with: (1) Activity cards showing image, time, AI marketing description, equipment (NO supplier names per PRD), (2) Upsell checkboxes per item that client can toggle via `publicQuote.toggleUpsell`, (3) Alternative selection radio buttons per item via `publicQuote.selectAlternative`, (4) Visual timeline (if not hidden by producer). Create `src/app/components/ClientQuoteSignature.tsx` (HTML5 Canvas signature drawing, saves to Convex file storage, stores digitalSignatureId on project). Implement "share without prices" mode (`/quote/:id?mode=noPrices`). Create `src/app/components/ClientQuoteChangeRequest.tsx` (client marks items to change with reasons). Add version management to QuoteEditor (V1/V2/V3 tabs, duplicate version button, version stored in projects.quoteVersion). Add post-approval confirmation screen. Update `convex/publicQuote.ts` with `selectAlternative`, `toggleUpsell`, `requestChanges`, signature storage mutations.
>
> Run `bun lint && bun tsc && bun ultracite` after both complete.

### Prompt B3 — Plan 09 (Supplier Orders & Invoicing)

> Implement Plan 09 from `docs/plans/09-supplier-orders-invoicing.md`. Read it fully first.
>
> Build the supplier orders and invoicing module. After a deal closes (project status → approved/confirmed), auto-generate a `supplierOrders` record for each booked supplier with: client name, date, time, participants, agreed price, contact info. Create `src/app/components/orders/SupplierOrdersPanel.tsx` (list orders per project, show status, support custom order format flag per supplier from their profile). Create `src/app/components/orders/InvoiceTracker.tsx` (per project: list all suppliers, invoice upload per supplier, status tracking pending/received/verified). Implement archive gate: project cannot move to "archived" status until all supplier invoices are received — show warning with missing invoices list. Extend `convex/supplierOrders.ts` with `generateForProject` mutation (creates orders for all booked suppliers), `sendOrder` (marks as sent), `markCompleted`. Extend `convex/invoiceTracking.ts` with `uploadInvoice`, `verify`, `checkAllReceived` query. Wire into project detail view. Run `bun lint && bun tsc && bun ultracite`.

---

## Batch C — CRM + Field Ops (Plans 10, 11) — PARALLEL

No dependencies between them.

### Prompt

> Implement Plans 10 and 11 from `docs/plans/` in parallel using subagents. Read each plan file fully.
>
> **Plan 10 (CRM Pipeline & Lead Management):** Build the CRM module. Create `src/app/components/crm/LeadsPage.tsx` with Kanban-style pipeline board (8 statuses: new, first_contact, needs_assessment, building_plan, quote_sent, approved, closed_won, closed_lost) using `react-dnd` (already in project). Create `src/app/components/crm/NewLeadModal.tsx` (form with fields: name, phone, email, source from closed list per PRD §5.1 — facebook/instagram/tiktok/youtube/linkedin/whatsapp/phone/manual/website, date, participants, budget, region, preferences). Create `src/app/components/crm/LeadDetail.tsx` (full lead view with: details, needs/requirements, communication history log, status with mandatory loss reason when closing as lost — expensive/competitor/disappeared/other). Implement lead-to-project conversion: when lead status → building_plan, auto-create project + client records. Extend `convex/leads.ts` with `updateStatus` (enforces loss reason on closed_lost), `convertToProject`. Wire `LeadsPage` into producer router at `/crm`. Add CRM nav item to producer sidebar in Layout.tsx.
>
> **Plan 11 (Field Operations HQ):** Build the mobile-first field operations module. Create `src/app/components/field/FieldOperationsHQ.tsx` (full-screen view with scrollable stops timeline, event header with date/participants/status). Create `src/app/components/field/FieldStop.tsx` (per-stop card: planned vs actual start/end times, planned vs actual quantity with update button, status indicators upcoming/in_progress/completed/skipped, start/end/signature buttons). Create `src/app/components/field/TimeShiftModal.tsx` (shift remaining schedule by N minutes, preview affected stops, sends WhatsApp stub notification to upcoming suppliers). Create `src/app/components/field/SignaturePad.tsx` (HTML5 Canvas for supplier written signature, saves to Convex file storage). Create `src/app/components/field/RoadExpenseForm.tsx` (description, amount, category dropdown fuel/parking/tips/misc, camera receipt capture). Create `src/app/components/field/FieldSummary.tsx` (post-event summary: time deltas, quantity comparison, signatures status, total expenses). Implement quantity update → auto-notify food suppliers (detect category "food", stub WhatsApp notification). Extend `convex/fieldOperations.ts` with `startOperation`, `completeOperation`. Extend `convex/fieldOperationStops.ts` with `startStop`, `endStop`, `updateQuantity`, `saveSignature`. Implement `shiftTimes` mutation. Add route `/field/:projectId` to producer router. All components must use large touch targets, mobile-first layout.
>
> Run `bun lint && bun tsc && bun ultracite` after both complete.

---

## Batch D — Dashboards + Notifications + Assets (Plans 12, 13, 14) — PARALLEL ✅ COMPLETE

Three independent plans. **Completed 2026-03-10.**

### Prompt

> Implement Plans 12, 13, and 14 from `docs/plans/` in parallel using subagents. Read each plan file fully.
>
> **Plan 12 (Dashboards & Morning HQ):** Replace the single Dashboard with role-specific dashboards. Create `src/app/components/dashboards/ProducerDashboard.tsx` (widgets: Morning HQ showing today+tomorrow events with supplier details and "open field ops" button, event-day headcount check that alerts all suppliers if fewer participants, quote heat meter showing sent/discussing/closed/lost distribution with progress bar, urgent alerts for expiring insurance/pending reservations/missing invoices, open reservations list with expiry dates, existing stats cards + revenue chart migrated from Dashboard.tsx). Create `src/app/components/dashboards/SupplierDashboard.tsx` (summary cards: pending requests/active bookings/rating/missing docs, pending availability requests with approve/decline, active promotions, document alerts, recent ratings). Create `src/app/components/dashboards/AdminDashboard.tsx` (platform summary, pending supplier approval queue, recent activity, KPI tracking per PRD §11). Create `src/app/components/dashboards/StatCard.tsx` (reusable animated stat card extracted from Dashboard.tsx). Create `src/app/components/ui/HelpTooltip.tsx` (ⓘ icon with popover text + optional video link per PRD §8). Implement drag-drop widget reorder using `react-dnd` with order saved to localStorage. Extend `convex/dashboard.ts` with `morningHQ`, `quoteHeatMeter`, `urgentAlerts`, `openReservations`, `eventHeadcount`, `supplierStats`, `adminStats`, `adminKPIs` queries. Update routes to point each role's `/` to its dashboard.
>
> **Plan 13 (Notifications System):** Build the multi-channel notification backend. Rewrite `convex/notifications.ts` with full CRUD + `createForUser`, `createBulk` (notify multiple users), `markRead`, `markAllRead`, delivery status tracking. Create notification trigger functions for all business events: availability request sent/responded, booking created/expiring/cancelled, document expiring in 7 days, document reminder (2-day cycle), invoice received, project status change, lead assigned. Add cron jobs to `convex/crons.ts`: daily document expiry check, daily booking expiry reminder, 2-day document "I don't have it" reminders. Create stub `convex/notificationChannels.ts` action with `sendWhatsApp`, `sendSMS`, `sendEmail` functions that log messages (actual API integration later). Rewrite `src/app/components/NotificationsPanel.tsx` to query from notifications table: show unread count badge, grouped by date, mark read on click, "mark all read" button, delivery channel indicator icons.
>
> **Plan 14 (Digital Assets & Gallery):** Build digital assets module. Create `convex/pdfExport.ts` as Convex actions with stubs: `generateQuotePdf` (branded client proposal with trip name, activity cards without supplier names, timeline, total + per-participant price, equipment), `generateEquipmentPdf` (aggregated equipment grouped by activity), `generateDriverTripFile` (times + locations, optional phone numbers), `generateClientTripFile` (client-friendly: descriptions + times + equipment, no prices or supplier names). Create `src/app/components/gallery/EventGallery.tsx` (producer uploads photos/videos, share gallery link with participants). Create `src/app/components/gallery/PublicGallery.tsx` at `/gallery/:projectId` (public, no auth: photo grid, participants can upload their own photos+videos, download requires registration with name+phone+marketing consent — B2C lead capture "honey pot"). Create `src/app/components/gallery/EventRatings.tsx` at `/rate/:projectId` (public: rate each activity 1-5 stars with comments, feeds into supplierRatings). Create `src/app/components/orders/DigitalAssetsPanel.tsx` (entry point from project detail: links to all PDF generators + gallery + ratings, only for approved/completed projects). Add Save the Date basic stub (trip name, date, atmosphere, schedule — no Canva yet). Add public routes for gallery and ratings to App.tsx. Extend `convex/supplierRatings.ts` with `createBulk` for participant ratings.
>
> Run `bun lint && bun tsc && bun ultracite` after all three complete.

---

## Batch E — Cross-System Polish (Plan 15) — SEQUENTIAL

Final polish after all features are in.

### Prompt

> Implement Plan 15 from `docs/plans/15-cross-system-polish.md`. Read it fully first.
>
> Implement cross-cutting features: (1) Supplier recommendation engine — add `recommend` query to `convex/suppliers.ts` that filters by category, region, rating ≥4.0, valid documents, availability on date, active promotions; show recommendation chips in SupplierSearch and AlternativesModal. (2) Duplicate detection — add `findDuplicates` query to `convex/suppliers.ts` with fuzzy name match + exact phone/email match; integrate into ImportWizard preview step and supplier creation form with warning "ספק דומה כבר קיים". (3) AI integration stubs — extend `convex/aiSupplier.ts` with `generateTripName` action (suggests creative trip names from activities + region) and `analyzeInvoice` action (extracts amount/date/supplier from uploaded invoice image). (4) Payment system placeholder — create `docs/decisions/payment-system.md` documenting the Polar vs Cardcom decision needed, with pros/cons and note to discuss with Eran. (5) Progressive disclosure — in supplier portal, gray out features based on `profileCompletionStage`: stage1 sees basic product management only, stage2 unlocks promotions/ratings/full features, stage3 unlocks compliance dashboard; show "השלם את הפרופיל שלך כדי לפתוח תכונה זו" on locked features. (6) Responsive polish — audit and fix mobile layouts for FieldOperationsHQ, supplier portal pages, ClientQuote, ProducerDashboard, and CRM pipeline (horizontal scroll on mobile); ensure min 44px touch targets, bottom-dock action buttons on mobile. (7) Settings page rewrite — rewrite `SettingsPage.tsx` with tabs: profile (name/email/phone/avatar/company), notifications (enable/disable per channel), pricing (default margin %), account (change password). (8) Activity log — create `convex/activityLog.ts` with table + CRUD, create `src/app/components/admin/ActivityLog.tsx` with filterable table. Run `bun lint && bun tsc && bun ultracite`.
