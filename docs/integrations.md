# TravelProv Integrations

## Overview

All external integrations are configured via environment variables in the **Convex Dashboard** (Settings > Environment Variables). Every integration gracefully degrades — if credentials are missing, the feature returns a "not configured" message instead of crashing.

---

## SMS — SLNG

**Provider**: [SLNG](https://slng.co.il) (Israeli SMS gateway)

**Env vars**:
| Variable | Description |
|---|---|
| `SLNG_USERNAME` | Account email |
| `SLNG_PASSWORD` | Account password |
| `SLNG_FROM_MOBILE` | Sender ID (up to 12 English chars, e.g. `EVENTOS`) |

**How it works**: Backend POSTs to `https://slng5.com/Api/SendSmsJsonBody.ashx` with the message and recipient phone number. SLNG returns a status and delivery GUID. Delivery reports are received via a webhook at `/slng/dlr` which updates the notification's delivery status in the database.

**Files**: `convex/notificationSender.ts` (sendSMS), `convex/http.ts` (DLR webhook), `convex/notifications.ts` (updateDeliveryStatus)

---

## Email — Resend

**Provider**: [Resend](https://resend.com) (transactional email)

**Env vars**:
| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from Resend dashboard |
| `EMAIL_FROM_ADDRESS` | *(optional)* Sender address, e.g. `EVENTOS <noreply@eventos.co.il>`. Requires domain verification in Resend. |

**How it works**: Backend POSTs to `https://api.resend.com/emails`. Message body is wrapped in an RTL-styled HTML div for proper Hebrew rendering. Free tier allows 100 emails/day.

**Files**: `convex/notificationSender.ts` (sendEmail)

---

## WhatsApp — wa.me Links

**Provider**: None (uses WhatsApp's universal link scheme)

**Env vars**: None required.

**How it works**: Israeli phone numbers are converted to international format (`050...` → `97250...`). A `wa.me` link is constructed with the message pre-filled as a URL parameter. The frontend opens this link in a new tab, which launches the user's own WhatsApp with the message ready to send. No Business API needed — messages come from the user's personal/business WhatsApp.

**Files**: `convex/notificationSender.ts` (sendWhatsApp), `convex/sendQuote.ts` (whatsapp channel)

---

## AI — OpenRouter

**Provider**: [OpenRouter](https://openrouter.ai) → Google Gemini 2.0 Flash

**Env vars**:
| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | API key from OpenRouter dashboard |

**How it works**: Each AI feature sends a tailored Hebrew system prompt + user context to OpenRouter's chat completions API, which routes to `google/gemini-2.0-flash-001`. All prompts are in Hebrew and return Hebrew text.

**Features**:
| Function | Purpose | Input |
|---|---|---|
| `generateMarketingDescription` | Hebrew marketing copy for supplier profile | Supplier name, category, region, notes, URLs |
| `generateTripName` | Creative Hebrew trip name | Activities, region, participant count |
| `generateOpeningParagraph` | Opening paragraph for client proposals | Activities, region, participant count |
| `analyzeInvoice` | Extract data from invoice images (vision) | Invoice image from Convex storage |
| `cleanProductImage` | *Deferred* — requires dedicated image processing API | — |

**Fallback**: If API key is not set, each function returns its original static/template text.

**Files**: `convex/aiSupplier.ts`

---

## PDF Export — Client-Side (jsPDF)

**Provider**: None (runs entirely in the browser)

**Env vars**: None required.

**Dependencies**: `jspdf`, `jspdf-autotable`

**How it works**: The frontend fetches project data, quote items, and timeline events via Convex queries, then builds the PDF in-memory using jsPDF. Tables are rendered with jspdf-autotable. Hebrew text is character-reversed for RTL display (jsPDF limitation). The finished PDF triggers a browser download.

**Documents**:
| Function | Output |
|---|---|
| `generateQuotePdf` | Branded client proposal with summary, item table, costs, timeline |
| `generateEquipmentPdf` | Equipment requirements list grouped by activity |
| `generateDriverTripFile` | Route schedule, addresses, supplier contacts for the driver |
| `generateClientTripFile` | Client-friendly schedule — activities and timeline, no costs |

**Files**: `src/app/components/utils/pdfGenerator.ts`, `src/app/components/orders/DigitalAssetsPanel.tsx`

---

## Quote Send Dialog

**Combines**: SMS + Email + WhatsApp into a unified send flow.

**How it works**: When a producer clicks "שלח הצעה ללקוח" in the QuoteEditor, a dialog opens with the public quote URL (copyable), a channel selector (WhatsApp / SMS / Email), and an input field for the recipient. The backend action `sendQuoteToClient` builds a message containing the quote link, then delegates to the appropriate channel handler. For WhatsApp, it returns a wa.me link that the frontend opens. For SMS/Email, the backend sends directly.

**Files**: `src/app/components/QuoteSendDialog.tsx`, `convex/sendQuote.ts`, `src/app/components/QuoteEditor.tsx`

---

## Password Change

**Provider**: Internal (uses Scrypt from `lucia`, same hashing as `@convex-dev/auth`)

**Env vars**: None required.

**How it works**: The action verifies the user is authenticated, looks up their auth account by email in the `authAccounts` table, verifies the current password hash using Scrypt, then hashes the new password and updates the record. Minimum 8 characters enforced.

**Files**: `convex/passwordChange.ts`, `convex/passwordChangeHelpers.ts`, `src/app/components/settings/SettingsPage.tsx`

---

## Admin Pages

**No external integrations** — uses existing Convex queries and mutations.

| Page | Route | Purpose |
|---|---|---|
| Approve Suppliers | `/approve-suppliers` | Review and approve/reject pending supplier registrations |
| User Management | `/users` | Search users, change roles and statuses |

**Files**: `src/app/components/admin/ApproveSuppliers.tsx`, `src/app/components/admin/UserManagement.tsx`, `convex/users.ts` (updateUserAdmin mutation)

---

## Environment Variables Summary

| Variable | Service | Required For |
|---|---|---|
| `SLNG_USERNAME` | SLNG | SMS |
| `SLNG_PASSWORD` | SLNG | SMS |
| `SLNG_FROM_MOBILE` | SLNG | SMS sender name |
| `OPENROUTER_API_KEY` | OpenRouter | AI features |
| `RESEND_API_KEY` | Resend | Email |
| `EMAIL_FROM_ADDRESS` | Resend | Email sender (optional) |

All other features (WhatsApp, PDF, password change, admin pages) work without any API keys.
