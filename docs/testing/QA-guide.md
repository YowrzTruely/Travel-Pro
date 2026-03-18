# QA Guide — Eventos Full Application Testing

**Date:** 2026-03-10
**Scope:** End-to-end testing of all implemented features (Plans 01–15 + External Integrations)
**Estimated time:** 3–4 hours for full pass

---

## Prerequisites

### Environment Setup

1. **Two terminals running:**
   - Terminal 1: `bun run dev` (frontend on `localhost:5173`)
   - Terminal 2: `npx convex dev` (backend syncing)

2. **Seed data loaded:**
   ```bash
   npx convex run seed:seedAll
   ```

3. **If login fails with `InvalidSecret`**, reset test user passwords:
   ```bash
   bun run seed:auth
   ```
   This re-hashes the three test accounts (Admin, Producer, Supplier) with their correct passwords.

4. **Environment variables configured** (Convex Dashboard → Settings → Environment Variables):
   | Variable | Required For |
   |---|---|
   | `SLNG_USERNAME` | SMS sending |
   | `SLNG_PASSWORD` | SMS sending |
   | `SLNG_FROM_MOBILE` | SMS sender name |
   | `OPENROUTER_API_KEY` | AI features |
   | `RESEND_API_KEY` | Email sending |
   | `EMAIL_FROM_ADDRESS` | Email sender (optional) |

   > **Note:** WhatsApp, PDF export, password change, and admin pages work without any API keys.

5. **Test accounts needed:**
   - 1 Admin account
   - 1 Producer account
   - 1 Supplier account (approved)
   - 1 new email for supplier self-registration test

### Browser Setup
- Use Chrome or Firefox
- Open DevTools Console (F12) to catch errors
- Test on both desktop and mobile viewport (use DevTools responsive mode, 375px width)

### Legend
- ✅ = Pass
- ❌ = Fail (note the issue)
- ⚠️ = Partial / cosmetic issue
- 🚫 = Blocked (dependency missing)
- N/A = Not applicable / not yet implemented

---

## SECTION 1: Authentication & Roles (Plan 02)

### 1.1 Login Page

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 1.1.1 | Navigate to `localhost:5173` | Login page loads, Hebrew RTL, Assistant font | |
| 1.1.2 | Attempt login with wrong credentials | Error toast in Hebrew | |
| 1.1.3 | Login as **Producer** | Redirects to Producer Dashboard | |
| 1.1.4 | Verify sidebar shows producer menu items | Projects, Suppliers, Clients, CRM, Calendar, Dashboard, Settings visible | |
| 1.1.5 | Logout | Returns to login page | |
| 1.1.6 | Login as **Supplier** | Redirects to Supplier Dashboard | |
| 1.1.7 | Verify sidebar shows supplier menu items | Products, Documents, Availability, Requests, Profile, Promotions, Ratings, Settings visible | |
| 1.1.8 | Logout and login as **Admin** | Redirects to Admin Dashboard | |
| 1.1.9 | Verify sidebar shows admin menu items | Dashboard, Approve Suppliers, User Management, Activity Log, Settings visible | |

### 1.2 Signup & Registration

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 1.2.1 | Click signup on login page | Registration form with role selection appears | |
| 1.2.2 | Register as new **Producer** | Account created, redirected to Producer onboarding/dashboard | |
| 1.2.3 | Register as new **Supplier** | Account created, enters Supplier onboarding flow | |
| 1.2.4 | Navigate to `/register/supplier` (self-registration link) | Public supplier registration form loads (no auth required) | |
| 1.2.5 | Complete Stage 1: name, phone, email, category, region, first product | Registration succeeds, redirects to pending approval screen | |

