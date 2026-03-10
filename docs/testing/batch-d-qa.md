# Batch D — QA Instructions

## Prerequisites
1. Start both dev servers: `bun run dev` + `npx convex dev`
2. Seed data: `npx convex run seed:seedAll`
3. Have 3 test accounts ready: **producer**, **supplier**, **admin** roles
4. Browser DevTools console open (to verify stub logs)

---

## Plan 12: Dashboards & Morning HQ

### 12.1 — Producer Dashboard (`/`)
Login as **producer**.

- [ ] Dashboard loads with title "לוח בקרה - מפיק אירועים" and welcome message with user's email
- [ ] Loading spinner shows briefly, then content appears with entry animations
- [ ] **Ticker/marquee** at top scrolls Hebrew text with orange LIVE dot

**Morning HQ widget (חמ"ל בוקר):**
- [ ] Shows "אין אירועים מתוכננים להיום ומחר" if no events match today/tomorrow
- [ ] If calendar events or projects exist for today/tomorrow, shows them grouped under "היום" / "מחר"
- [ ] Each event row shows title, time, participants, region
- [ ] "פתח חמ"ל" button navigates to `/field/:projectId`
- [ ] The ⓘ help icon next to title opens a popover with explanation text

**Quote Heat Meter (מד חום הצעות):**
- [ ] Shows 4 bars: נשלחו / בדיון / סגורות / אבודות with animated fill
- [ ] Close rate percentage shown at bottom
- [ ] Counts match project statuses in the DB

**Urgent Alerts (התראות דחופות):**
- [ ] Red alerts for expired documents, orange for soon-to-expire
- [ ] Yellow alerts for expiring bookings and missing invoices
- [ ] "אין התראות דחופות" with green checkmark if no alerts
- [ ] Clicking an alert navigates to the relevant link

**Open Reservations (שריונות פתוחים):**
- [ ] Table shows supplier, project, date, expiry date, participants
- [ ] Expiry dates within 3 days show in red
- [ ] "צפה" button navigates to project detail
- [ ] Empty state: "אין שריונות פתוחים"

**Stats Cards:**
- [ ] 4 cards: לידים חדשים / הצעות שנשלחו / פרויקטים מאושרים / סה"כ פרויקטים
- [ ] Numbers animate up (count-up effect)
- [ ] Clicking cards navigates to `/projects`
- [ ] Mini sparkline charts appear on each card

**Pipeline & Revenue:**
- [ ] Pipeline funnel shows 5 stages with animated bars
- [ ] Revenue ring animates to show percentage of ₪500,000 target
- [ ] Revenue, profit, margin figures display correctly

**Drag & Drop Reorder:**
- [ ] Hover over a widget section — grip handle appears (top-right)
- [ ] Drag a widget to a new position — widgets reorder
- [ ] Refresh page — order is preserved (localStorage)
- [ ] Clear localStorage entry `producer-dashboard-widget-order` — resets to default

**Collapsible Sections:**
- [ ] Click section header — content collapses/expands
- [ ] ChevronUp/ChevronDown icon toggles correctly

**Activity Feed:**
- [ ] "פעילות אחרונה" section at bottom with 3 static items
- [ ] Each item shows icon, title, subtitle, time

### 12.2 — Supplier Dashboard (`/`)
Login as **supplier**.

- [ ] Shows "לוח בקרה - ספק" with supplier name greeting
- [ ] If supplier profile has no `supplierId` → shows warning message
- [ ] **4 stat cards**: בקשות ממתינות / הזמנות פעילות / דירוג ממוצע / מסמכים חסרים
- [ ] Card values match actual DB data for this supplier

**Pending Availability Requests:**
- [ ] Shows requests with status "pending"
- [ ] "אשר" (green) and "דחה" (red) buttons work
- [ ] Toast shows "בקשה אושרה" or "בקשה נדחתה"
- [ ] After action, request disappears from pending list (real-time)
- [ ] Empty state: "אין בקשות ממתינות"

**Active Promotions:**
- [ ] Shows supplier's active promotions with title, discount, expiry date
- [ ] Empty state: "אין מבצעים פעילים כרגע"

**Document Alerts:**
- [ ] Red background for expired docs, yellow for warning
- [ ] "עדכן" button navigates to `/documents`
- [ ] Empty state: "כל המסמכים תקינים" with green checkmark

**Recent Ratings:**
- [ ] Shows last 5 ratings with star display (filled/unfilled)
- [ ] Comment and participant name displayed if present
- [ ] Empty state: "אין דירוגים עדיין"

### 12.3 — Admin Dashboard (`/`)
Login as **admin**.

- [ ] Shows "לוח בקרה - מנהל מערכת" with admin name
- [ ] **4 stat cards**: מפיקים רשומים / ספקים רשומים / ממתינים לאישור / סה"כ פרויקטים

**Supplier Approval Queue:**
- [ ] Shows suppliers with `registrationStatus === "pending"`
- [ ] Each row: name, category, region, email
- [ ] "אשר" button sets `verificationStatus: "verified"`, toast "ספק אושר בהצלחה"
- [ ] "דחה" button sets `verificationStatus: "unverified"`, toast "ספק נדחה"
- [ ] Empty state: "אין ספקים ממתינים לאישור"

**KPI Cards:**
- [ ] 4 KPIs: ספקים רשומים / מפיקים / הצעות שנבנו / השלמת פרופילים %
- [ ] Profile completion = % of suppliers with name+category+phone+email+region filled

**Recent Activity:**
- [ ] Shows current stats summary (static rows based on DB counts)

### 12.4 — HelpTooltip Component
- [ ] ⓘ icon visible next to all widget titles in ProducerDashboard
- [ ] Click ⓘ → popover appears with Hebrew help text
- [ ] Click outside popover → closes
- [ ] Verify `videoUrl` prop renders a link if provided (add one manually to test)

### 12.5 — Routing
- [ ] Producer login → `/` shows ProducerDashboard (not old Dashboard)
- [ ] Supplier login → `/` shows SupplierDashboard
- [ ] Admin login → `/` shows AdminDashboard
- [ ] Old Dashboard.tsx still exists but is not routed

---

## Plan 13: Notifications System

### 13.1 — NotificationsPanel (Bell Icon)
Login as any role.

- [ ] Bell icon in top bar (Layout header)
- [ ] If no notifications: "אין התראות חדשות" with bell icon
- [ ] Unread count badge appears (red circle with number, "9+" if >9)
- [ ] Click bell → popover dropdown opens

**Create test notifications** via Convex dashboard or console:
```js
// In convex dashboard mutations tab, run notifications.create with:
// userId: <your user _id>, type: "new_lead", title: "ליד חדש", body: "דני כהן - Facebook", channel: "in_app"
```

- [ ] Notification appears in panel immediately (real-time)
- [ ] Unread notifications have warm background (`bg-[#fffaf3]`)
- [ ] Read notifications have white background
- [ ] Colored dot appears next to unread notification title
- [ ] Correct icon and color per notification type:
  - `availability_request` → Calendar, purple
  - `availability_approved` → CheckCircle, green
  - `availability_declined` → XCircle, red
  - `booking_expiring` → Clock, yellow
  - `new_lead` → Target, blue
  - `doc_expiring` → AlertTriangle, yellow
  - `doc_expired` → AlertOctagon, red
  - `supplier_approved` → ShieldCheck, green
  - `order_sent` → Send, blue
  - Unknown type → Bell, gray (fallback)

**Grouping:**
- [ ] Notifications grouped by "היום" / "אתמול" / "קודם"
- [ ] Sticky group headers while scrolling

**Actions:**
- [ ] Click notification → marks as read + navigates to `link` URL
- [ ] "סמן הכל כנקרא" button → all notifications marked read, badge disappears
- [ ] Relative time in Hebrew: "עכשיו", "לפני 5 דקות", "לפני שעה", "אתמול", etc.

### 13.2 — Backend: notifications.ts
- [ ] `listForUser` returns empty array for unauthenticated user
- [ ] `unreadCount` returns 0 for unauthenticated user
- [ ] `markAllRead` marks all unread for the authenticated user only
- [ ] `createForUser` (internal) creates notification and schedules external delivery if `triggerExternal: true`
- [ ] `createBulk` (internal) creates notifications for multiple userIds

### 13.3 — Backend: notificationSender.ts
- [ ] `sendWhatsApp`, `sendSMS`, `sendEmail` are stub actions that log to console
- [ ] Check Convex logs: messages like `[WhatsApp STUB] To: ...` appear
- [ ] `sendMultiChannel` dispatches to individual channel stubs

### 13.4 — Cron Jobs (convex/crons.ts)
- [ ] Verify cron registration: `check-document-expiry` (6 UTC), `send-document-reminders` (7 UTC) — pre-existing
- [ ] New: `check reservation expiry alerts` (5 UTC) — calls `bookings.sendExpiryAlerts`
- [ ] New: `deactivate expired promotions` (0 UTC) — calls `supplierPromotions.deactivateExpired`
- [ ] Test `sendExpiryAlerts`: create a booking with `expiresAt` within 2 days → should create notification
- [ ] Test `deactivateExpired`: create a promotion with `expiresAt` in the past → run manually → `isActive` should be false

---

## Plan 14: Digital Assets & Gallery

### 14.1 — DigitalAssetsPanel (from project detail)
Login as **producer**, navigate to a project.

- [ ] Panel shows heading "נכסים דיגיטליים" with icon
- [ ] **4 PDF buttons**: הצעת מחיר PDF / רשימת ציוד PDF / קובץ נהג / קובץ לקוח
- [ ] Click any PDF button → loading spinner on that button → toast with stub message "PDF generation will be available soon"
- [ ] Check console for `[PDF STUB] Generating...` log
- [ ] **2 public links**: גלריית אירוע / דירוג פעילויות — open in new tab
- [ ] **2 "coming soon" items**: Save the Date / B2C Lead Capture — visually grayed out with "בקרוב" badge, not clickable

### 14.2 — EventGallery (Producer Gallery Management)
Navigate to the gallery from DigitalAssetsPanel or directly.

- [ ] Header shows "גלריית אירוע" with camera icon
- [ ] Stats bar: "X תמונות" and "Y סרטונים" counters

**Upload:**
- [ ] Click "העלאת תמונות/סרטונים" → file picker opens
- [ ] Select 1+ images → uploading spinner → toast "X קבצים הועלו בהצלחה"
- [ ] Images appear in grid immediately (real-time)
- [ ] Upload video → shows Video icon placeholder in grid
- [ ] Stats update after upload

**Photo Grid:**
- [ ] Images display in responsive grid (2 cols mobile → 5 cols desktop)
- [ ] Hover over image → overlay with delete button
- [ ] Click delete (red trash icon) → item removed, toast "הפריט נמחק"

**Share Link:**
- [ ] Click "שתף עם משתתפים" → share panel appears with public URL
- [ ] Click "העתק" → copies URL to clipboard, toast "הקישור הועתק ללוח"
- [ ] URL format: `{origin}/gallery/{projectId}`

### 14.3 — PublicGallery (`/gallery/:projectId`)
Open the public gallery URL in an **incognito window** (no auth).

- [ ] Page loads without authentication
- [ ] Header: "גלריית האירוע" with camera icon
- [ ] Stats bar shows photo/video counts
- [ ] Photo grid displays all uploaded items

**Participant Upload:**
- [ ] Optional name and phone fields
- [ ] Click "בחירת קבצים להעלאה" → select files → upload works
- [ ] Uploaded items appear with participant name attribution

**Download Registration (Lead Capture):**
- [ ] "הורדת תמונות (דורש הרשמה)" button visible
- [ ] Click → registration form appears: שם מלא, טלפון, marketing consent checkbox
- [ ] Submit without name/phone → toast error "נא למלא שם וטלפון"
- [ ] Fill name + phone → submit → toast "נרשמתם בהצלחה!"
- [ ] After registration: download buttons appear on image hover
- [ ] Check Convex logs for `[GALLERY] Participant registered: ...`

**Empty Gallery:**
- [ ] If no items: "אין תמונות או סרטונים עדיין" with "היו הראשונים להעלות"

### 14.4 — EventRatings (`/rate/:projectId`)
Open the ratings URL in an **incognito window** (no auth).

- [ ] Page loads without authentication
- [ ] Header: "דרגו את הפעילויות" with star icon
- [ ] Optional participant name field at top

**Rating Activities:**
- [ ] Shows only quote items that have a `supplierId` (supplier-linked activities)
- [ ] If no rateable items: "אין פעילויות לדירוג"
- [ ] Each activity card shows: name, description (if any), icon (if any)
- [ ] 5 clickable stars per activity (LTR direction for stars)
- [ ] Click star → fills orange up to that star
- [ ] Comment textarea per activity (optional)

**Submit:**
- [ ] Click "שליחת דירוגים" without rating anything → toast error "נא לדרג לפחות פעילות אחת"
- [ ] Rate at least 1 activity → submit → loading spinner → thank-you screen
- [ ] Thank-you screen: green checkmark, "תודה רבה!", "הדירוגים שלכם נשמרו בהצלחה"
- [ ] Verify in DB: `supplierRatings` records created with correct supplierId, rating, comment
- [ ] Verify supplier's `averageRating` and `totalRatings` updated

### 14.5 — Public Routes (App.tsx)
- [ ] `/gallery/someProjectId` → renders PublicGallery (no login required)
- [ ] `/rate/someProjectId` → renders EventRatings (no login required)
- [ ] Invalid project ID → page renders but with empty/loading state (no crash)
- [ ] Existing public routes still work: `/quote/:id`, `/register/supplier`, `/availability-invite/:token`, `/supplier/:id/public`

---

## Cross-Cutting Checks

### RTL Layout
- [ ] All new pages display correctly in RTL (text right-aligned, layout mirrored)
- [ ] Forms and inputs respect RTL except phone numbers (LTR)
- [ ] Stars in ratings display LTR (left-to-right: 1→5)

### Mobile Responsiveness
- [ ] ProducerDashboard: stats cards stack 2-col on mobile, widgets stack vertically
- [ ] PublicGallery: photo grid 2-col on mobile, 4-col on desktop
- [ ] EventRatings: single column, usable on mobile
- [ ] DigitalAssetsPanel: buttons stack on mobile
- [ ] NotificationsPanel popover: readable width on mobile

### Real-time Updates
- [ ] Open producer dashboard in 2 tabs → create a project in tab A → stats update in tab B
- [ ] Create notification via backend → bell badge updates instantly
- [ ] Upload gallery photo → appears in both producer gallery and public gallery tabs

### Error Handling
- [ ] All async actions wrapped in try/catch with Hebrew toast messages
- [ ] Network failure → error toast, no crash
- [ ] Loading states show spinner for all data-dependent views
│ Manual testing checklist:                                                                    │
│ 1. npx convex dev — schema deploys without errors                                            │
│ 2. Supplier recommendation: search suppliers in quote editor, see recommendation chips       │
│ 3. Duplicate detection: create supplier with existing name/phone, see warning                │
│ 4. Settings: all 4 tabs render, profile save works                                           │
│ 5. Progressive disclosure: supplier with stage1 sees locked promotions/ratings               │
│ 6. Activity log: admin sees log page, can filter                                             │
│ 7. Mobile: test key pages at 375px viewport width                                            │
│ 8. AI stubs: no errors when called (return placeholder values)

