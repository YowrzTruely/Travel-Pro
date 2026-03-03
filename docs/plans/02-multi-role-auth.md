# Plan 02 — Multi-Role Auth & Onboarding

**Phase:** 1 (Foundation)
**Depends on:** Plan 01 (Data Model)
**Blocks:** Plans 03–13

---

## Goal

Transform the app from single-role to 3 user roles (admin, producer, supplier) with role-gated routing, separate onboarding flows, and admin approval for suppliers.

---

## Current State

- `LoginPage.tsx` — email/password login + signup, no role selection
- `AuthContext.tsx` — `useAuth()` returns `{ user, loading, login, signup, logout }`
- `App.tsx` — `AppInner()` gates all routes behind auth, except `/quote/:id`
- No `users` table — auth only uses Convex Auth's internal tables
- `Layout.tsx` — single sidebar for all users

---

## Implementation

### Step 1: User Profile Backend

**File: `convex/users.ts`** (new)

```ts
// Queries
getCurrent          — get current user's profile by auth identity
getByAuthId         — lookup by authId
getByEmail          — lookup by email
list                — admin only: list all users
listByRole          — admin only: list users filtered by role
listPendingSuppliers — admin only: suppliers with status="pending"

// Mutations
createProfile       — called after first login, creates users record with role
updateProfile       — update name, phone, company, avatar
approveSupplier     — admin sets supplier status to "approved"
rejectSupplier      — admin sets supplier status to "suspended" + optional reason
updateRole          — admin only: change user role
```

**Key logic:**
- After Convex Auth signup, the app must create a `users` record
- `getCurrent` uses `ctx.auth.getUserIdentity()` to find the auth user, then looks up the `users` record by `authId`

### Step 2: Auth Context Extension

**File: `src/app/components/AuthContext.tsx`** (modify)

Add to the `useAuth()` return value:
```ts
interface AuthState {
  user: { id: string; email: string; name: string; role: Role } | null;
  profile: UserProfile | null;  // full users record from Convex
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
}
```

After successful auth, query `api.users.getCurrent` to load the profile. If no profile exists (first login), redirect to onboarding.

### Step 3: Registration Flow Modification

**File: `src/app/components/LoginPage.tsx`** (modify)

Add role selection to signup form:

```
┌──────────────────────────────────┐
│  הרשמה ל-TravelPro              │
│                                  │
│  אני:                            │
│  ◉ מפיק טיולים                   │
│  ○ ספק שירותים                   │
│                                  │
│  שם מלא: ___________             │
│  אימייל: ___________             │
│  סיסמה: ___________              │
│  [If producer] שם חברה: ______   │
│  [If supplier] שם עסק: ______   │
│  [If supplier] קטגוריה: [▼]     │
│  [If supplier] אזור: [▼]        │
│                                  │
│  [הרשמה]                          │
└──────────────────────────────────┘
```

- Admin accounts are created manually (no self-signup)
- Supplier signup → status = "pending" until admin approves

### Step 4: Onboarding Screens

**File: `src/app/components/onboarding/ProducerOnboarding.tsx`** (new)

Simple welcome screen after first producer signup:
- "Welcome to TravelPro" message
- Brief feature tour (3-4 slides)
- "Go to Dashboard" button
- Sets `onboardingCompleted: true`

**File: `src/app/components/onboarding/SupplierOnboarding.tsx`** (new)

3-step wizard for approved suppliers:
1. **Profile** — verify/complete business info (name, phone, address, category, region)
2. **Products** — add at least one product/service
3. **Documents** — upload required documents (business license, insurance)
- Sets `onboardingCompleted: true` after step 3

**File: `src/app/components/onboarding/SupplierPending.tsx`** (new)

Waiting screen for suppliers not yet approved:
```
┌──────────────────────────────────┐
│  ⏳ החשבון שלך ממתין לאישור       │
│                                  │
│  קיבלנו את בקשת ההרשמה שלך.     │
│  צוות TravelPro יבדוק את הפרטים │
│  ויאשר את חשבונך בהקדם.         │
│                                  │
│  נודיע לך במייל כשהחשבון יאושר.  │
└──────────────────────────────────┘
```

### Step 5: Role-Gated Routing

**File: `src/app/App.tsx`** (modify)

Update `AppInner()` decision tree:

```
1. If URL is /quote/:id → publicRouter (no auth)
2. If authLoading → spinner
3. If !user → LoginPage
4. If user but no profile → call createProfile mutation
5. If supplier + status="pending" → SupplierPending screen
6. If !onboardingCompleted → role-specific onboarding
7. If role="admin" → adminRouter
8. If role="producer" → producerRouter (current main router)
9. If role="supplier" → supplierRouter
```

**File: `src/app/routes.ts`** (modify → split into 3 route configs)

```ts
// Producer routes (current routes, mostly unchanged)
export const producerRoutes = [ /* existing routes */ ];

// Supplier routes (new)
export const supplierRoutes = [
  { path: "/", element: SupplierDashboard },
  { path: "/products", element: SupplierMyProducts },
  { path: "/documents", element: SupplierMyDocuments },
  { path: "/availability", element: SupplierAvailability },
  { path: "/requests", element: SupplierRequests },
  { path: "/messages", element: MessagesPage },
  { path: "/ratings", element: SupplierRatings },
  { path: "/settings", element: SupplierSettings },
];

// Admin routes (new)
export const adminRoutes = [
  { path: "/", element: AdminDashboard },
  { path: "/approve-suppliers", element: ApproveSuppliers },
  { path: "/users", element: UserManagement },
  { path: "/teams", element: TeamManagement },
  { path: "/stats", element: PlatformStats },
  { path: "/activity-log", element: ActivityLog },
  { path: "/settings", element: AdminSettings },
];
```

### Step 6: Role-Based Layout

**File: `src/app/components/Layout.tsx`** (modify)

The sidebar navigation items should change based on user role:

```ts
const producerNavItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/crm", label: "CRM / לידים", icon: Target },
  { path: "/projects", label: "פרויקטים", icon: FolderOpen },
  { path: "/suppliers", label: "בנק ספקים", icon: Building2 },
  { path: "/clients", label: "לקוחות", icon: UserCircle },
  { path: "/documents", label: "מסמכים", icon: FileText },
  { path: "/kanban", label: "קנבן", icon: Columns },
  { path: "/messages", label: "הודעות", icon: MessageSquare },
  { path: "/calendar", label: "יומן", icon: Calendar },
];

const supplierNavItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/products", label: "המוצרים שלי", icon: Package },
  { path: "/documents", label: "המסמכים שלי", icon: FileText },
  { path: "/availability", label: "לוח זמינות", icon: CalendarCheck },
  { path: "/requests", label: "בקשות & הזמנות", icon: ClipboardList },
  { path: "/messages", label: "הודעות", icon: MessageSquare },
  { path: "/ratings", label: "הדירוג שלי", icon: Star },
];

const adminNavItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/approve-suppliers", label: "אישור ספקים", icon: ShieldCheck },
  { path: "/users", label: "ניהול משתמשים", icon: Users },
  { path: "/teams", label: "ניהול צוותים", icon: UsersRound },
  { path: "/stats", label: "סטטיסטיקות", icon: BarChart3 },
  { path: "/activity-log", label: "לוג פעילות", icon: ScrollText },
];
```

### Step 7: Supplier Invitation Flow

**File: `src/app/components/SupplierInviteModal.tsx`** (new)

Modal in SupplierBank for producers to invite new suppliers:
- Email + supplier name fields
- Creates a `users` record with status="pending" and `invitedBy`
- Creates/links a `suppliers` record
- (Future: sends email/SMS/WhatsApp — for now, just creates the record)

---

## New Files Summary

| File | Type |
|------|------|
| `convex/users.ts` | Backend functions |
| `src/app/components/onboarding/ProducerOnboarding.tsx` | Page |
| `src/app/components/onboarding/SupplierOnboarding.tsx` | Page |
| `src/app/components/onboarding/SupplierPending.tsx` | Page |
| `src/app/components/SupplierInviteModal.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `convex/schema.ts` | (done in Plan 01) |
| `src/app/components/AuthContext.tsx` | Add profile, role to auth state |
| `src/app/components/LoginPage.tsx` | Add role selection to signup |
| `src/app/App.tsx` | Role-gated routing logic |
| `src/app/routes.ts` | Split into 3 route configs |
| `src/app/components/Layout.tsx` | Role-based sidebar nav |
