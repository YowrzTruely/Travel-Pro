# Eventos — Flow Completion Status Report

**Date:** 2026-03-14
**Reviewed against:** https://sort-sans-92624834.figma.site/ (10 flow diagrams)

---

## Overall Status: 100% Flow Coverage

All 10 Figma flow diagrams are now fully implemented in the app.

---

## Flow-by-Flow Breakdown

### Flow 1: Main Flow (זרימה ראשית) — End-to-End

| Step | Description | Status |
|------|------------|--------|
| ליד נכנס | Lead enters from channels (web, WhatsApp, manual) | Implemented |
| שיחה ראשונה + בירור צרכים | First call + needs assessment | Implemented |
| בניית הצעה ב-Proposal Builder | Build proposal with components, pricing, timeline | Implemented |
| בדיקת זמינות ספקים | Check supplier availability via SMS/Email/WhatsApp/In-App | Implemented |
| שליחת הצעה ללקוח | Send interactive quote link to client | Implemented |
| תגובת הלקוח | Client approve / request changes / reject with digital signature | Implemented |
| הזמנות לספקים | Generate orders per supplier with notifications | Implemented |
| תיאום מול הלקוח (4 ימים לפני) | Automated client coordination 4 days before event | Implemented (cron) |
| חמ"ל שטח — יום האירוע | Field operations HQ with real-time management | Implemented |
| סגירת פרויקט | Project closure with invoice tracking | Implemented |

### Flow 2: Supplier Registration (רישום ספק) — 3 Entry Paths

| Step | Description | Status |
|------|------------|--------|
| הוספה ידנית ע"י מפיק | Producer manually adds supplier (name, phone, category, region) | Implemented |
| ספק נוצר כרשומה "חיצונית" | External record without self-access | Implemented |
| קישור רישום עצמי | Self-registration via shared link | Implemented |
| רישום אוטומטי דרך בדיקת זמינות | Auto-register when availability check sent to unknown number | Implemented |
| שלב 1 — כניסה בסיסית | Basic info: name, phone, email, category, region, first product | Implemented |
| שלב 2 — פרופיל מלא | Products & services (gradual, recommended) | Implemented |
| שלב 3 — מסמכים | Insurance docs become mandatory after first deal | Implemented |

### Flow 3: Supplier Profile & Pricing (פרופיל ספק ותמחור)

| Step | Description | Status |
|------|------------|--------|
| פרופיל ציבורי | Public supplier profile view | Implemented |
| קטגוריות (רב-בחירה) | Multi-select categories | Implemented |
| 11 אזורי פעילות | 11 geographic activity regions | Implemented |
| מוצרים ושירותים | Products with images, descriptions, upsellers, equipment, timing | Implemented |
| תמחור — 4 מחירים | 4 pricing layers: direct, agent, group, event | Implemented |
| ברירת מחדל 20% רווח | Default 20% profit margin, adjustable per product | Implemented |
| ניהול מסמכים וביטוחים | Document management with 30/7 day expiry alerts | Implemented |

### Flow 4: Proposal Builder

| Step | Description | Status |
|------|------------|--------|
| קליטת פרטי לקוח | Client details: name, company, participants, budget, region | Implemented |
| בחירת רכיבים מבנק הספקים | Component selection: transport, food, attractions, accommodation | Implemented |
| בדיקת זמינות (אופציונלי) | Optional availability check with multi-channel notifications | Implemented |
| הרכבת ההצעה | Visual timeline, images, marketing text, AI opening paragraph | Implemented |
| חלופות ואפסלרים | 2-4 alternatives per component + product add-ons | Implemented |
| שליחה ללקוח | Interactive link via SMS/Email/WhatsApp | Implemented |

### Flow 5: Availability Check & Reservation (בדיקת זמינות ושריון)

| Step | Description | Status |
|------|------------|--------|
| "בדוק זמינות" button | Per-component in Proposal Builder | Implemented |
| שליחת התראה ב-4 ערוצים | SMS + WhatsApp + Email + In-App notifications | Implemented |
| ספק רשום — רואה בדשבורד | Registered supplier sees request in dashboard | Implemented |
| ספק חדש — לינק הרשמה | New supplier gets registration + approval link | Implemented |
| תגובת ספק | 3 options: available / not available / propose alternative | Implemented |
| שריון נוצר | Reservation with expiry timer + reminder cron | Implemented |
| ביטול פרויקט → ביטול שריונות | Auto-cancel all reservations + notify suppliers | Implemented |

### Flow 6: Client Proposal (הצעה ללקוח)

| Step | Description | Status |
|------|------------|--------|
| לקוח מקבל קישור | SMS / Email / WhatsApp link to interactive page | Implemented |
| דף הצעה מעוצב | Designed mobile-first page, hides supplier names/prices | Implemented |
| אשר + חתימה דיגיטלית | Digital signature component | Implemented |
| בקש שינויים | Client marks what to change, producer gets notification | Implemented |
| שכפול גרסה (V2, V3) | Version duplication with full history | Implemented |
| שתף ללא מחירים | Share without prices mode | Implemented |

### Flow 7: Supplier Orders (הזמנות לספקים)

