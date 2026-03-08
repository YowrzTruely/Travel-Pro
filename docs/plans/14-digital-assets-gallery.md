# Plan 14 — Digital Assets & Gallery

**Phase:** 6 (Dashboard & Assets — PRD Priority #5)
**Depends on:** Plan 11 (Field Operations — post-event data), Plan 09 (Supplier Orders)
**Blocks:** None
**PRD refs:** §7 (Digital Assets)

---

## Goal

Build digital assets generation: equipment list PDF, driver trip file, client trip file, post-event photo gallery upload, post-event participant ratings per supplier, PDF export for quotes. Plus placeholders for Save the Date (Canva — post-MVP) and B2C lead capture (ManyChat — post-MVP).

---

## Current State

- No PDF export capability
- No equipment list aggregation (added in Plan 06)
- No post-event gallery
- No participant rating system
- No trip files (driver/client versions)

---

## Implementation

### 1. PDF Export System (PRD §7)

**File: `convex/pdfExport.ts`** (new — Convex action)

```ts
// Quote PDF — branded client proposal
generateQuotePdf: action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    // Fetch project, quote items, timeline
    // Generate branded PDF:
    // - Trip name + opening paragraph
    // - Activity cards with images, descriptions (no supplier names)
    // - Visual timeline
    // - Total price + price per participant
    // - Equipment list
    // Upload to Convex file storage
    // Return download URL
  },
})

// Equipment List PDF
generateEquipmentPdf: action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    // Aggregate equipment from all quote items
    // Format: "חובה להביא: רישיון נהיגה, נעליים סגורות..."
    // Group by activity
    // Generate PDF
  },
})

// Driver Trip File (PRD §7)
generateDriverTripFile: action({
  args: { projectId: v.id("projects"), includePhones: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    // Times + locations only (minimal info)
    // Optionally include supplier phone numbers
    // Format: "09:30 - יקב הגולן, רמת הגולן | 12:15 - מסעדת הלבנון, צפת"
    // Generate PDF
  },
})

// Client Trip File (PRD §7)
generateClientTripFile: action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Client-friendly version
    // Activity descriptions + times + equipment needed
    // No prices, no supplier names
    // Marketing descriptions + images
    // Generate PDF
  },
})
```

**Libraries:** `@react-pdf/renderer` (supports Hebrew RTL) or `jspdf` + `jspdf-autotable`.

**Frontend integration:**

```
┌────────────────────────────────────┐
│  נכסים דיגיטליים — פרויקט ABC      │
│                                    │
│  [📄 PDF הצעת מחיר]               │
│  [🎒 רשימת ציוד PDF]              │
│  [🚗 תיק טיול לנהג PDF]          │
│  [👥 תיק טיול ללקוח PDF]         │
│  [📸 גלריית אירוע]               │
│  [⭐ דירוגי ספקים]                │
│                                    │
│  ── בקרוב ──                       │
│  [🎨 Save the Date (Canva)]       │
│  [📱 איסוף לידים B2C (ManyChat)] │
└────────────────────────────────────┘
```

### 2. Post-Event Photo Gallery (PRD §7)

**File: `src/app/components/gallery/EventGallery.tsx`** (new)

Producer uploads photos/videos from the event:

```
┌─────────────────────────────────────────────────────┐
│  גלריית אירוע — גיבוש חברת ABC                      │
│                                                     │
│  [📸 העלה תמונות] [📹 העלה סרטונים]                 │
│                                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │     │ │     │ │     │ │     │ │     │          │
│  │ 📷  │ │ 📷  │ │ 📷  │ │ 📷  │ │ 📷  │          │
│  │     │ │     │ │     │ │     │ │     │          │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘          │
│                                                     │
│  [📤 שתף גלריה עם משתתפים]                          │
│  → generates public gallery link                     │
└─────────────────────────────────────────────────────┘
```

**File: `src/app/components/gallery/PublicGallery.tsx`** (new — public, no auth)

Participant-facing gallery at `/gallery/:projectId`:

```
┌─────────────────────────────────────────────────────┐
│  תמונות מהטיול — גיבוש חברת ABC                     │
│                                                     │
│  [Photo grid]                                        │
│                                                     │
│  📤 גם אתם צילמתם? שתפו תמונות:                    │
│  [📸 העלה תמונות]                                    │
│                                                     │
│  ── להורדת התמונות ──                                │
│  ┌──────────────────────────────┐                   │
│  │ שם מלא: ___________          │                   │
│  │ טלפון: ___________           │                   │
│  │ ☑ אני מאשר/ת דיוור           │                   │
│  │ [הורד תמונות]                │                   │
│  └──────────────────────────────┘                   │
│                                                     │
│  Note: Photo download requires registration          │
│  → leads fed to ManyChat (post-MVP integration)     │
└─────────────────────────────────────────────────────┘
```

**Key PRD feature:** Gallery is a "honey pot" — participants must register to download photos, creating B2C leads.

**Note on storage:** Per PRD: "לבדוק את האופציה שתמונות כבדות לא ישמרו על השרת שלנו" — consider external image hosting (Cloudflare R2, S3) for heavy media files.

### 3. Post-Event Participant Ratings (PRD §7)

**File: `src/app/components/gallery/EventRatings.tsx`** (new)

After the event, participants receive a link to rate each supplier:

```
┌─────────────────────────────────────────────────────┐
│  דרגו את הטיול — גיבוש חברת ABC                     │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ סיור ביקב                           │            │
│  │ ⭐ ⭐ ⭐ ⭐ ⭐                        │            │
│  │ הערות: ___________                  │            │
│  ├─────────────────────────────────────┤            │
│  │ ארוחת צהריים                        │            │
│  │ ⭐ ⭐ ⭐ ⭐ ⭐                        │            │
│  │ הערות: ___________                  │            │
│  ├─────────────────────────────────────┤            │
│  │ סדנת יין                            │            │
│  │ ⭐ ⭐ ⭐ ⭐ ⭐                        │            │
│  │ הערות: ___________                  │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  [שלח דירוגים]                                       │
└─────────────────────────────────────────────────────┘
```

**Route:** `/rate/:projectId` (public, no auth)

Ratings flow:
1. After event, producer triggers "שלח סקר" → sends link to event organizer
2. Organizer shares with participants
3. Participants rate each activity (which maps to suppliers)
4. Ratings aggregate into supplier's average rating (Plan 05)

**Backend: `convex/supplierRatings.ts`** (extend from Plan 05)

```ts
createBulk: mutation({
  args: {
    projectId: v.id("projects"),
    participantName: v.optional(v.string()),
    ratings: v.array(v.object({
      supplierId: v.id("suppliers"),
      rating: v.number(),
      comment: v.optional(v.string()),
    })),
  },
  // Create rating records
  // Update supplier averageRating
})
```

### 4. Save the Date Placeholder (PRD §7 — Post-MVP)

```
┌────────────────────────────────────┐
│  🎨 Save the Date                  │
│                                    │
│  תכונה זו תהיה זמינה בקרוב!       │
│  חיבור ל-Canva לייצור תמונות      │
│  מעוצבות עם תאריך, אווירה ולו"ז.  │
│                                    │
│  [🔔 עדכנו אותי כשזמין]            │
└────────────────────────────────────┘
```

### 5. B2C Lead Capture Placeholder (PRD §7 — Post-MVP)

```
┌────────────────────────────────────┐
│  📱 איסוף לידים B2C               │
│                                    │
│  חיבור ל-ManyChat לשיווק דרך      │
│  WhatsApp/מסנג'ר. הורדת תמונות    │
│  מהגלריה דורשת הרשמה → פרטים     │
│  עוברים אוטומטית ל-ManyChat.      │
│                                    │
│  [🔔 עדכנו אותי כשזמין]            │
└────────────────────────────────────┘
```

### 6. Digital Assets Entry Point

**File: `src/app/components/orders/DigitalAssetsPanel.tsx`** (new)

Accessible from project detail page:

```ts
// Show only for projects with status "approved" or "completed"
// Links to all PDF generators + gallery + ratings
```

---

## New Files

| File | Type |
|------|------|
| `convex/pdfExport.ts` | Backend action |
| `src/app/components/gallery/EventGallery.tsx` | Page |
| `src/app/components/gallery/PublicGallery.tsx` | Page (public) |
| `src/app/components/gallery/EventRatings.tsx` | Page (public) |
| `src/app/components/orders/DigitalAssetsPanel.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/App.tsx` | Add public routes: /gallery/:id, /rate/:id |
| `src/app/components/QuoteEditor.tsx` | "ייצא PDF" + "נכסים דיגיטליים" buttons |
| `convex/supplierRatings.ts` | Add createBulk for participant ratings |
