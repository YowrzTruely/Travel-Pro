# QA Review Plan — Sections 4–10

## Context
Full QA pass of Eventos sections 4-10 (Quote Editor, Availability & Booking, Client Proposal, Orders & Invoicing, CRM Pipeline, Field Operations, Integrations) using Playwright browser automation against `localhost:5173`.

## Test Accounts
- **Producer**: orangeayx@gmail.com / Inacce551bleEncrypt10n
- **Supplier**: head0.25s@gmail.com / Unbre4k4ble4m4t10n
- **Admin**: ro.levin@icloud.com / Inacce551bleEncrypt10n

## Approach
Use existing browser tab "Travel Pro v.1" via Playwright MCP tools. Test each section sequentially, recording pass/fail for each test case from the QA guide.

## Test Execution Order

### Phase 1: CRM Pipeline (Section 8) — Start here since leads → projects
1. Login as Producer
2. Navigate to /crm
3. Test 8.1: Lead Management — create lead, verify Kanban columns
4. Test 8.2: Drag & drop between columns, loss reason modal
5. Test 8.3: Lead detail page, communication logging
6. Test 8.4: Lead → Project conversion
7. Test 8.5: Filters

### Phase 2: Quote Editor (Section 4) — Use project from Phase 1
1. Open project created from lead conversion
2. Test 4.1: Basic quote editing (trip name, AI buttons, opening paragraph)
3. Test 4.2: Quote items with 4-tier pricing
4. Test 4.3: Upsells/addons
5. Test 4.4: Equipment & timeline
6. Test 4.5: Alternatives modal
7. Test 4.6: Availability status badges
8. Test 4.7: Pricing summary
9. Test 4.8: Quote actions (save draft, send dialog, PDF)

### Phase 3: Availability & Booking (Section 5)
1. Test 5.1: Producer sends availability requests from Quote Editor
2. Switch to Supplier account
3. Test 5.2: Supplier responds to requests (approve/decline/alternative)
4. Switch back to Producer
5. Test 5.3: Producer sees responses
6. Test 5.4: Unregistered supplier flow (if testable)

### Phase 4: Client Proposal (Section 6)
1. Get public quote URL from QuoteSendDialog
2. Test 6.1: Public quote page loads, content verification
3. Test 6.2: Client actions (approve, signature, change request)
4. Test 6.3: Share without prices (?mode=noPrices)
5. Test 6.4: Version management

### Phase 5: Orders & Invoicing (Section 7)
1. After quote approval, navigate to project orders
2. Test 7.1: Order generation
3. Test 7.2: Order sending
4. Test 7.3: Invoice tracking
5. Test 7.4: Archive gate

### Phase 6: Field Operations (Section 9)
1. Open project with event → Field Ops
2. Test 9.1: Field ops entry
3. Test 9.2: Stop management
4. Test 9.3: Time shift
5. Test 9.4: Road expenses
6. Test 9.5: Field summary
7. Test 9.6: Mobile responsiveness (resize viewport)

### Phase 7: Integrations (Section 10)
1. Test 10.1: QuoteSendDialog (WhatsApp/SMS/Email channels)
2. Test 10.2: AI features (with/without API key)
3. Test 10.3: PDF export
4. Test 10.4: Notification system (bell icon)
5. Test 10.5: Password change in Settings

## Output
Bug reports following the template in QA-guide.md. Final summary with pass/fail per test case.

## Key Files
- Quote Editor: `src/app/components/QuoteEditor.tsx`
- Client Quote: `src/app/components/ClientQuote.tsx`
- CRM: `src/app/components/crm/LeadsPage.tsx`, `LeadDetail.tsx`, `NewLeadModal.tsx`, `LossReasonModal.tsx`
- Orders: `src/app/components/orders/ProjectOrders.tsx`, `InvoiceTracker.tsx`
- Field Ops: `src/app/components/field/FieldOperationsHQ.tsx`, `FieldStop.tsx`, `TimeShiftModal.tsx`
- Availability: `src/app/components/supplier/RequestsPage.tsx`
- Send Dialog: `src/app/components/QuoteSendDialog.tsx`
- Settings: `src/app/components/settings/SettingsPage.tsx`
- PDF Export: `convex/pdfExport.ts` (stubs)
- Notifications: `convex/notifications.ts`

## Known Limitations from Exploration
- PDF exports are **stubs** — will return "coming soon" messages
- AI features require `OPENROUTER_API_KEY` env var
- Version history modal has **hardcoded mock data**
- SMS/Email require SLNG/Resend API keys
