# Testing Plan 01 + 02: Data Model & Multi-Role Auth

## Prerequisites

Two terminals running:
- `bun run dev` (frontend)
- `bunx convex dev` (backend)

Verify schema deployed cleanly (no errors in convex dev terminal).

---

## Test 1: Existing User Login (backward compat)

1. Go to `http://localhost:5173`
2. Login with existing account (`alex86000@gmail.com`)
3. **Expected:** Brief "יוצר פרופיל..." spinner → ProducerOnboarding welcome screen
4. Click "כניסה ללוח בקרה"
5. **Expected:** Dashboard loads with producer sidebar (Dashboard, Projects, Suppliers, Clients, Documents, Calendar)
6. Refresh the page
7. **Expected:** Dashboard loads directly (no onboarding again)

## Test 2: Signup as Producer

1. Logout (sidebar bottom → logout icon)
2. Switch to "הרשמה" tab
3. Fill: name, email (new), password, confirm password
4. Verify "סוג חשבון" defaults to "מפיק טיולים"
5. Click "צור חשבון"
6. **Expected:** ProducerOnboarding welcome screen
7. Click "כניסה ללוח בקרה"
8. **Expected:** Dashboard with producer nav

## Test 3: Signup as Supplier

1. Logout
2. Switch to "הרשמה" tab
3. Fill name, email (new), password, confirm password
4. Select "ספק שירותים" role
5. Verify field label changes to "שם עסק"
6. Click "צור חשבון"
7. **Expected:** SupplierPending screen ("החשבון שלך ממתין לאישור")
8. Click "התנתק"
9. **Expected:** Back to login page

## Test 4: Supplier Self-Registration

1. Navigate to `http://localhost:5173/register/supplier`
2. **Expected:** Public registration form (no auth required)
3. Fill all fields (name, business, email, phone, password, confirm, category, region)
4. Click "צור חשבון ספק"
5. **Expected:** Success message → account pending approval

## Test 5: Public Quote Page (still works)

1. Navigate to `http://localhost:5173/quote/some-id`
2. **Expected:** Client quote page renders without auth (may show "not found" for invalid ID, that's OK)

## Test 6: Sidebar Nav by Role

After completing tests above, verify each role sees correct nav:

| Role | Expected Nav Items |
|------|-------------------|
| Producer | דשבורד, פרויקטים, בנק ספקים, לקוחות, מסמכים, יומן + "פרויקט חדש" button |
| Supplier | דשבורד, מוצרים, מסמכים, זמינות, בקשות, פרופיל (no "פרויקט חדש" button) |
| Admin | דשבורד, אישור ספקים, משתמשים (no "פרויקט חדש" button) |

## Test 7: Profile Display

- Sidebar bottom shows user's **name** (not email prefix)
- Below name shows role label: "מפיק" / "ספק" / "מנהל מערכת"

---

## Quick Smoke Test (minimum)

If short on time, just run tests 1, 2, and 5. These cover backward compat, new signup flow, and public page regression.
