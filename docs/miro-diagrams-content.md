# TravelPro - Miro Flow Diagrams Content
*Ready to create in Miro once MCP is connected*

---

## Diagram 1: Current Architecture (AS-IS)

### Layout: Left-to-Right Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CURRENT ARCHITECTURE (AS-IS)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐    │
│  │   BROWSER     │     │   VERCEL      │     │     SUPABASE CLOUD       │    │
│  │              │     │              │     │                          │    │
│  │  React 18.3  │────▶│  Static SPA  │     │  ┌────────────────────┐ │    │
│  │  Vite 6.3    │     │  dist/       │     │  │   Auth Service     │ │    │
│  │  Tailwind 4.1│     │  SPA Rewrite │     │  │   (Password Only)  │ │    │
│  │  Radix UI    │     │              │     │  │   signInWithPwd()  │ │    │
│  │  React Router│     └──────────────┘     │  └────────┬───────────┘ │    │
│  │  Hebrew RTL  │                          │           │             │    │
│  │              │     Bearer Token         │  ┌────────▼───────────┐ │    │
│  │  13 API      │─────(anon key)──────────▶│  │  Edge Functions    │ │    │
│  │  Groups      │                          │  │  (Hono on Deno)    │ │    │
│  │              │◀────JSON response────────│  │  52 Endpoints      │ │    │
│  │  24 Pages    │                          │  │  CORS: All Origins │ │    │
│  │  46 UI Comps │                          │  └────────┬───────────┘ │    │
│  │              │                          │           │             │    │
│  └──────────────┘                          │  ┌────────▼───────────┐ │    │
│                                            │  │  PostgreSQL        │ │    │
│                                            │  │  KV Store (JSONB)  │ │    │
│                                            │  │  12 Data Models    │ │    │
│                                            │  └────────────────────┘ │    │
│                                            │                          │    │
│                                            │  ┌────────────────────┐ │    │
│                                            │  │  Storage Bucket    │ │    │
│                                            │  │  Images (7d URLs)  │ │    │
│                                            │  └────────────────────┘ │    │
│                                            │                          │    │
│                                            └──────────────────────────┘    │
│                                                                             │
│  NO PAYMENTS ❌    NO OAUTH ❌    NO REAL-TIME ❌    NO EMAIL ❌           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Miro Elements:
- **Blue box**: Browser/Frontend (React, Vite, Tailwind, Radix UI)
- **Green box**: Vercel (Static SPA hosting)
- **Orange box**: Supabase Cloud (Auth, Edge Functions, DB, Storage)
- **Red labels**: Missing capabilities (payments, OAuth, real-time, email)
- **Arrows**: Data flow direction with labels

---

## Diagram 2: MVP Architecture (TO-BE)

