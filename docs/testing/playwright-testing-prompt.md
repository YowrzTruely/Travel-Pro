# Playwright E2E Testing System Prompt — Eventos

Use this document as a system prompt for a Claude Code session that tests the Eventos app end-to-end using the Playwright MCP server.

---

## Context

Eventos is an Israeli event production SaaS platform. The UI is entirely Hebrew RTL. The app has 3 roles: producer, supplier, admin. The main flow goes: lead → proposal → availability check → client approval → supplier orders → field operations → project closure.

The app runs on:
- Frontend: `http://localhost:5173` (Vite + React)
- Backend: Convex (auto-deployed via `npx convex dev`)

## Prerequisites

Before starting tests, ensure both servers are running:
```bash
# Terminal 1
bun run dev

# Terminal 2
npx convex dev
```

Seed data if needed:
```bash
npx convex run seed:seedAll
bun run seed:auth
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Producer | `orangeayx@gmail.com` | `Inacce551bleEncrypt10n` |
| Supplier | `head0.25s@gmail.com` | `Unbre4k4ble4m4t10n` |
| Admin | `ro.levin@icloud.com` | `Inacce551bleEncrypt10n` |

## Testing Approach

### General Rules
1. **Always take a snapshot after navigation** to get current page refs
2. **Use `browser_wait_for`** with `textGone` after navigation to wait for loading states (common: "בודק הרשאות...", "טוען הצעת מחיר...")
3. **Use `browser_evaluate` with `el.click()`** when sticky bars cover buttons — Playwright's click will fail with "intercepted by pointer events" on elements hidden behind fixed/sticky bars
4. **Signature pads (canvas) cannot be automated** — the signature_pad library requires real pointer events, not dispatched events. Skip signature completion tests and note this limitation.
5. **Fill forms with `browser_fill_form`** — use the ref from the snapshot
6. **RTL layout** — the sidebar is on the RIGHT side. "left" in CSS terms is visually on the right.

### Login/Logout Flow
```
1. Navigate to http://localhost:5173
2. If already logged in → click "התנתק" button to logout
3. Fill email + password fields
4. Click "התחבר" button
5. Wait for dashboard to load (snapshot should show sidebar nav)
```

### Role Detection
After login, check the sidebar nav items to confirm the role:
- **Producer**: Shows "פרויקטים", "בנק ספקים", "לקוחות", "ניהול לידים"
- **Supplier**: Shows "מוצרים", "פרופיל", "זמינות", "בקשות"
- **Admin**: Shows "אישור ספקים", "משתמשים", "יומן פעילות"

---

## Test Scripts by Flow Step

### Step 1: Lead Intake (Producer)
```
1. Login as producer
2. Click sidebar: "ניהול לידים"
3. Click "+" button to create new lead
4. Fill: name, source, phone, event type, region, participants, budget
5. Submit
6. Verify: lead appears in "חדש" column of kanban
```

### Step 2: First Call + Needs Assessment (Producer)
```
1. On CRM page, click a lead card
2. In lead detail: click "רשום תקשורת"
3. Fill communication log (type: call, content)
4. Verify: communication appears in history
5. Navigate back, drag lead to "בירור צרכים" column
```

### Step 3: Build Proposal (Producer)
```
1. Click sidebar: "פרויקטים"
2. Click "+ פרויקט חדש" (in sidebar bottom)
3. Fill: name, client, participants, region
4. Click "צור פרויקט"
5. Verify: redirected to project page (not "פרויקט לא נמצא")
6. Click "+ הוספת רכיב חדש" (use evaluate+click if sticky bar blocks)
7. Select component type (e.g., "תחבורה")
8. Fill: name, supplier (SELECT from dropdown, don't type manually), description, cost, selling price
9. Click "הוסף רכיב"
10. Verify: item count updates, pricing summary updates
11. Click "תמחור ורווח יעד" tab — verify pricing table
12. Click "לו"ז הפעילות" tab — verify timeline section
```

### Step 4: Availability Check (Producer)
```
1. After adding item with linked supplier → "בדיקת זמינות" tab should appear
2. Click the tab
3. Verify: item shows with status "לא נבדק"
4. Click "שלח בקשה" next to the item
5. Verify: status changes to "ממתין לתשובה", toast appears
```

### Step 5: Supplier Response (Supplier)
```
1. Logout producer, login as supplier
2. Click sidebar: "בקשות"
3. In "בקשות ממתינות" tab — verify request appears
4. Click "אשר" (green) or "דחה" (red)
5. Verify: request moves to appropriate section
```

### Step 6: Send Proposal (Producer)
```
1. Login as producer, open project
2. Click "שלח הצעה ללקוח" (bottom sticky bar — use evaluate+click)
3. Verify dialog opens with:
   - Quote link (http://localhost:5173/quote/:id)
   - Channel buttons (וואטסאפ, SMS, אימייל)
   - Phone number field
4. Copy the link URL for step 7
```

### Step 7: Client Response (No Auth)
```
1. Navigate to the quote URL from step 6
2. Wait for "טוען הצעת מחיר..." to disappear
3. Verify page shows:
   - Hero image + title
   - Timeline summary
   - Activity details with prices
   - Price summary (per person + total)
4. Click "אישור הזמנה" → verify signature dialog opens
   - NOTE: Cannot complete signature via Playwright (canvas limitation)
5. Cancel, then click "בקשת שינויים" → verify change request dialog
   - Checkboxes for items + notes textarea
```

### Step 8: Supplier Orders (Producer)
```
Prerequisites: Project must be in "אושר" or "בביצוע" status.
If not achievable via signature, change status manually from projects list (three-dots menu → "שנה סטטוס")

1. Open project
2. Verify tabs now include "הזמנות וחשבוניות" and "נכסים דיגיטליים"
3. Click "הזמנות וחשבוניות" tab
4. Verify: orders auto-generated for suppliers with supplierId
5. Test status flow: pending → sent → confirmed
```

### Step 10: Field Operations (Producer)
```
1. Navigate to /field/:projectId
2. Wait for auth check
3. Verify: "מבצע שטח — [project name]" heading
4. Click "צור מבצע שטח"
5. Verify: stops auto-populated from quote items with suppliers
6. Click "התחל מבצע" → status becomes "בביצוע"
7. Click "סיים מבצע" → summary displayed
```

### Step 11: Project Closure (Producer)
```
Prerequisites: Project in "בביצוע" status

1. Open project
2. "הזמנות וחשבוניות" tab — upload invoices for each supplier
3. Verify invoice status changes: pending → received → verified
4. In bottom sticky bar — verify "סגור פרויקט" button appears (green)
5. Click "סגור פרויקט"
6. Verify: project status changes to "הושלם"
```

---

## Supplier Registration — 3 Entry Paths

### Path A: Manual Add by Producer
```
1. Login as producer
2. Click sidebar: "בנק ספקים"
3. Click "הוספת ספק חדש"
4. Fill: name, phone, categories (select up to 3), region
5. Submit
6. Verify: supplier appears in supplier bank list
7. Click supplier → verify detail page loads
```

### Path B: Self-Registration
```
1. Navigate to /register/supplier (no auth needed)
2. Verify form shows all fields:
   - שם מלא, שם עסק, אימייל, טלפון, סיסמה, אימות סיסמה
   - קטגוריה ראשית (8 options dropdown)
   - אזור פעילות (11 options dropdown — all Hebrew)
   - מוצר / שירות ראשון
3. Fill all required fields with test data
4. Click "צור חשבון ספק"
5. Verify: redirected to supplier dashboard
6. Verify sidebar shows: דשבורד, מוצרים, מסמכים, פרופיל + stage 2 items
```

### Path C: Auto-Registration via Availability Check
```
1. Login as producer
2. Open project → add item with supplier selected FROM DROPDOWN (not typed)
3. Click "בדיקת זמינות" tab → click "שלח בקשה"
4. Verify: status changes to "ממתין לתשובה"
5. Backend generates invite token for unlinked supplier
   (Cannot test public invite page without knowing token — check Convex dashboard)
6. If token known: navigate to /availability-invite/:token
7. Verify: shows event context (project name, date, participants)
8. Register via minimal form
```

## Supplier Profile & Pricing Flow

### Profile Editing
```
1. Login as supplier
2. Click sidebar: "פרופיל"
3. Verify fields present:
   - שם העסק, טלפון, אימייל, כתובת
   - 8 category toggle buttons (אטרקציות, מסעדות, הסעות, צילום, בידור, סדנאות, לינה, אחר)
   - 11 region toggle buttons (all Hebrew: גליל עליון through ים המלח)
   - אתר אינטרנט, פייסבוק
   - שעות פעילות, זמינות עונתית
   - אחוז מרווח ברירת מחדל (should show "20")
4. Toggle a category → verify limit of 3 (try selecting 4th → should be blocked)
5. Toggle a region → verify it highlights
6. Change a field → verify "שמור שינויים" button enables
```

### Product Editor — 4-Tier Pricing
```
1. Click sidebar: "מוצרים"
2. Verify: product list shows with price, timing, capacity
3. Click "עריכה" on a product
4. Verify product editor shows ALL sections:
   a. פרטי המוצר: name, description, unit (6 options: אדם/אירוע/יום/קבוצה/חבילה/יחידה)
   b. תמחור (4 שכבות):
      - מחיר מחירון (e.g., ₪150)
      - מחיר ישיר (e.g., ₪120)
      - מחיר הפקה (e.g., ₪100)
      - מחיר ללקוח (e.g., ₪180)
   c. תמחור כמותי:
      - סף כמות (e.g., 50)
      - מחירון כמותי, ישיר כמותי, הפקה כמותי
   d. זמנים: ברוטו (דקות), נטו (דקות)
   e. ציוד נדרש: list with add/remove
   f. קיבולת, מיקום, תנאי ביטול
   g. תוספות (Addons): name + price
   h. כלי AI: "צור תיאור שיווקי", "נקה תמונה"
5. Modify a price → click "שמור שינויים"
6. Verify: changes saved (close and reopen editor)
```

### Documents
```
1. Click sidebar: "מסמכים"
2. Verify document types shown:
   - ביטוח צד ג' (חובה)
   - ביטוח חבות מעבידים (חובה)
   - רישיון עסק (מומלץ)
3. Each doc shows: status (חסר/בתוקף/פג), upload button, "אין לי" button
4. Click "העלאה" → file picker opens
5. Upload a file → verify status changes
```

### Preview — "How I Look"
```
1. Click sidebar: "תצוגה מקדימה"
2. Verify heading: "כך אני נראה"
3. Verify toggle buttons: "תצוגת מפיק" / "תצוגת לקוח"
4. Verify shows:
   - Business name + icon
   - Category + region + rating
   - Verification status badge
   - Products with dual pricing (מחיר מחירון + מחיר הפקה)
   - Active promotions section
   - Missing fields section with links to edit
5. Click "תצוגת לקוח" → verify view changes
```

### Availability Calendar
```
1. Click sidebar: "זמינות"
2. Verify: monthly calendar displays
3. Click a date → verify toggle (available/unavailable)
4. Navigate months (next/prev buttons)
```

### Requests & Bookings (Supplier Side)
```
1. Click sidebar: "בקשות"
2. Verify 3 tabs: "בקשות ממתינות", "שריונות פעילים", "היסטוריה"
3. If pending requests exist:
   - Verify: shows project name, date, participants
   - Click "אשר" → verify moves to bookings tab
   - Or click "דחה" → verify moves to history
4. If no requests: verify empty state "אין בקשות ממתינות"
5. IMPORTANT: Requests are supplier-specific — only shows requests for THIS supplier's supplierId
```

### Supplier Onboarding Flow (Full)
6. Click "אישור ספקים" → approve the pending supplier
```

## Admin Flow
```
1. Login as admin
2. "אישור ספקים" → approve/reject pending suppliers
3. "משתמשים" → change user roles/status
4. "יומן פעילות" → filter by entity type and action
```

---

## Common Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| Button blocked by sticky bar | Use `browser_evaluate` with `(el) => el.click()` passing the ref |
| Page shows "בודק הרשאות..." | Use `browser_wait_for` with `textGone: "בודק הרשאות..."` |
| Signature pad won't activate | Canvas library limitation — skip signature completion, test dialog rendering only |
| Quote page loading forever | Use `browser_wait_for` with `textGone: "טוען הצעת מחיר..."` |
| Login form pre-filled | Clear fields with `browser_fill_form` before entering new credentials |
| Snapshot refs stale after navigation | Always take a fresh `browser_snapshot` after any page change |

## Verification Checklist

After each test step, verify:
- [ ] No console errors (check snapshot output)
- [ ] Toast notifications appear for actions (success/error)
- [ ] Breadcrumbs show Hebrew labels (not English IDs)
- [ ] Regions display in Hebrew (not English codes like "center")
- [ ] RTL layout is correct (text right-aligned, sidebar on right)
- [ ] Tab switching shows only the selected section (not all sections)
- [ ] Glass indicator slides smoothly on tab bar