### 1.3 Supplier Onboarding (3 Stages)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 1.3.1 | **Stage 1** — Fill required fields (name, phone, email, category, region, first product) | Stage completes, profile saved | |
| 1.3.2 | **Stage 2** — Upload logo, add product images, write descriptions, set 4-tier pricing, operating hours | All fields save correctly, AI buttons visible | |
| 1.3.3 | **Stage 3** — Upload insurance documents (ביטוח צד ג', ביטוח חבות מעבידים) | Documents uploaded, compliance status updates | |
| 1.3.4 | Pending supplier sees "waiting for approval" screen | Pending screen shown with appropriate messaging | |

---

## SECTION 2: Admin Functions (Integrations Commit)

### 2.1 Approve Suppliers (`/approve-suppliers`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 2.1.1 | Login as Admin, navigate to Approve Suppliers | Page loads with pending supplier count badge | |
| 2.1.2 | Verify pending suppliers table shows: name, email, phone, company, signup date | All columns populated correctly | |
| 2.1.3 | Click **Approve** on a pending supplier | Supplier removed from list, toast confirmation | |
| 2.1.4 | Login as that supplier — verify access granted | Supplier dashboard loads (no longer pending screen) | |
| 2.1.5 | Back as Admin — click **Reject** on another supplier | Supplier removed from list with rejection | |
| 2.1.6 | Verify empty state message when no pending suppliers | "אין ספקים ממתינים לאישור" or similar message | |

### 2.2 User Management (`/users`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 2.2.1 | Navigate to User Management | User table loads with all users | |
| 2.2.2 | Search by name | Table filters correctly | |
| 2.2.3 | Search by email | Table filters correctly | |
| 2.2.4 | Change a user's **role** via dropdown (e.g., producer → admin) | Role updates, toast confirmation | |
| 2.2.5 | Change a user's **status** via dropdown (active/pending/suspended) | Status updates, toast confirmation | |
| 2.2.6 | Verify user count badge updates | Count reflects current filtered results | |

---

## SECTION 3: Supplier Module (Plans 03–05)

### 3.1 Supplier Profile (`SupplierProfile`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.1.1 | Login as Supplier, navigate to Profile | Profile form loads with current data | |
| 3.1.2 | Edit business name, phone, email | Fields save on submit | |
| 3.1.3 | Select categories (max 3 without admin approval) | Multi-select works, enforces limit | |
| 3.1.4 | Select operating regions (11 options) | Multi-select with all Israeli regions | |
| 3.1.5 | Set operating hours | Hours save correctly | |
| 3.1.6 | Set seasonal availability | Seasonal data saves | |
| 3.1.7 | Set default margin percentage | Value saves | |

### 3.2 Products (`MyProducts` + `SupplierProductEditor`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.2.1 | Navigate to My Products | Product list/grid loads | |
| 3.2.2 | Toggle between card view and list view | Both views render correctly | |
| 3.2.3 | Click **Add New Product** | Product editor form opens | |
| 3.2.4 | Fill all fields: name, category, regions, descriptions | Fields accept input | |
| 3.2.5 | Set **4-tier pricing**: list price, direct price, producer price, client price | All 4 price fields save correctly | |
| 3.2.6 | Set **volume pricing**: threshold + volume prices per tier | Volume pricing saves | |
| 3.2.7 | Set **timing**: gross time + net time (minutes) | Time fields save | |
| 3.2.8 | Set capacity, location, cancellation terms | All fields save | |
| 3.2.9 | Add equipment requirements | Requirements list saves | |
| 3.2.10 | Upload product images | Images upload and display | |
| 3.2.11 | Click **AI description button** (requires `OPENROUTER_API_KEY`) | AI generates Hebrew marketing description | |
| 3.2.12 | If no API key: AI button returns "not configured" message | Graceful fallback, no crash | |
| 3.2.13 | Add **upsells/addons** to product (e.g., appetizer platter, guide) | Addons save with 4-tier pricing | |
| 3.2.14 | Save product and verify it appears in product list | Product visible with correct details | |
| 3.2.15 | Edit existing product | Changes save correctly | |
| 3.2.16 | Delete a product | Product removed from list | |

### 3.3 Availability Calendar (`AvailabilityCalendar`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.3.1 | Navigate to Availability Calendar | Monthly calendar renders | |
| 3.3.2 | Click a date to mark as **available** | Date highlights green | |
| 3.3.3 | Click a date to mark as **unavailable** | Date highlights red | |
| 3.3.4 | Navigate between months | Calendar updates | |
| 3.3.5 | Verify availability persists after page refresh | Data reloads correctly | |

### 3.4 Documents & Compliance (`MyDocuments` — Plan 04)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.4.1 | Navigate to My Documents | Checklist of required documents loads | |
| 3.4.2 | Verify status indicators: ✅ valid, 🟡 expiring ≤30 days, 🔴 expired, ⚠️ missing | Correct colors per document state | |
| 3.4.3 | Upload a document (e.g., business license) | File uploads, status changes to ✅ | |
| 3.4.4 | Click **"אין לי"** (I don't have it) on a document | Acknowledgment recorded, document shows as acknowledged-missing | |
| 3.4.5 | For **food category** supplier: verify Kosher certificate toggle appears | Yes/No toggle visible | |
| 3.4.6 | Upload an insurance document (ביטוח צד ג') | Document saved with expiry date tracking | |

### 3.5 Supplier Preview (`SupplierPreview` — Plan 05)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.5.1 | Navigate to "כך אני נראה" (Preview) | Preview page loads showing supplier's public appearance | |
| 3.5.2 | Toggle between **Producer view** and **Client view** | Producer view shows all 4 prices; Client view shows only list price | |
| 3.5.3 | Verify products display with images and descriptions | Product cards render correctly | |
| 3.5.4 | Verify compliance status badges visible | ✅/⚠️/🔴 badges show | |
| 3.5.5 | Verify "missing fields" nudge at bottom | Yellow indicators for incomplete sections | |

### 3.6 Promotions (`SupplierPromotions` — Plan 05)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.6.1 | Navigate to Promotions | Promotions page loads | |
| 3.6.2 | Create a new promotion (title, description, discount, dates) | Promotion saves, appears in list | |
| 3.6.3 | Verify status badges: 🔥 active, ⏰ coming soon, ✅ ended | Correct badge per date range | |
| 3.6.4 | Edit an existing promotion | Changes save | |
| 3.6.5 | Deactivate a promotion | Status updates to ended | |

### 3.7 Supplier Ratings (`SupplierRatings` — Plan 05)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.7.1 | Navigate to Ratings page | Average rating and rating list display | |
| 3.7.2 | Verify star rating display (⭐ X/5) | Average calculates correctly | |
| 3.7.3 | Verify individual ratings show name, date, project, stars, comments | All fields populated | |

### 3.8 Public Supplier Profile (`/supplier/:id/public`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 3.8.1 | Open public supplier profile URL (no auth) | Page loads without login | |
| 3.8.2 | Verify: logo, name, rating, categories, regions | All displayed | |
| 3.8.3 | Verify products show with list price only | No producer/direct prices visible | |
| 3.8.4 | Verify active promotions visible | Promotion cards display | |
| 3.8.5 | Verify contact button (WhatsApp/phone) | Button opens WhatsApp or dialer | |

---

## SECTION 4: Quote Editor (Plan 06)

### 4.1 Basic Quote Editing

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.1.1 | Login as Producer, create or open a project | Project page loads | |
| 4.1.2 | Open **Quote Editor** | Editor loads with trip setup fields | |
| 4.1.3 | Enter trip name | Saves | |
| 4.1.4 | Click **AI trip name suggestion** button (requires API key) | Generates creative Hebrew trip name | |
| 4.1.5 | Without API key: AI button fallback | Returns template text, no crash | |
| 4.1.6 | Edit opening paragraph | Text saves | |
| 4.1.7 | Click **AI opening paragraph** button | Generates Hebrew opening paragraph | |

### 4.2 Quote Items with 4-Tier Pricing

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.2.1 | Add a new quote item | Item form appears | |
| 4.2.2 | Select a supplier from dropdown | Supplier selected | |
| 4.2.3 | Select a product from that supplier | Product selected, **4-tier prices auto-fill** | |
| 4.2.4 | Verify display: מחיר מחירון / ישיר / מפיק / ללקוח | All 4 prices shown | |
| 4.2.5 | Verify **client price defaults** to producerPrice × 1.20 (20% margin) | Auto-calculated | |
| 4.2.6 | Override client price manually | New value saves | |
| 4.2.7 | Verify **margin display**: ₪X/person (Y%) | Calculated correctly | |
| 4.2.8 | Set participant count, verify **volume pricing** applies if configured | Prices adjust at threshold | |

### 4.3 Upsells / Addons

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.3.1 | Verify upsells section appears when product has addons | Checkbox list of addons visible | |
| 4.3.2 | Toggle addons on/off | Selected addons contribute to total price | |
| 4.3.3 | Verify addon pricing shows correct tier | 4-tier pricing per addon | |

### 4.4 Equipment & Timeline

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.4.1 | Verify **equipment requirements** display per item | Equipment list shown | |
| 4.4.2 | Verify **aggregated equipment list** section (deduplicated) | All equipment across items listed | |
| 4.4.3 | Verify **visual timeline** with times and durations | Timeline renders | |
| 4.4.4 | Drag & drop reorder timeline items | Items reorder, times recalculate | |
| 4.4.5 | Toggle "הסתר לפני שליחה" (hide timeline from client) | Timeline hidden in client view | |

### 4.5 Alternatives

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.5.1 | Click to create alternatives for an item | **AlternativesModal** opens | |
| 4.5.2 | Search same-category suppliers | Results sorted by rating | |
| 4.5.3 | Select 2-4 alternatives | Alternatives stored on quote item | |
| 4.5.4 | Verify promotion badges on alternatives | 🔥 badge on suppliers with active promotions | |

### 4.6 Availability Status

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.6.1 | Verify availability status badges per item | ✅ אושר / ⏳ ממתין / ❌ נדחה / ⬜ לא נבדק | |
| 4.6.2 | Verify **availability summary bar** at top | "זמינות: X/Y אושרו..." with progress bar | |

### 4.7 Pricing Summary

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.7.1 | Verify **pricing summary** section | Shows: supplier cost, addons total, client price, gross profit, margin %, price per participant | |
| 4.7.2 | Add/remove items and verify totals recalculate | Real-time calculation | |

### 4.8 Quote Actions

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 4.8.1 | Click **"שמור טיוטה"** (Save Draft) | Quote saves | |
| 4.8.2 | Click **"שלח הצעה ללקוח"** (Send to Client) | **QuoteSendDialog** opens (see Section 10.1) | |
| 4.8.3 | Click **"ייצא PDF"** (Export PDF) | PDF generates and downloads (see Section 10.3) | |

---

## SECTION 5: Availability & Booking (Plan 07)

### 5.1 Availability Requests (Producer Side)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 5.1.1 | In Quote Editor, click **"בדוק זמינות"** on a quote item | Availability request created | |
| 5.1.2 | Verify item status changes to ⏳ ממתין | Badge updates | |
| 5.1.3 | Click **"שלח הכל"** for bulk availability check | All unchecked items get requests | |
| 5.1.4 | Verify notification sent to supplier (check console/logs) | Notification dispatched | |

### 5.2 Availability Responses (Supplier Side)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 5.2.1 | Login as Supplier, navigate to **Requests** page | Pending requests tab shows new request | |
| 5.2.2 | Click **Approve** on a request | Booking auto-created with 7-day expiry | |
| 5.2.3 | Verify request moves to **Active Bookings** tab | Booking visible with expiry date | |
| 5.2.4 | Create another request, click **Decline** | Request marked as declined | |
| 5.2.5 | Create another request, click **Propose Alternative** | Alternative proposal form appears, can select different product/date | |
| 5.2.6 | Verify **History** tab shows past requests | All completed requests listed | |

### 5.3 Producer Sees Responses

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 5.3.1 | Login as Producer, open Quote Editor | Item status updated to ✅ אושר for approved items | |
| 5.3.2 | For declined items: verify status ❌ and alternative suggestion | System suggests similar-category suppliers | |
| 5.3.3 | For alternative proposals: verify **AlternativeProposalCard** appears | Card shows original vs proposed with accept/decline buttons | |

### 5.4 Unregistered Supplier Flow

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 5.4.1 | In Quote Editor, enter phone for unregistered supplier | System creates request with registration link | |
| 5.4.2 | Open the availability-invite link | Registration + availability response page loads | |
| 5.4.3 | Complete quick registration + respond to availability | Supplier created (pending) + response recorded | |

---

## SECTION 6: Client Proposal Page (Plan 08)

### 6.1 Public Quote Page (`/quote/:id`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 6.1.1 | Open quote URL (no auth required) | Client proposal page loads | |
| 6.1.2 | Verify **header**: trip name, opening paragraph, summary (date, participants, region) | All populated | |
| 6.1.3 | Verify **activity cards**: image, activity name (NO supplier name), description, time, duration, equipment | All visible, supplier name hidden | |
| 6.1.4 | Verify **upsells section** per item with toggleable checkboxes | Client can toggle addons | |
| 6.1.5 | Toggle an upsell, verify total price updates | Price recalculates | |
| 6.1.6 | Verify **alternatives section** with radio buttons (2-4 options) | Client can select preferred option | |
| 6.1.7 | Select an alternative, verify it replaces the default | Selection updates | |
| 6.1.8 | Verify **visual timeline** (if not hidden by producer) | Timeline renders | |
| 6.1.9 | Verify **pricing display**: total + per participant (no cost breakdown) | Only client-facing prices shown | |

### 6.2 Client Actions

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 6.2.1 | Click **"אשר הצעה + חתום"** | Signature form opens | |
| 6.2.2 | Fill signature form: name, role, company | Fields accept input | |
| 6.2.3 | Draw signature on canvas | Canvas captures drawing | |
| 6.2.4 | Check confirmation checkbox + submit | Quote approved, confirmation screen shown | |
| 6.2.5 | Verify confirmation shows: trip name, date, project ID | All correct | |
| 6.2.6 | Click **"פנה לנציג"** (Contact) | WhatsApp/phone opens | |
| 6.2.7 | Click **"בקש שינויים"** (Request Changes) | Change request form opens | |
| 6.2.8 | Submit change request with items and reasons | Request saved, producer notified | |

### 6.3 Share Without Prices

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 6.3.1 | Open quote URL with `?mode=noPrices` | Page loads without any pricing | |
| 6.3.2 | Verify banner: "תצוגה ללא מחירים" | Banner visible | |
| 6.3.3 | Verify all activities still display normally (just no prices) | Content intact | |

### 6.4 Version Management

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 6.4.1 | In Quote Editor, verify version tabs (V1, V2, V3...) | Version tabs visible | |
| 6.4.2 | Click **"שכפל גרסה חדשה"** | New version created with copied items | |
| 6.4.3 | Switch between versions | Items change per version | |

---

## SECTION 7: Orders & Invoicing (Plan 09)

### 7.1 Order Generation

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 7.1.1 | Approve a quote (via client signature from Section 6.2) | Project status changes to "אושר" | |
| 7.1.2 | Navigate to project orders | **ProjectOrders** page shows auto-generated orders | |
| 7.1.3 | Verify one order per supplier with: supplier name, product, date, participants, price | All fields correct | |
| 7.1.4 | Verify status badges: ⏳ pending / 📤 sent / ✅ confirmed / 🗑 cancelled | Correct statuses | |

### 7.2 Order Sending

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 7.2.1 | Click **"שלח הזמנה"** on an order | Order sent to supplier (WhatsApp/SMS/Email) | |
| 7.2.2 | Verify status changes to 📤 sent | Status updates | |
| 7.2.3 | Click **"שלח הכל"** for batch send | All pending orders sent | |
| 7.2.4 | Edit an order | Changes save | |
| 7.2.5 | Cancel an order | Status changes to cancelled, supplier notified | |

### 7.3 Invoice Tracking

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 7.3.1 | Navigate to **Invoice Tracker** for the project | List of suppliers with invoice status | |
| 7.3.2 | Verify status: ❌ לא התקבלה / ✅ התקבלה / ✔️ מאומתת | Correct per supplier | |
| 7.3.3 | Upload an invoice for a supplier | Status changes, invoice saved | |
| 7.3.4 | Click **"שלח תזכורת"** for missing invoice | Reminder sent to supplier | |
| 7.3.5 | Verify progress: "X/Y חשבוניות התקבלו" | Count correct | |

### 7.4 Archive Gate

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 7.4.1 | Attempt to archive project with missing invoices | **Blocked** with warning listing missing invoices | |
| 7.4.2 | Upload all missing invoices, then archive | Archive succeeds | |

---

## SECTION 8: CRM Pipeline (Plan 10)

### 8.1 Lead Management

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 8.1.1 | Login as Producer, navigate to **CRM** | Kanban board loads with 8 columns | |
| 8.1.2 | Verify columns: חדש → שיחה ראשונה → בירור צרכים → בניית תוכנית → הצעה נשלחה → בדיון → נסגר ✅ → הופסד ❌ | All 8 columns visible | |
| 8.1.3 | Click **"הוסף ליד"** to create new lead | **NewLeadModal** opens | |
| 8.1.4 | Fill: name, phone, email, source (dropdown), participants, date, budget, region | All fields work | |
| 8.1.5 | Submit — verify lead card appears in "חדש" column | Card shows name, source icon, participants, budget | |

### 8.2 Kanban Drag & Drop

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 8.2.1 | Drag lead from "חדש" to "שיחה ראשונה" | Card moves, status updates | |
| 8.2.2 | Drag lead through pipeline stages | Each move updates status | |
| 8.2.3 | Drag lead to **"הופסד ❌"** | **LossReasonModal** appears (MANDATORY) | |
| 8.2.4 | Attempt to close without selecting reason | Modal prevents closure | |
| 8.2.5 | Select loss reason (e.g., "יקר מדי") + optional notes, submit | Lead moves to lost column | |
| 8.2.6 | Verify header badges show count per column | Counts update on drag | |

### 8.3 Lead Detail

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 8.3.1 | Click a lead card | **LeadDetail** page opens with tabs | |
| 8.3.2 | **פרטי לקוח tab** — edit lead fields | Changes save | |
| 8.3.3 | **היסטוריית תקשורת tab** — click "רשום שיחה" | **LogCommunicationModal** opens | |
| 8.3.4 | Log a call (type: call, content, duration) | Entry appears in timeline | |
| 8.3.5 | Log WhatsApp message | Entry appears with WhatsApp icon | |
| 8.3.6 | **הצעות מחיר tab** — verify linked projects if any | Projects listed with versions | |

### 8.4 Lead → Project Conversion

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 8.4.1 | Move lead to "בניית תוכנית", click **"צור פרויקט"** | Project auto-created with lead's data | |
| 8.4.2 | Verify project has: name, participants, budget, region from lead | Data transferred correctly | |
| 8.4.3 | Verify client record auto-created and linked | Client exists | |
| 8.4.4 | Navigate to new project's Quote Editor | Editor opens ready for editing | |

### 8.5 Filters

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 8.5.1 | Filter by source (e.g., Facebook) | Only matching leads shown | |
| 8.5.2 | Filter by date range | Only leads in range shown | |
| 8.5.3 | Filter by assigned producer | Only assigned leads shown | |

---

## SECTION 9: Field Operations HQ (Plan 11)

### 9.1 Field Ops Entry

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 9.1.1 | Open a project with today's event date | "פתח חמ"ל שטח" button visible | |
| 9.1.2 | Click button | Full-screen field ops interface loads | |
| 9.1.3 | Verify header: trip name, date, participants, status badge | All correct | |

### 9.2 Stop Management

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 9.2.1 | Verify scrollable stops list from timeline | All stops listed with planned times | |
| 9.2.2 | Click **"התחל"** (Start) on a stop | Actual start time recorded, stop turns 🟡 in_progress | |
| 9.2.3 | Click **"סיים"** (End) on a stop | Actual end time recorded, stop turns ✅, time delta shown (+/- דק) | |
| 9.2.4 | Click **"עדכן כמות"** (Update Quantity) | Quantity update form opens | |
| 9.2.5 | Enter new participant count | Actual quantity saved; if food supplier: notification sent | |
| 9.2.6 | Click **"חתימת ספק"** (Supplier Signature) | **SignaturePad** canvas opens | |
| 9.2.7 | Draw signature and save | Signature saved to file storage | |
| 9.2.8 | Skip a stop | Stop marked as ⏭ skipped | |

### 9.3 Time Shift

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 9.3.1 | Click **"הסטת זמנים"** in action bar | **TimeShiftModal** opens | |
| 9.3.2 | Enter shift amount (e.g., +15 דק) | Preview shows all remaining stops' updated times | |
| 9.3.3 | Verify checkbox list of upcoming suppliers to notify | Suppliers pre-checked | |
| 9.3.4 | Click **"בצע הסטה + שלח הודעות"** | Times update, notifications dispatched | |

### 9.4 Road Expenses

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 9.4.1 | Open **Road Expense Form** | Form with: description, amount, category dropdown | |
| 9.4.2 | Enter expense (e.g., fuel ₪150) | Expense saves | |
| 9.4.3 | Upload receipt photo | Photo uploads to file storage | |
| 9.4.4 | Verify expense appears in list | Entry visible with amount and category | |

### 9.5 Field Summary (Post-Event)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 9.5.1 | After completing all stops, view **Field Summary** | Summary loads | |
| 9.5.2 | Verify time deltas per stop (planned vs actual) | Deltas shown with +/- | |
| 9.5.3 | Verify quantity summary (planned vs actual) | Percentages shown | |
| 9.5.4 | Verify signatures status: X/Y suppliers signed | Count correct | |
| 9.5.5 | Verify total road expenses by category | Amounts summarized | |

### 9.6 Mobile Responsiveness

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 9.6.1 | Open Field Ops on mobile viewport (375px) | Mobile-first layout renders | |
| 9.6.2 | Verify large touch targets (≥44px) | Buttons easily tappable | |
| 9.6.3 | Verify bottom-docked action buttons | Actions accessible at bottom | |
| 9.6.4 | Verify signature pad works on touch | Drawing works | |

---

## SECTION 10: Integrations (Latest Commit)

### 10.1 Quote Send Dialog (`QuoteSendDialog`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 10.1.1 | In Quote Editor, click "שלח הצעה ללקוח" | **QuoteSendDialog** opens | |
| 10.1.2 | Verify public quote URL displayed and **copy button** works | URL copied to clipboard | |
| 10.1.3 | Select **WhatsApp** channel | Phone input field appears | |
| 10.1.4 | Enter Israeli phone number, click Send | New tab opens with WhatsApp (`wa.me` link) with pre-filled message | |
| 10.1.5 | Select **SMS** channel | Phone input field appears | |
| 10.1.6 | Enter phone, click Send | SMS sent via SLNG (or "not configured" if no API key) | |
| 10.1.7 | Select **Email** channel | Email input field appears | |
| 10.1.8 | Enter email, click Send | Email sent via Resend (or "not configured" if no API key) | |
| 10.1.9 | Verify **success/error toasts** for each channel | Appropriate Hebrew toast shown | |

### 10.2 AI Features (`aiSupplier.ts`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 10.2.1 | **Marketing description** — trigger from supplier product editor | AI generates Hebrew marketing text | |
| 10.2.2 | **Trip name** — trigger from Quote Editor | AI suggests creative Hebrew trip name | |
| 10.2.3 | **Opening paragraph** — trigger from Quote Editor | AI generates proposal opening | |
| 10.2.4 | **Invoice analysis** — upload invoice image in Invoice Tracker | AI extracts: amount, date, supplier, invoice number with confidence score | |
| 10.2.5 | **Without API key** — all above features | Each returns fallback text, no crashes | |

### 10.3 PDF Export (`pdfGenerator.ts`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 10.3.1 | Navigate to project's **Digital Assets Panel** | Panel loads with PDF buttons | |
| 10.3.2 | Click **"PDF הצעת מחיר"** (Quote PDF) | PDF downloads with: trip name, opening paragraph, items table, costs, timeline | |
| 10.3.3 | Open PDF — verify **Hebrew text renders** (may be character-reversed for RTL) | Text readable | |
| 10.3.4 | Verify branded orange headers | Styling correct | |
| 10.3.5 | Click **"רשימת ציוד PDF"** (Equipment PDF) | PDF with equipment grouped by activity | |
| 10.3.6 | Click **"תיק טיול לנהג PDF"** (Driver Trip File) | PDF with times, addresses, supplier contacts only | |
| 10.3.7 | Click **"תיק טיול ללקוח PDF"** (Client Trip File) | PDF with activities + timeline, NO costs, NO supplier names | |

### 10.4 Notification System (Multi-Channel)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 10.4.1 | Trigger any notification event (e.g., approve availability) | In-app notification created | |
| 10.4.2 | Click **bell icon** in header | Notification dropdown opens with unread count | |
| 10.4.3 | Verify notifications grouped by date (היום, אתמול) | Grouping correct | |
| 10.4.4 | Verify color-coded icons per type (🟢/🔴/🟡/🟠/🔵/🟣) | Colors match notification types | |
| 10.4.5 | Click a notification | Navigates to relevant page + marks as read | |
| 10.4.6 | Click **"סמן הכל כנקרא"** | All notifications marked read, badge clears | |
| 10.4.7 | **SMS delivery** — if SLNG configured: trigger an SMS notification | SMS sent, delivery status tracked via webhook | |
| 10.4.8 | **Email delivery** — if Resend configured: trigger email notification | Email sent with RTL Hebrew HTML | |

### 10.5 Password Change

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 10.5.1 | Navigate to **Settings → Account tab** | Password change form visible | |
| 10.5.2 | Enter current password + new password (≥8 chars) + confirm | Form validates | |
| 10.5.3 | Submit with **wrong current password** | Error: incorrect password | |
| 10.5.4 | Submit with **correct current password** | Password changed, success toast | |
| 10.5.5 | Logout and login with **new password** | Login succeeds | |
| 10.5.6 | Try new password < 8 characters | Validation error | |

---

## SECTION 11: Dashboards (Plan 12)

### 11.1 Producer Dashboard

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 11.1.1 | Login as Producer, navigate to Dashboard | Dashboard loads with widgets | |
| 11.1.2 | **Morning HQ Widget** — verify today + tomorrow events | Events listed with supplier details | |
| 11.1.3 | Click **"פתח חמ"ל שטח"** on an event | Navigates to Field Ops | |
| 11.1.4 | **Quote Heat Meter** — verify distribution bar | Shows sent/discussing/closed_won/closed_lost with percentages | |
| 11.1.5 | **Urgent Alerts** — verify categories: 🔴 expiring docs, 🟡 pending reservations, 🟠 missing invoices | Alerts display with correct colors | |
| 11.1.6 | **Open Reservations Table** — verify data: supplier, project, date, expires, status | Table populated | |
| 11.1.7 | **Stats Cards** — verify animated number cards | Numbers animate on load | |
| 11.1.8 | **Revenue Chart** — verify Recharts line chart | Chart renders with data | |
| 11.1.9 | **Drag & drop widgets** to reorder | Widgets reorder | |
| 11.1.10 | Refresh page — verify **widget order persists** (localStorage) | Same order after refresh | |
| 11.1.11 | Collapse/expand widgets | Toggle works | |
| 11.1.12 | Click ⓘ **help tooltip** on a widget | Popover with Hebrew explanation | |

### 11.2 Supplier Dashboard

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 11.2.1 | Login as Supplier, verify dashboard | Dashboard loads | |
| 11.2.2 | **Summary cards**: pending requests, active bookings, avg rating, missing docs | All populated | |
| 11.2.3 | **Pending requests** with inline approve/decline | Buttons functional | |
| 11.2.4 | **Active promotions** section | Promotions listed | |
| 11.2.5 | **Document alerts** — expiring/expired warnings | Alerts shown | |
| 11.2.6 | **Recent ratings** section | Ratings listed | |

### 11.3 Admin Dashboard

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 11.3.1 | Login as Admin, verify dashboard | Dashboard loads | |
| 11.3.2 | **Platform summary**: total producers, suppliers, pending approvals | Numbers correct | |
| 11.3.3 | **Pending approval queue** | Supplier cards with approve/decline | |
| 11.3.4 | **Recent activity log** | System events listed | |
| 11.3.5 | **KPI tracking** per PRD: suppliers registered, producers, quotes, completion % | KPIs displayed | |

---

## SECTION 12: Digital Assets & Gallery (Plan 14)

### 12.1 Digital Assets Panel

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 12.1.1 | Open project → Digital Assets tab | Panel loads with action buttons | |
| 12.1.2 | Verify all buttons present: PDF quote, equipment, driver file, client file, gallery, ratings | All visible | |
| 12.1.3 | Verify "Coming Soon" items grayed out | B2C lead capture and Save the Date marked | |

### 12.2 Event Gallery

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 12.2.1 | Click **"גלריית אירוע"** (Event Gallery) | Gallery page loads | |
| 12.2.2 | Upload photos | Photos appear in grid | |
| 12.2.3 | Upload videos | Videos appear in grid | |
| 12.2.4 | Click **"שתף גלריה עם משתתפים"** | Public gallery link generated | |

### 12.3 Public Gallery (`/gallery/:projectId`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 12.3.1 | Open public gallery link (no auth) | Photo/video grid loads | |
| 12.3.2 | Verify participant upload section: "גם אתם צילמתם?" | Upload buttons visible | |
| 12.3.3 | Upload a photo as participant | Photo added to gallery | |
| 12.3.4 | Verify download requires registration: name + phone + marketing consent | Form appears before download | |
| 12.3.5 | Fill form and download | Photos download | |

### 12.4 Event Ratings (`/rate/:projectId`)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 12.4.1 | Open public ratings link (no auth) | Rating form loads per activity | |
| 12.4.2 | Rate each activity 1-5 stars | Stars selectable | |
| 12.4.3 | Add optional comments | Text field works | |
| 12.4.4 | Submit ratings | Success confirmation | |
| 12.4.5 | Login as Supplier — verify ratings updated | Average rating recalculated | |

---

## SECTION 13: Settings (Plan 15 + Integrations)

### 13.1 Settings Page (All Roles)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 13.1.1 | Navigate to Settings | Page loads with tabs | |
| 13.1.2 | **פרופיל tab** — update name, phone, company | Changes save | |
| 13.1.3 | Upload/change avatar | Image uploads, preview shows | |
| 13.1.4 | **התראות tab** — toggle notification channels (in-app, email, SMS, WhatsApp) | Toggles save | |
| 13.1.5 | **תמחור tab** (producer only) — set default margin % | Percentage saves | |
| 13.1.6 | **חשבון tab** — change password (covered in 10.5) | Works | |
| 13.1.7 | **חשבון tab** — logout button | Logs out | |

---

## SECTION 14: Cross-System Polish (Plan 15)

### 14.1 Supplier Recommendations

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 14.1.1 | In supplier search, verify **recommendation chips** | Top-rated, compliant suppliers shown first | |
| 14.1.2 | In AlternativesModal, verify sort by rating | Higher-rated suppliers at top | |
| 14.1.3 | Verify suppliers with promotions show 🔥 badge | Badge visible | |

### 14.2 Duplicate Detection

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 14.2.1 | Create a supplier with similar name to existing | Warning: "ספק דומה כבר קיים" | |
| 14.2.2 | Create supplier with same phone as existing | Duplicate warning | |
| 14.2.3 | In ImportWizard, import CSV with potential duplicates | Preview step shows duplicate warnings | |

### 14.3 Progressive Disclosure

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 14.3.1 | Login as Stage 1 supplier | Only basic product management visible | |
| 14.3.2 | Verify advanced features (promotions, ratings, pricing) are grayed out | "השלם את הפרופיל" message shown | |
| 14.3.3 | Complete Stage 2, verify features unlock | Promotions, advanced pricing visible | |

### 14.4 Responsive Design (Key Pages)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 14.4.1 | **Client Quote page** on mobile (375px) | Cards stack vertically, signature works | |
| 14.4.2 | **CRM Kanban** on mobile | Horizontal scroll for columns | |
| 14.4.3 | **Producer Dashboard** on mobile | Cards stack, sections collapsible | |
| 14.4.4 | **Supplier portal** pages on mobile | All pages usable | |
| 14.4.5 | Sidebar on mobile | Collapses to hamburger menu | |

---

## SECTION 15: Core CRUD & Existing Features

### 15.1 Projects

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 15.1.1 | Create new project | Project created with legacyId format (e.g., "4829-24") | |
| 15.1.2 | Edit project details | Changes save | |
| 15.1.3 | View project list | All projects listed | |
| 15.1.4 | Search/filter projects | Filtering works | |
| 15.1.5 | Archive completed project (with all invoices) | Project archived | |

### 15.2 Suppliers (Producer View)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 15.2.1 | View Supplier Bank | List of all suppliers | |
| 15.2.2 | Search suppliers by name, category, region | Filters work | |
| 15.2.3 | View supplier detail | Full profile with products, documents, ratings | |
| 15.2.4 | Verify compliance badges on supplier detail | ✅/⚠️/🔴 per document | |
| 15.2.5 | Add new supplier manually | Supplier created | |
| 15.2.6 | Bulk import via CSV | Import wizard works | |

### 15.3 Clients

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 15.3.1 | View client list | All clients listed | |
| 15.3.2 | Create new client | Client created | |
| 15.3.3 | Edit client | Changes save | |
| 15.3.4 | Verify client linked to lead (if from CRM) | Link exists | |

### 15.4 Calendar

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 15.4.1 | View **Daily** calendar | Day events render | |
| 15.4.2 | View **Weekly** calendar | Week grid renders | |
| 15.4.3 | View **Monthly** calendar | Month grid renders | |
| 15.4.4 | Create event from calendar | Event modal opens, event saves | |
| 15.4.5 | Edit/delete event | Works | |

### 15.5 Kanban Board (Tasks)

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 15.5.1 | View Kanban board | Columns with task cards | |
| 15.5.2 | Drag & drop tasks between columns | Tasks move | |
| 15.5.3 | Create new task | Task created | |
| 15.5.4 | Edit task details | Changes save | |

---

## SECTION 16: RTL & Hebrew Verification

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 16.1 | Verify `dir="rtl"` on root element | All pages are RTL | |
| 16.2 | Verify Hebrew text renders correctly throughout | No broken characters | |
| 16.3 | Verify form labels align right | Labels on correct side | |
| 16.4 | Verify sidebar is on the right | Navigation on right side | |
| 16.5 | Verify tables read right-to-left | Column order correct | |
| 16.6 | Verify toasts appear with Hebrew text | All messages in Hebrew | |
| 16.7 | Verify PDF exports have readable Hebrew | Text correct (may be reversed for RTL) | |
| 16.8 | Verify email HTML is RTL-styled | Hebrew renders correctly | |
| 16.9 | Verify numbers and currencies display as ₪X,XXX | Israeli format | |

---

## SECTION 17: Error Handling & Edge Cases

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 17.1 | Navigate to non-existent route | Error boundary or 404 page with "חזור לדף הבית" button | |
| 17.2 | Open a `useQuery` page while backend is syncing | Loading state shown (not crash) | |
| 17.3 | Submit form with empty required fields | Validation errors in Hebrew | |
| 17.4 | Attempt action without permission (e.g., supplier accessing producer routes) | Redirected to correct dashboard | |
| 17.5 | Upload invalid file type (e.g., .exe where image expected) | Error message, no upload | |
| 17.6 | Open app in second tab, make change, verify first tab updates | Real-time sync via Convex | |
| 17.7 | Test with no internet (after initial load) | Graceful degradation, no white screen | |
| 17.8 | Send SMS/email with missing API keys | "Not configured" message, no crash | |

---

## SECTION 18: Performance Checks

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 18.1 | Dashboard initial load time | < 3 seconds | |
| 18.2 | Quote Editor with 10+ items | No noticeable lag | |
| 18.3 | CRM Kanban with 50+ leads | Smooth drag & drop | |
| 18.4 | Supplier Bank with 100+ suppliers | List renders, search is fast | |
| 18.5 | PDF generation for large quote | Completes within 5 seconds | |
| 18.6 | No console errors during normal usage | Console clean | |

---

## Bug Report Template

When you find an issue, record it with:

```
### Bug #XX — [Short Title]
**Section:** X.X.X
**Severity:** Critical / High / Medium / Low / Cosmetic
**Steps to reproduce:**
1. ...
2. ...
3. ...
**Expected:** ...
**Actual:** ...
**Screenshot:** (if applicable)
**Console errors:** (if any)
**Browser/Viewport:** Desktop / Mobile (XXXpx)
```

---

## Sign-Off

| Section | Tester | Date | Pass/Fail | Notes |
|---------|--------|------|-----------|-------|
| 1. Auth & Roles | | | | |
| 2. Admin Functions | | | | |
| 3. Supplier Module | | | | |
| 4. Quote Editor | | | | |
| 5. Availability & Booking | | | | |
| 6. Client Proposal | | | | |
| 7. Orders & Invoicing | | | | |
| 8. CRM Pipeline | | | | |
| 9. Field Operations | | | | |
| 10. Integrations | | | | |
| 11. Dashboards | | | | |
| 12. Digital Assets | | | | |
| 13. Settings | | | | |
| 14. Cross-System Polish | | | | |
| 15. Core CRUD | | | | |
| 16. RTL & Hebrew | | | | |
| 17. Error Handling | | | | |
| 18. Performance | | | | |

**Overall Status:** ☐ Pass / ☐ Fail
**Tested by:** _______________
**Date:** _______________