### Layout: Left-to-Right Flow with New Services

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MVP ARCHITECTURE (TO-BE)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐                                     │
│  │   BROWSER     │     │   VERCEL      │     ┌──────────────────────┐      │
│  │              │     │              │     │     CLERK CLOUD        │      │
│  │  React 18.3  │────▶│  Static SPA  │     │                      │      │
│  │  Vite 6.3    │     │  dist/       │     │  ✅ OAuth Providers  │      │
│  │  Tailwind 4.1│     │  SPA Rewrite │     │  ✅ Hosted UI        │      │
│  │  Radix UI    │     │              │     │  ✅ JWT Tokens       │      │
│  │  React Router│     └──────────────┘     │  ✅ User Management  │      │
│  │  Hebrew RTL  │                          │  ✅ MFA Support      │      │
│  │              │─────Clerk JWT───────────▶│                      │      │
│  │  ClerkProvider│◀───Session/User─────────│  @clerk/clerk-react  │      │
│  │              │                          └──────────────────────┘      │
│  │  13 API      │                                                        │
│  │  Groups      │     ┌──────────────────────────┐                       │
│  │              │     │     SUPABASE CLOUD         │                       │
│  │              │     │                            │                       │
│  │  24 Pages    │     │  ┌────────────────────┐   │                       │
│  │  + Payment   │     │  │  Edge Functions     │   │                       │
│  │    Pages     │     │  │  (Hono on Deno)     │   │                       │
│  │              │────▶│  │  52+ Endpoints      │   │                       │
│  │  46+ UI Comps│◀────│  │  + Clerk JWT Verify │   │                       │
│  │              │     │  │  + Polar Webhooks   │   │                       │
│  └──────────────┘     │  └────────┬────────────┘   │                       │
│                       │           │                 │                       │
│                       │  ┌────────▼────────────┐   │                       │
│                       │  │  PostgreSQL          │   │                       │
│                       │  │  KV Store (JSONB)    │   │                       │
│                       │  │  12+ Data Models     │   │                       │
│                       │  │  + Subscriptions     │   │                       │
│                       │  └─────────────────────┘   │                       │
│                       │                            │                       │
│                       │  ┌─────────────────────┐   │                       │
│                       │  │  Storage Bucket      │   │                       │
│                       │  │  Images (7d URLs)    │   │                       │
│                       │  └─────────────────────┘   │                       │
│                       └──────────────────────────────┘                       │
│                                                                             │
│                       ┌──────────────────────┐                              │
│                       │     POLAR              │                              │
│                       │                        │                              │
│                       │  ✅ Subscriptions      │                              │
│                       │  ✅ One-time Payments  │                              │
│                       │  ✅ Checkout Flow      │                              │
│                       │  ✅ Customer Portal    │                              │
│                       │  ✅ Webhooks           │                              │
│                       │                        │◀── Webhook ── Edge Functions │
│                       │  polar.sh SDK          │                              │
│                       └──────────────────────┘                              │
│                                                                             │
│  ✅ PAYMENTS (Polar)  ✅ OAUTH (Clerk)  ⏳ REAL-TIME  ⏳ EMAIL             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Miro Elements:
- **Blue box**: Browser/Frontend (same + Clerk components + Payment pages)
- **Green box**: Vercel (unchanged)
- **Purple box**: Clerk Cloud (NEW - Auth provider)
- **Orange box**: Supabase Cloud (DB/Storage/Edge Functions - auth removed)
- **Yellow box**: Polar (NEW - Payments)
- **Green labels**: New capabilities gained
- **Arrows**: Updated data flow with Clerk JWT

---

## Diagram 3: Auth Flow - Current vs MVP

### Section A: Current Auth Flow (Supabase)

```
┌─────────────────────────────────────────────────────────────────┐
│              CURRENT AUTH FLOW (Supabase Auth)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User                                                           │
│   │                                                             │
│   ▼                                                             │
│  LoginPage.tsx ──── email + password ────▶ Supabase Auth        │
│   │                                         │                   │
│   │  signInWithPassword()                   │ Session created   │
│   │                                         │                   │
│   ▼                                         ▼                   │
│  AuthContext.tsx ◀── onAuthStateChange ──── Session + Token      │
│   │                                                             │
│   │  user, session, accessToken                                 │
│   │                                                             │
│   ▼                                                             │
│  api.ts ──── Bearer {anonKey} ────▶ Hono Edge Functions         │
│                                       │                         │
│                                       │ No real auth check      │
│                                       │ Uses anon key           │
│                                       ▼                         │
│                                    KV Store (DB)                │
│                                                                 │
│  ⚠️ Issues:                                                     │
│  - Password only (no OAuth/social)                              │
│  - API uses anon key (not user token)                           │
│  - No MFA support                                               │
│  - Basic UI (custom LoginPage)                                  │
│  - Manual session management                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Section B: MVP Auth Flow (Clerk)

```
┌─────────────────────────────────────────────────────────────────┐
│              MVP AUTH FLOW (Clerk)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User                                                           │
│   │                                                             │
│   ▼                                                             │
│  <SignIn/> ──── OAuth / Email / Phone ────▶ Clerk Cloud         │
│  (Clerk Component)                           │                  │
│   │                                          │ JWT issued       │
│   │  Hosted UI (customizable)                │                  │
│   │                                          ▼                  │
│   ▼                                                             │
│  <ClerkProvider> ◀── useUser() / useAuth() ── Clerk Session     │
│   │                                                             │
│   │  user, isSignedIn, getToken()                               │
│   │                                                             │
│   ▼                                                             │
│  api.ts ──── Bearer {clerkJWT} ────▶ Hono Edge Functions        │
│                                       │                         │
│                                       │ Verify Clerk JWT        │
│                                       │ Extract userId          │
│                                       │ Row-level filtering     │
│                                       ▼                         │
│                                    KV Store (DB)                │
│                                                                 │
│  ✅ Benefits:                                                    │
│  - OAuth providers (Google, GitHub, etc.)                       │
│  - Polished hosted UI components                                │
│  - Real JWT verification on backend                             │
│  - MFA / Passkeys support                                       │
│  - User management dashboard                                    │
│  - Webhook for user events                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Files That Change:

```
REMOVE:                          ADD:
├─ AuthContext.tsx (delete)       ├─ ClerkProvider in App.tsx
├─ LoginPage.tsx (delete)        ├─ <SignIn/> <SignUp/> routes
├─ supabaseClient.ts (auth)     ├─ Clerk middleware in api.ts
│                                ├─ JWT verification in Hono
│                                ├─ @clerk/clerk-react package
│                                └─ Clerk environment vars

MODIFY:
├─ App.tsx (AuthProvider → ClerkProvider)
├─ api.ts (anon key → Clerk JWT)
├─ Layout.tsx (user display → Clerk UserButton)
└─ server/index.tsx (add JWT verification)
```

---

## Diagram 4: Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW (End-to-End)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─── USER ACTION ───┐                                         │
│  │ Click / Submit /   │                                         │
│  │ Navigate / Upload  │                                         │
│  └────────┬──────────┘                                         │
│           ▼                                                     │
│  ┌─── REACT COMPONENT ───┐                                     │
│  │ useState for local UI  │                                     │
│  │ useEffect for data     │                                     │
│  │ React Hook Form (forms)│                                     │
│  └────────┬──────────────┘                                     │
│           ▼                                                     │
│  ┌─── API CLIENT (api.ts) ───┐                                 │
│  │                            │                                 │
│  │  request<T>(path, opts)    │                                 │
│  │  ├─ URL: BASE + path       │                                 │
│  │  ├─ Headers:               │                                 │
│  │  │  Content-Type: JSON     │                                 │
│  │  │  Authorization: Bearer  │                                 │
│  │  ├─ Body: JSON.stringify   │                                 │
│  │  └─ Response: json.data    │                                 │
│  │                            │                                 │
│  │  13 API Groups:            │                                 │
│  │  suppliers, contacts,      │                                 │
│  │  products, documents,      │                                 │
│  │  projects, clients,        │                                 │
│  │  dashboard, quoteItems,    │                                 │
│  │  timeline, public,         │                                 │
│  │  kanban, projectDocs,      │                                 │
│  │  calendar                  │                                 │
│  └────────┬──────────────────┘                                 │
│           │ HTTPS                                               │
│           ▼                                                     │
│  ┌─── HONO SERVER (Edge Function) ───┐                         │
│  │                                    │                         │
│  │  Route Handler                     │                         │
│  │  ├─ Parse request (body, params)   │                         │
│  │  ├─ Validate input                 │                         │
│  │  ├─ Call KV store operations       │                         │
│  │  └─ Return { data, error? }        │                         │
│  │                                    │                         │
│  │  Middleware:                        │                         │
│  │  ├─ CORS (all origins)             │                         │
│  │  └─ Logger                         │                         │
│  └────────┬──────────────────────────┘                         │
│           ▼                                                     │
│  ┌─── KV STORE (kv_store.tsx) ───┐                             │
│  │                                │                             │
│  │  Operations:                   │                             │
│  │  ├─ get(key)                   │                             │
│  │  ├─ set(key, value)            │ ──▶  PostgreSQL            │
│  │  ├─ del(key)                   │      kv_store_0045c7fc     │
│  │  ├─ mget(keys[])              │      (key TEXT, value JSONB)│
│  │  ├─ mset(keys[], values[])    │                             │
│  │  └─ getByPrefix(prefix)       │                             │
│  │                                │                             │
│  │  Key Pattern:                  │                             │
│  │  {entity}:{uuid}              │                             │
│  │  e.g. supplier:abc123          │                             │
│  └────────────────────────────────┘                             │
│                                                                 │
│  ┌─── IMAGE UPLOAD FLOW ───┐                                   │
│  │                          │                                   │
│  │  File → FileReader       │                                   │
│  │  → Base64 encode         │                                   │
│  │  → POST to Edge Function │                                   │
│  │  → Decode to binary      │                                   │
│  │  → Upload to Storage     │                                   │
│  │  → Generate signed URL   │                                   │
│  │  → Store URL in KV       │                                   │
│  │  → Return to frontend    │                                   │
│  └──────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagram 5: Payment Flow (Polar - NEW)

