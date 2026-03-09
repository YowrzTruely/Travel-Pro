# Plan 02 — Multi-Role Auth & Supplier Registration — COMPLETE

**Status:** DONE
**Phase:** 1 (Foundation)
**Depends on:** Plan 01 (Data Model)
**Blocks:** Plans 03–15
**PRD refs:** §3.1 (Supplier Registration), §9 (Technical Requirements)

---

## Goal

Transform the app from single-role to 3 user roles (admin, producer, supplier) with role-gated routing, supplier self-registration via shareable links, and a 3-stage progressive profile flow per PRD §3.1.

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

### Step 3: Registration Flow — 3 Entry Points (PRD §3.1)

**Entry Point A: Manual by Producer**
- Producer adds supplier from SupplierBank → creates `suppliers` record + `users` record with `registrationSource: "manual"`

**Entry Point B: Self-Registration Link**
- Shareable link (for WhatsApp/Facebook/Telegram groups) → `/register/supplier`
- Simple signup form with Stage 1 fields (see below)
- Creates `users` record with `registrationSource: "self_registration"`

**Entry Point C: Availability Invite**
- Producer sends availability request to unregistered supplier (by phone number)
- System sends WhatsApp/SMS with magic link: "היי {ספק}, ה{מפיק} בודק איתך זמינות..."
- Supplier clicks link → registration page pre-filled with context
- Creates `users` record with `registrationSource: "availability_invite"`

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

### Step 4: 3-Stage Progressive Profile (PRD §3.1)

**Stage 1 — Basic Entry (required):**
- Full name / business name
- Phone
- Email
- Primary category (closed list — PRD §3.2)
- Operating region (11 regions — PRD §3.2)
- First product/service

**Stage 2 — Full Profile (recommended, not required):**
- Logo + images per product (AI cleanup — Gemini Flash)
- Short + extended description per product (AI marketing descriptions)
- Upsells (add-on products per service)
- 4-tier pricing (list/direct/producer/client — PRD §3.3)
- Operating hours + seasonality
- Equipment requirements
- Gross/net time per activity
- Documents and licenses

**Stage 3 — Post-First-Deal (required after closing):**
- Upload insurance documents (mandatory)
- Business license
- Kosher certificate (if food-related)

**File: `src/app/components/onboarding/SupplierOnboarding.tsx`** (new)

3-step progressive wizard matching PRD stages.

**File: `src/app/components/onboarding/ProducerOnboarding.tsx`** (new)

Simple welcome screen for producers:
- "Welcome to TravelPro" message
- Brief feature tour (3-4 slides)
- "Go to Dashboard" button
- Sets `onboardingCompleted: true`

**File: `src/app/components/onboarding/SupplierPending.tsx`** (new)

Waiting screen for suppliers not yet approved.

### Step 5: Role-Gated Routing

**File: `src/app/App.tsx`** (modify)

Update `AppInner()` decision tree:

```
1. If URL is /quote/:id → publicRouter (no auth)
2. If URL is /register/supplier → supplier self-registration (no auth)
3. If URL is /availability-invite/:token → availability invite flow (no auth)
4. If authLoading → spinner
5. If !user → LoginPage
6. If user but no profile → call createProfile mutation
7. If supplier + status="pending" → SupplierPending screen
8. If !onboardingCompleted → role-specific onboarding
9. If role="admin" → adminRouter
10. If role="producer" → producerRouter (current main router)
11. If role="supplier" → supplierRouter
```

**File: `src/app/routes.ts`** (modify → split into 3 route configs)

```ts
export const producerRoutes = [ /* existing routes */ ];

export const supplierRoutes = [
  { path: "/", element: SupplierDashboard },
  { path: "/products", element: SupplierMyProducts },
  { path: "/documents", element: SupplierMyDocuments },
  { path: "/availability", element: SupplierAvailability },
  { path: "/requests", element: SupplierRequests },
  { path: "/profile", element: SupplierProfile },
  { path: "/promotions", element: SupplierPromotions },
  { path: "/ratings", element: SupplierRatings },
  { path: "/settings", element: SupplierSettings },
];

export const adminRoutes = [
  { path: "/", element: AdminDashboard },
  { path: "/approve-suppliers", element: ApproveSuppliers },
  { path: "/users", element: UserManagement },
  { path: "/stats", element: PlatformStats },
  { path: "/activity-log", element: ActivityLog },
  { path: "/settings", element: AdminSettings },
];
```

### Step 6: Role-Based Layout

**File: `src/app/components/Layout.tsx`** (modify)

Sidebar navigation items change based on user role:

```ts
const producerNavItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/crm", label: "CRM / לידים", icon: Target },
  { path: "/projects", label: "פרויקטים", icon: FolderOpen },
  { path: "/suppliers", label: "בנק ספקים", icon: Building2 },
  { path: "/clients", label: "לקוחות", icon: UserCircle },
  { path: "/documents", label: "מסמכים", icon: FileText },
  { path: "/calendar", label: "יומן", icon: Calendar },
];

const supplierNavItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/products", label: "המוצרים שלי", icon: Package },
  { path: "/documents", label: "המסמכים שלי", icon: FileText },
  { path: "/availability", label: "לוח זמינות", icon: CalendarCheck },
  { path: "/requests", label: "בקשות & הזמנות", icon: ClipboardList },
  { path: "/promotions", label: "מבצעים", icon: Percent },
  { path: "/ratings", label: "הדירוג שלי", icon: Star },
];

const adminNavItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/approve-suppliers", label: "אישור ספקים", icon: ShieldCheck },
  { path: "/users", label: "ניהול משתמשים", icon: Users },
  { path: "/stats", label: "סטטיסטיקות", icon: BarChart3 },
  { path: "/activity-log", label: "לוג פעילות", icon: ScrollText },
];
```

### Step 7: Supplier Self-Registration Page

**File: `src/app/components/SupplierSelfRegister.tsx`** (new)

Public page at `/register/supplier` for self-registration:
- Only Stage 1 fields
- After submit: creates user + supplier records
- Shows SupplierPending screen while awaiting admin approval
- Shareable link for WhatsApp/Facebook groups

### Step 8: Availability Invite Flow

**File: `src/app/components/AvailabilityInvitePage.tsx`** (new)

Public page at `/availability-invite/:token`:
- Pre-filled with event context (date, service, producer name)
- If supplier already registered → login and approve/decline
- If not registered → register (Stage 1 only) then approve/decline
- Message template per PRD §3.1: "היי {ספק}, ה{מפיק} בודק איתך זמינות..."

---

## New Files Summary

| File | Type |
|------|------|
| `convex/users.ts` | Backend functions |
| `src/app/components/onboarding/ProducerOnboarding.tsx` | Page |
| `src/app/components/onboarding/SupplierOnboarding.tsx` | Page |
| `src/app/components/onboarding/SupplierPending.tsx` | Page |
| `src/app/components/SupplierSelfRegister.tsx` | Page (public) |
| `src/app/components/AvailabilityInvitePage.tsx` | Page (public) |

## Modified Files

| File | Changes |
|------|---------|
| `convex/schema.ts` | (done in Plan 01) |
| `src/app/components/AuthContext.tsx` | Add profile, role to auth state |
| `src/app/components/LoginPage.tsx` | Add role selection to signup |
| `src/app/App.tsx` | Role-gated routing logic + public routes |
| `src/app/routes.ts` | Split into 3 route configs |
| `src/app/components/Layout.tsx` | Role-based sidebar nav |