| Step | Description | Status |
|------|------------|--------|
| עסקה נסגרה → ייצור הזמנות | Auto-generate orders when deal closes | Implemented |
| ספק מקבל הזמנה | Supplier notified via SMS/Email/WhatsApp | Implemented |
| שבוע לפני — תזכורת | Automated reminder cron 7 days before | Implemented |
| יומיים לפני — עדכון כמויות | Automated supplier quantity update 2 days before | Implemented (cron) |
| ביטול הזמנה | Cancel with reason + multi-channel notification to supplier | Implemented |

### Flow 8: Leads & CRM (לידים ו-CRM)

| Step | Description | Status |
|------|------------|--------|
| קליטת ליד — דיגיטלי (Webhook) | HTTP webhook at `/api/leads/webhook` for Facebook/Instagram/TikTok/etc. | Implemented |
| קליטת ליד — WhatsApp | WhatsApp Business webhook at `/api/whatsapp/webhook` with signature validation | Implemented |
| קליטת ליד — ידני | Manual entry with full field set | Implemented |
| תיק לקוח אוטומטי | Auto-created lead detail page | Implemented |
| ציר סטטוסים | Kanban pipeline: חדש → יצירת קשר → בירור צרכים → בניית תוכנית → הצעה נשלחה → אושר → נסגר-זכייה / נסגר-הפסד | Implemented |
| ליד → פרויקט (זכייה) | Convert to project button | Implemented |
| סיבת הפסד — חובה | Mandatory loss reason modal (יקר / מתחרה / נעלם / אחר) | Implemented |

### Flow 9: Field Operations HQ (חמ"ל שטח)

| Step | Description | Status |
|------|------------|--------|
| פתיחת חמ"ל | "Open HQ" buttons on dashboard for today's events | Implemented |
| בדיקת כמות משתתפים | Actual participant count vs. planned | Implemented |
| מעקב שעות: יעד vs. אמת | Planned vs. actual times per station | Implemented |
| כפתור "הסטת זמנים" | One-click shift all times + auto-notify suppliers via SMS/WhatsApp | Implemented |
| עדכון כמויות → מסעדה | Auto-notify food/catering suppliers on quantity change | Implemented |
| חתימת ספק על ביצוע | Digital signature pad per supplier | Implemented |
| הוצאות דרך | Upload road expenses (fuel, parking, tips) in real-time | Implemented |
| ביקורת פעילות | Post-operation review and summary | Implemented |

### Flow 10: Digital Assets (נכסים דיגיטליים)

| Step | Description | Status |
|------|------------|--------|
| נכסים מהפרויקט | Auto-generated digital assets panel | Implemented |
| Save the Date | Shareable image with date, mood, schedule | Implemented |
| רשימת ציוד | Equipment list PDF generation | Implemented |
| תיק טיול לנהג | Driver trip file (times + locations only) | Implemented |
| תיק טיול ללקוח | Client trip file (full details + images) | Implemented |
| גלריית תמונות | Post-event photo gallery with participant uploads | Implemented |
| איסוף לידים B2C ("פח דבש") | Registration gate (name + phone + marketing consent) to download photos | Implemented |
| דירוג האירוע | Public rating page — participants rate each supplier (1-5 stars + comments) | Implemented |

---

## Infrastructure Summary

### Notification System
- **SMS**: Twilio API integration
- **Email**: Resend API integration
- **WhatsApp**: wa.me link generation
- **In-App**: Convex notifications table
- **Multi-channel dispatcher**: `sendMultiChannel` sends via all configured channels simultaneously

### Automated Crons (7 total)
| Cron | Schedule (UTC) | Purpose |
|------|---------------|---------|
| Check document expiry | 06:00 daily | Flag expired supplier documents |
| Send document reminders | 07:00 daily | Remind suppliers of expiring docs |
| Check reservation expiry | 05:00 daily | Alert on bookings expiring in 2 days |
| Deactivate expired promotions | 00:00 daily | Auto-disable expired supplier promotions |
| Send order reminders | 08:00 daily | Remind suppliers of events in 7 days |
| Client coordination (4 days before) | 06:00 daily | Remind client to confirm participants/dietary/contact |
| Supplier quantity update (2 days before) | 06:30 daily | Send updated quantities to all event suppliers |

### Webhook Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/leads/webhook` | POST | Capture leads from Facebook/Instagram/TikTok/LinkedIn ads |
| `/api/whatsapp/webhook` | GET | WhatsApp Business webhook verification |
| `/api/whatsapp/webhook` | POST | Incoming WhatsApp messages → auto-create leads |
| `/slng/dlr` | POST | SMS delivery report tracking |

### Public Pages (no auth)
| Route | Purpose |
|-------|---------|
| `/quote/:id` | Interactive client quote page |
| `/register/supplier` | Supplier self-registration |
| `/availability-invite/:token` | Availability check + registration for new suppliers |
| `/supplier/:id/public` | Public supplier profile |
| `/gallery/:projectId` | Post-event photo gallery with B2C lead gate |
| `/rate/:projectId` | Post-event supplier rating by participants |

---

## Key Metrics
- **React components**: ~135 .tsx files
- **Convex backend functions**: 30+ files
- **shadcn/ui components**: ~46
- **Database tables**: 25+
- **Cron jobs**: 7
- **Role-based portals**: 3 (Producer, Supplier, Admin)