```
┌─────────────────────────────────────────────────────────────────┐
│                  PAYMENT FLOW (Polar Integration)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─── SUBSCRIPTION FLOW ───┐                                   │
│  │                          │                                   │
│  │  User (authenticated)    │                                   │
│  │       │                  │                                   │
│  │       ▼                  │                                   │
│  │  Pricing Page            │                                   │
│  │  (React Component)       │                                   │
│  │  ├─ Free Plan            │                                   │
│  │  ├─ Pro Plan             │                                   │
│  │  └─ Enterprise Plan      │                                   │
│  │       │                  │                                   │
│  │       ▼                  │                                   │
│  │  "Subscribe" Button      │                                   │
│  │       │                  │                                   │
│  │       ▼                  │                                   │
│  │  Polar Checkout          │                                   │
│  │  (Polar-hosted page)     │                                   │
│  │  ├─ Payment details      │                                   │
│  │  ├─ Card / Payment       │                                   │
│  │  └─ Confirmation         │                                   │
│  │       │                  │                                   │
│  │       ▼                  │                                   │
│  │  Redirect back to app    │                                   │
│  │  /settings?success=true  │                                   │
│  └──────────────────────────┘                                   │
│                                                                 │
│  ┌─── WEBHOOK FLOW ───┐                                        │
│  │                      │                                       │
│  │  Polar Server         │                                       │
│  │       │               │                                       │
│  │       ▼               │                                       │
│  │  POST /webhooks/polar │                                       │
│  │  (Hono Edge Function) │                                       │
│  │       │               │                                       │
│  │       ├─ subscription.created → Save to KV                   │
│  │       ├─ subscription.updated → Update KV                    │
│  │       ├─ subscription.canceled → Update KV                   │
│  │       ├─ payment.succeeded → Log payment                     │
│  │       └─ payment.failed → Alert/retry                        │
│  │       │               │                                       │
│  │       ▼               │                                       │
│  │  KV Store             │                                       │
│  │  subscription:{userId}│                                       │
│  │  ├─ plan: 'pro'       │                                       │
│  │  ├─ status: 'active'  │                                       │
│  │  ├─ expiresAt: date   │                                       │
│  │  └─ polarCustomerId   │                                       │
│  └──────────────────────┘                                       │
│                                                                 │
│  ┌─── ACCESS CONTROL ───┐                                       │
│  │                        │                                       │
│  │  API Request           │                                       │
│  │       │                │                                       │
│  │       ▼                │                                       │
│  │  Check subscription    │                                       │
│  │  from KV store         │                                       │
│  │       │                │                                       │
│  │       ├─ Free tier: Limited features                          │
│  │       ├─ Pro tier: Full features                              │
│  │       └─ Expired: Redirect to pricing                        │
│  └────────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagram 6: Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─── DEVELOPMENT ───┐                                         │
│  │                    │                                         │
│  │  Local Dev Server  │                                         │
│  │  pnpm dev          │                                         │
│  │  (Vite 6.3)        │                                         │
│  │  localhost:5173     │                                         │
│  └────────┬───────────┘                                         │
│           │ git push                                            │
│           ▼                                                     │
│  ┌─── VERCEL BUILD ───┐                                        │
│  │                     │                                        │
│  │  1. pnpm install    │                                        │
│  │  2. pnpm build      │                                        │
│  │     (vite build)    │                                        │
│  │  3. Output: dist/   │                                        │
│  │  4. SPA Rewrite     │                                        │
│  │     /* → /index.html│                                        │
│  └────────┬────────────┘                                        │
│           ▼                                                     │
│  ┌─── VERCEL CDN ───┐                                          │
│  │                    │                                          │
│  │  travelprov1.      │                                          │
│  │    vercel.app      │                                          │
│  │                    │                                          │
│  │  Static files      │                                          │
│  │  served globally   │                                          │
│  └────────────────────┘                                          │
│                                                                 │
│  ┌─── SUPABASE FUNCTIONS ───┐                                  │
│  │                           │                                  │
│  │  supabase functions       │                                  │
│  │    deploy server          │                                  │
│  │                           │                                  │
│  │  Deployed to:             │                                  │
│  │  mvmoewcvccgcrpbfgvxg    │                                  │
│  │  .supabase.co/functions/  │                                  │
│  │  v1/make-server-0045c7fc  │                                  │
│  └───────────────────────────┘                                  │
│                                                                 │
│  ┌─── ENVIRONMENT VARS ───┐                                    │
│  │                         │                                    │
│  │  Frontend (Vite):       │                                    │
│  │  ├─ SUPABASE_URL        │                                    │
│  │  └─ SUPABASE_ANON_KEY   │                                    │
│  │                         │                                    │
│  │  Edge Functions (Deno): │                                    │
│  │  ├─ SUPABASE_URL        │                                    │
│  │  └─ SERVICE_ROLE_KEY    │                                    │
│  │                         │                                    │
│  │  MVP Additions:         │                                    │
│  │  ├─ CLERK_PUBLISHABLE   │                                    │
│  │  ├─ CLERK_SECRET_KEY    │                                    │
│  │  ├─ POLAR_API_KEY       │                                    │
│  │  └─ POLAR_WEBHOOK_SECRET│                                    │
│  └─────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagram 7: Migration Roadmap

```
┌─────────────────────────────────────────────────────────────────┐
│                    MIGRATION ROADMAP                             │
│               Current State → MVP State                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: CLERK INTEGRATION (Auth Migration)                    │
│  ══════════════════════════════════════════                     │
│  Priority: HIGH │ Risk: MEDIUM │ Impact: 6 files                │
│                                                                 │
│  Step 1.1: Install Clerk                                        │
│  ├─ pnpm add @clerk/clerk-react                                │
│  ├─ Create Clerk account + app                                  │
│  └─ Get CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY               │
│                                                                 │
│  Step 1.2: Replace Auth Provider                                │
│  ├─ App.tsx: AuthProvider → ClerkProvider                       │
│  ├─ Remove AuthContext.tsx                                       │
│  └─ Add Clerk env vars to Vercel                                │
│                                                                 │
│  Step 1.3: Replace Login UI                                     │
│  ├─ Remove LoginPage.tsx                                        │
│  ├─ Add <SignIn/> and <SignUp/> routes                          │
│  └─ Add <UserButton/> to Layout                                │
│                                                                 │
│  Step 1.4: Update API Layer                                     │
│  ├─ api.ts: Use Clerk getToken() instead of anon key           │
│  ├─ server/index.tsx: Add Clerk JWT verification middleware     │
│  └─ Extract userId from JWT for data isolation                  │
│                                                                 │
│  Step 1.5: Test & Verify                                        │
│  ├─ Login/Signup flow                                           │
│  ├─ All 52 API endpoints                                        │
│  ├─ Public quote endpoint (no auth)                             │
│  └─ Session persistence                                         │
│                                                                 │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  PHASE 2: POLAR INTEGRATION (Payments)                          │
│  ═══════════════════════════════════════                        │
│  Priority: HIGH │ Risk: LOW │ Impact: New files                 │
│                                                                 │
│  Step 2.1: Setup Polar                                          │
│  ├─ Create Polar account + organization                        │
│  ├─ Define subscription plans (Free/Pro/Enterprise)            │
│  └─ Get API key + webhook secret                                │
│                                                                 │
│  Step 2.2: Create Pricing Page                                  │
│  ├─ New PricingPage.tsx component                              │
│  ├─ Plan comparison cards                                       │
│  ├─ Polar checkout redirect                                     │
│  └─ Add route to routes.ts                                      │
│                                                                 │
│  Step 2.3: Webhook Handler                                      │
│  ├─ New /webhooks/polar endpoint in Hono                       │
│  ├─ Verify webhook signature                                    │
│  ├─ Handle subscription lifecycle events                        │
│  └─ Store subscription state in KV                              │
│                                                                 │
│  Step 2.4: Access Control                                       │
│  ├─ Subscription check middleware                               │
│  ├─ Feature gating per plan                                     │
│  └─ Upgrade prompts in UI                                       │
│                                                                 │
│  Step 2.5: Customer Portal                                      │
│  ├─ Billing section in Settings                                 │
│  ├─ Plan management                                             │
│  └─ Invoice history                                             │
│                                                                 │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  PHASE 3: STABILIZATION & QA                                    │
│  ═══════════════════════════                                    │
│  Priority: HIGH │ Risk: LOW │ Impact: All files                 │
│                                                                 │
│  Step 3.1: End-to-End Testing                                   │
│  ├─ Auth flows (Clerk)                                          │
│  ├─ Payment flows (Polar)                                       │
│  ├─ All CRUD operations                                         │
│  └─ Public quote flow                                           │
│                                                                 │
│  Step 3.2: Performance Optimization                             │
│  ├─ Bundle size audit                                           │
│  ├─ API response times                                          │
│  └─ Image loading optimization                                  │
│                                                                 │
│  Step 3.3: Security Review                                      │
│  ├─ JWT verification correctness                                │
│  ├─ Data isolation per user                                     │
│  ├─ Webhook signature validation                                │
│  └─ Environment variable security                               │
│                                                                 │
│  Step 3.4: Production Readiness                                 │
│  ├─ Error monitoring setup                                      │
│  ├─ Analytics integration                                       │
│  ├─ Backup strategy                                             │
│  └─ Documentation                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary: What Changes vs What Stays

