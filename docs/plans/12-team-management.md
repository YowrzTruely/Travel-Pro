# Plan 12 — Team Management

**Phase:** 5 (Integration & Polish)
**Depends on:** Plan 02 (Multi-Role Auth)
**Blocks:** None

---

## Goal

Build team management for admins: create teams, assign producers to teams, set permissions per team, and scope data visibility by team membership.

---

## Current State

- No team concept exists
- All producers see all data
- Plan 01 adds `teams` table and `teamId` on `users`

---

## Implementation

### 1. Backend — Team Functions

**File: `convex/teams.ts`** (new)

```ts
// Queries
list            — all teams (admin only)
get             — single team by ID
listMembers     — users in a specific team
getMyTeam       — current user's team

// Mutations
create          — create team (admin only)
update          — update team name/permissions (admin only)
remove          — delete team, unlink members (admin only)
addMember       — add user to team (admin only)
removeMember    — remove user from team (admin only)
```

### 2. Admin — Team Management Page

**File: `src/app/components/admin/TeamManagement.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  ניהול צוותים                          [+ צוות חדש]  │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ צוות: "צפון"                         │            │
│  │ חברים: 3 (אדם, רונית, שי)          │            │
│  │ הרשאות: צפייה + עריכה               │            │
│  │ [ערוך] [מחק]                         │            │
│  ├─────────────────────────────────────┤            │
│  │ צוות: "מרכז"                         │            │
│  │ חברים: 2 (דנה, מיכל)               │            │
│  │ הרשאות: צפייה + עריכה + ספקים       │            │
│  │ [ערוך] [מחק]                         │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

### 3. Team Editor Modal

**File: `src/app/components/admin/TeamEditorModal.tsx`** (new)

```
┌────────────────────────────────────────┐
│  צוות חדש / עריכת צוות                  │
│                                        │
│  שם צוות: ___________                  │
│                                        │
│  חברים:                                 │
│  [Select users — multi-select dropdown] │
│                                        │
│  הרשאות:                                │
│  ☑ צפייה בכל הפרויקטים                  │
│  ☑ עריכת ספקים                          │
│  ☐ ניהול צוות                           │
│  ☐ אישור ספקים                          │
│                                        │
│  [שמור]  [ביטול]                        │
└────────────────────────────────────────┘
```

### 4. Admin — User Management Page

**File: `src/app/components/admin/UserManagement.tsx`** (new)

```
┌─────────────────────────────────────────────────────┐
│  ניהול משתמשים                                       │
│                                                     │
│  Tabs: [מפיקים] [ספקים] [אדמינים]                   │
│                                                     │
│  [Producers Tab]                                     │
│  שם | אימייל | צוות | סטטוס | פרויקטים | [ערוך]     │
│  אדם כהן | adam@... | צפון | פעיל | 12 | [✏️]      │
│  רונית לוי | ronit@... | מרכז | פעיל | 8 | [✏️]   │
│                                                     │
│  [Suppliers Tab]                                     │
│  שם עסק | איש קשר | קטגוריה | סטטוס | דירוג | [ערוך]│
│                                                     │
│  [Admins Tab]                                        │
│  שם | אימייל | [ערוך]                                │
└─────────────────────────────────────────────────────┘
```

### 5. Admin — Supplier Approval Page

**File: `src/app/components/admin/ApproveSuppliers.tsx`** (new)

Queue of pending supplier registrations:

```
┌─────────────────────────────────────────────────────┐
│  אישור ספקים                                         │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │ שם עסק: "יקב הגליל"                 │            │
│  │ איש קשר: משה לוי                    │            │
│  │ קטגוריה: יקבים | אזור: צפון         │            │
│  │ תאריך הרשמה: 01/03/2026             │            │
│  │ הוזמן ע"י: אדם כהן (מפיק)          │            │
│  │                                     │            │
│  │ [✓ אשר]  [✗ דחה]  [📋 פרטים]       │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

### 6. Permission Scoping (Stretch)

If permissions are enforced:
- Producers with `canViewAllProjects: false` only see their assigned projects
- Producers with `canEditSuppliers: false` can view but not modify suppliers
- Add permission checks in Convex queries/mutations

**Simple approach for MVP:** All producers see all data. Permissions are stored but not enforced yet. This can be tightened later.

### 7. Admin Routes

Already defined in Plan 02:
```ts
{ path: "/approve-suppliers", element: ApproveSuppliers },
{ path: "/users", element: UserManagement },
{ path: "/teams", element: TeamManagement },
```

---

## New Files

| File | Type |
|------|------|
| `convex/teams.ts` | Backend |
| `src/app/components/admin/TeamManagement.tsx` | Page |
| `src/app/components/admin/TeamEditorModal.tsx` | Component |
| `src/app/components/admin/UserManagement.tsx` | Page |
| `src/app/components/admin/ApproveSuppliers.tsx` | Page |

## Modified Files

| File | Changes |
|------|---------|
| `convex/users.ts` | Add team assignment mutations |
| `src/app/routes.ts` | Routes already in Plan 02 admin config |
