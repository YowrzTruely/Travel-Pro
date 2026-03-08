# Plan 08 — Client Proposal Page

**Phase:** 3 (Proposal Builder — PRD Priority #2)
**Depends on:** Plan 06 (Quote Editor Enhancements), Plan 07 (Availability & Booking)
**Blocks:** Plan 09 (Supplier Orders & Invoicing)
**PRD refs:** §4.2 (Quote Structure), §4.3 (Versions & Changes), §4.1 (Quote Flow)

---

## Goal

Enhance the public client-facing quote page (`/quote/:id`) with: client alternative selection (2-4 options per item), "share without prices" mode, digital signature, upsells display, post-approval confirmation, and version management (V1/V2/V3).

---

## Current State

- `ClientQuote.tsx` — public page (no auth), shows quote items, timeline, approve button
- `convex/publicQuote.ts` — `getQuote` (omits cost data) and `approveQuote` mutations
- Page works but only has "approve" — no alternatives, upsells, signatures, or sharing

---

## Implementation

### 1. Enhanced Client Proposal Layout (PRD §4.2)

**File: `src/app/components/ClientQuote.tsx`** (major modify)

```
┌─────────────────────────────────────────────────────┐
│  [Header — branded]                                  │
│  שם טיול + פסקת פתיחה (AI-generated from §3.1)      │
│                                                     │
│  [Summary]                                           │
│  תאריך: 15/04/2026 | 45 משתתפים | צפון | גיבוש      │
│                                                     │
│  [Activity Cards — per PRD §4.2]                     │
│  ┌─────────────────────────────────┐                │
│  │ [תמונה מהספק — full width]      │                │
│  │ סיור ביקב הגולן                  │                │
│  │ "חוויה ייחודית בלב הגולן..."     │ (AI desc)     │
│  │ 10:00-12:00 | ⏱ 2 שעות          │                │
│  │ 🎒 ציוד: נעליים סגורות          │                │
│  │                                 │                │
│  │ תוספות זמינות:                   │                │
│  │ ☐ פלטת גבינות (+₪35/אדם)       │ ← client picks │
│  │ ☐ מדריך צמוד (+₪200)           │                │
│  │                                 │                │
│  │ 💡 חלופות:                       │                │
│  │ ○ יקב כרמל (₪90/אדם)          │ ← client picks │
│  │ ○ יקב ברקן (₪84/אדם)          │                │
│  │                                 │                │
│  │ [בקש חלופה אחרת]                │                │
│  └─────────────────────────────────┘                │
│                                                     │
│  [Visual Timeline — if not hidden]                   │
│  10:00 ──── סיור ביקב ────── 12:00                   │
│  12:30 ──── ארוחת צהריים ──── 14:00                  │
│  14:30 ──── סדנת יין ──────── 16:30                  │
│                                                     │
│  [Total Price — if prices shown]                     │
│  ₪25,000 | 45 משתתפים | ₪555/משתתף                  │
│                                                     │
│  NOTE: Supplier names NOT shown (per PRD §4.2)       │
│  Only activity descriptions and images               │
│                                                     │
│  [Action Buttons]                                    │
│  [✓ אשר הצעה + חתום]  ← big green CTA               │
│  [📞 פנה לנציג]        ← WhatsApp/phone              │
│  [↺ בקש שינויים]       ← opens change form           │
│  [📤 שתף עם הצוות]     ← share without prices         │
└─────────────────────────────────────────────────────┘
```

**Key PRD §4.2 requirements:**
- Activity cards show: image, time, marketing description (NO supplier name), gross/net time
- Upsells shown per item — client can check/uncheck
- 2-4 alternatives per item — client can select preferred option
- Equipment requirements listed per activity
- Price per participant shown

### 2. "Share Without Prices" Mode (PRD §4.3)

**File: `src/app/components/ClientQuote.tsx`** (modify)

When client clicks "שתף עם הצוות":
1. Generate a special link: `/quote/:id?mode=noPrices`
2. This link shows everything EXCEPT pricing
3. Colleagues can view activities, timeline, images — but no costs
4. Useful for getting feedback from team without revealing budget

**Implementation:**
```ts
// In publicQuote query, check URL param
// If mode=noPrices: omit all price fields from response
// Show banner: "תצוגה ללא מחירים — לקבלת פידבק מהצוות"
```

### 3. Digital Signature (PRD §4.3)

**File: `src/app/components/ClientQuoteSignature.tsx`** (new)

When client clicks "אשר הצעה + חתום":

```
┌─────────────────────────────────────┐
│  חתימה דיגיטלית                      │
│                                     │
│  שם מלא: ___________               │
│  תפקיד: ___________                │
│  חברה: ___________                  │
│                                     │
│  [Canvas for signature drawing]      │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │      ← חתום כאן            │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│  [נקה] [אשר חתימה]                  │
│                                     │
│  ☑ אני מאשר/ת את ההצעה             │
│    על כל תנאיה                      │
│                                     │
│  [אשר וחתום ✓]                      │
└─────────────────────────────────────┘
```

**Implementation:**
- HTML5 Canvas for signature drawing
- Save signature as image → Convex file storage
- Store `digitalSignatureId` on project
- After signing: project status → "אושר", confirmation screen shown

### 4. Client Alternative Selection (PRD §4.2)

When client selects a different alternative for an item:
1. Client clicks radio button on preferred alternative
2. Selection saved via `publicQuote.selectAlternative` mutation
3. Producer sees the client's selections in QuoteEditor
4. Original item vs selected alternative clearly marked

**Backend addition to `convex/publicQuote.ts`:**
```ts
selectAlternative: mutation({
  args: {
    projectId: v.id("projects"),
    quoteItemId: v.id("quoteItems"),
    selectedAlternativeIndex: v.number(),
  },
  // Update quoteItem to mark which alternative the client prefers
})

toggleUpsell: mutation({
  args: {
    projectId: v.id("projects"),
    quoteItemId: v.id("quoteItems"),
    addonId: v.id("productAddons"),
    selected: v.boolean(),
  },
  // Toggle upsell selection, update total
})
```

### 5. Change Request Flow (PRD §4.3)

**File: `src/app/components/ClientQuoteChangeRequest.tsx`** (new)

When client clicks "בקש שינויים":

```
┌─────────────────────────────────────────────────────┐
│  בקשת שינויים                                        │
│                                                     │
│  סמן את הפריטים שאתה רוצה לשנות:                     │
│                                                     │
│  ☐ סיור ביקב הגולן                                  │
│    סיבה: ○ יקר ○ לא מעניין ○ תאריך ○ אחר: ____    │
│  ☐ ארוחת צהריים                                     │
│    סיבה: ○ יקר ○ לא מעניין ○ תאריך ○ אחר: ____    │
│                                                     │
│  הערות כלליות: _______________                       │
│                                                     │
│  [שלח בקשה]                                          │
└─────────────────────────────────────────────────────┘
```

Producer sees change requests as a banner in QuoteEditor (from Plan 06).

### 6. Version Management (PRD §4.3)

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Quote versioning V1, V2, V3:

```
┌─────────────────────────────────────────┐
│  גרסה: V2         [V1 ▾] [V2 ▾] [V3+] │
│                                         │
│  V1: נשלחה 01/03 — שונתה ע"י לקוח      │
│  V2: נשלחה 05/03 — ממתינה לאישור  ◀    │
│                                         │
│  [שכפל גרסה חדשה →]                     │
└─────────────────────────────────────────┘
```

- Each version is a snapshot of quote items
- Client always sees latest version
- Producer can view/compare previous versions
- "שכפל גרסה" → creates new version with current items
- Version number stored in `projects.quoteVersion`

### 7. Post-Approval Confirmation (PRD §4.1)

After client signs and approves:

```
┌─────────────────────────────────┐
│  ✅ ההצעה אושרה בהצלחה!         │
│                                 │
│  {שם הטיול}                     │
│  תאריך: 15/04/2026             │
│  מספר פרויקט: 4829-24           │
│                                 │
│  נציג יצור איתך קשר בקרוב      │
│  לתיאום הפרטים האחרונים.        │
│                                 │
│  [📥 הורד PDF של ההצעה]         │
└─────────────────────────────────┘
```

After approval:
1. Project status → "אושר"
2. Notification to producer + all involved suppliers
3. Trigger booking confirmations (Plan 07)
4. Trigger supplier order generation (Plan 09)

---

## New Files

| File | Type |
|------|------|
| `src/app/components/ClientQuoteSignature.tsx` | Component |
| `src/app/components/ClientQuoteChangeRequest.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/components/ClientQuote.tsx` | Alternatives selection, upsells, share mode, signature, post-approval |
| `src/app/components/QuoteEditor.tsx` | Version management, change request banner |
| `convex/publicQuote.ts` | selectAlternative, toggleUpsell, requestChanges, signature storage |
| `convex/schema.ts` | Add quoteChangeRequests table (Plan 01), digitalSignatureId on projects |