### CHANGES (Red in Miro)
| Current | MVP | Files Affected |
|---------|-----|----------------|
| Supabase Auth | Clerk | AuthContext.tsx, LoginPage.tsx, App.tsx, api.ts, server/index.tsx |
| No Payments | Polar | New: PricingPage.tsx, webhook handler, subscription KV entries |
| Anon Key Auth | JWT Auth | api.ts, server/index.tsx |
| Custom Login UI | Clerk Hosted UI | LoginPage.tsx → <SignIn/> |

### STAYS (Green in Miro)
| Component | Status |
|-----------|--------|
| React 18.3 + Vite 6.3 | ✅ Unchanged |
| Tailwind CSS 4.1 | ✅ Unchanged |
| Radix UI (46 components) | ✅ Unchanged |
| React Router (15 routes) | ✅ +2 new routes |
| Hono Edge Functions | ✅ +webhook endpoint |
| PostgreSQL KV Store | ✅ +subscription model |
| Supabase Storage | ✅ Unchanged |
| Vercel Deployment | ✅ Unchanged |
| 24 Page Components | ✅ +1-2 new pages |
| Hebrew RTL Support | ✅ Unchanged |
| All 13 API Groups | ✅ Unchanged |
| 52 API Endpoints | ✅ +3-5 new endpoints |

### NEW ENV VARS NEEDED
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
POLAR_ACCESS_TOKEN=pat_...
POLAR_WEBHOOK_SECRET=whsec_...
```
