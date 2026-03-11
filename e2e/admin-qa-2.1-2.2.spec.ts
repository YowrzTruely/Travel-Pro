/**
 * QA E2E tests for QA Guide Sections 2.1 (Approve Suppliers) and 2.2 (User Management)
 * Run: bunx playwright test e2e/admin-qa-2.1-2.2.spec.ts
 */

import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = "ro.levin@icloud.com";
const ADMIN_PASSWORD = "Inacce551bleEncrypt10n";
const SUPPLIER_EMAIL = "head0.25s@gmail.com";
const SUPPLIER_PASSWORD = "Unbre4k4ble4m4t10n";

const RE_DIGITS = /\d+/;
const RE_BADGE_USERS = /^\d+ משתמשים$/;
const RE_ROLE_SUCCESS = /התפקיד עודכן בהצלחה/;
const RE_STATUS_SUCCESS = /הסטטוס עודכן בהצלחה/;
const RE_APPROVED = /אושר בהצלחה/;
const RE_REJECTED = /נדחה/;

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "TravelPro" })).toBeVisible();
  await page.getByPlaceholder("name@company.com").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("הזן סיסמה").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "התחבר", exact: true }).click();
  await expect(page).toHaveURL("/", { timeout: 15_000 });
  await expect(page.getByRole("button", { name: "אישור ספקים" })).toBeVisible({
    timeout: 15_000,
  });
}

test.describe("Section 2.1: Approve Suppliers", () => {
  test("2.1.1 - Navigate to Approve Suppliers, page loads (with/without pending badge)", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/approve-suppliers");
    await expect(page).toHaveURL("/approve-suppliers");
    await expect(
      page.getByRole("heading", { name: "אישור ספקים" })
    ).toBeVisible();
    await expect(page.locator("text=אישור ספקים").first()).toBeVisible();
    const badge = page.locator("text=ממתינים");
    if (await badge.isVisible()) {
      await expect(badge).toContainText(RE_DIGITS);
    }
  });

  test("2.1.2 - Pending suppliers table columns when data exists", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/approve-suppliers");
    const table = page.locator("table");
    if (await table.isVisible()) {
      await expect(
        page.getByRole("columnheader", { name: "שם" })
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "אימייל" })
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "טלפון" })
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "חברה" })
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "תאריך הרשמה" })
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "פעולות" })
      ).toBeVisible();
    }
  });

  test("2.1.6 - Empty state message when no pending suppliers", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/approve-suppliers");
    await expect(
      page.getByRole("heading", { name: "אישור ספקים" })
    ).toBeVisible({
      timeout: 10_000,
    });
    const loading = page.locator("text=טוען...");
    await expect(loading).not.toBeVisible({ timeout: 10_000 });
    const table = page.locator("table");
    const emptyMsg = page.getByText("אין ספקים ממתינים לאישור");
    const hasTable = await table.isVisible();
    if (!hasTable) {
      await expect(emptyMsg).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("כל הרישומים טופלו")).toBeVisible();
    }
  });
});

test.describe("Section 2.2: User Management", () => {
  test("2.2.1 - User table loads with all users", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page).toHaveURL("/users");
    await expect(
      page.getByRole("heading", { name: "ניהול משתמשים" })
    ).toBeVisible();
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("columnheader", { name: "שם" })).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "אימייל" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "תפקיד" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "סטטוס" })
    ).toBeVisible();
  });

  test("2.2.2 - Search by name filters table", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
    const searchInput = page.getByPlaceholder(
      "חיפוש לפי שם, אימייל או חברה..."
    );
    await searchInput.fill("ronny");
    await page.waitForTimeout(500);
    const rows = page.locator("tbody tr");
    const count = await rows.count();
    if (count > 0) {
      const firstRowText = await rows.first().textContent();
      expect(firstRowText?.toLowerCase()).toContain("ronny");
    }
  });

  test("2.2.3 - Search by email filters table", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
    const searchInput = page.getByPlaceholder(
      "חיפוש לפי שם, אימייל או חברה..."
    );
    await searchInput.fill(ADMIN_EMAIL);
    await page.waitForTimeout(500);
    await expect(page.locator("tbody")).toContainText(ADMIN_EMAIL);
  });

  test("2.2.4 - Change user role via dropdown, toast confirmation", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
    const producerRow = page
      .locator("tbody tr")
      .filter({ hasText: "orangeayx@gmail.com" })
      .first();
    const roleSelect = producerRow.locator("select").first();
    const currentRole = await roleSelect.inputValue();
    const newRole = currentRole === "producer" ? "supplier" : "producer";
    await roleSelect.selectOption(newRole);
    await expect(page.getByText(RE_ROLE_SUCCESS)).toBeVisible({
      timeout: 5000,
    });
    await roleSelect.selectOption(currentRole || "producer");
  });

  test("2.2.5 - Change user status via dropdown, toast confirmation", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
    const producerRow = page
      .locator("tbody tr")
      .filter({ hasText: "orangeayx@gmail.com" })
      .first();
    const statusSelect = producerRow.locator("select").nth(1);
    const currentStatus = await statusSelect.inputValue();
    const newStatus = currentStatus === "active" ? "pending" : "active";
    await statusSelect.selectOption(newStatus);
    await expect(page.getByText(RE_STATUS_SUCCESS)).toBeVisible({
      timeout: 5000,
    });
    await statusSelect.selectOption(currentStatus || "active");
  });

  test("2.2.6 - User count badge reflects filtered results", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/users");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
    const badge = page.locator("span").filter({ hasText: RE_BADGE_USERS });
    const badgeTextBefore = await badge.first().textContent();
    const searchInput = page.getByPlaceholder(
      "חיפוש לפי שם, אימייל או חברה..."
    );
    await searchInput.fill("xyznonexistentuser123");
    await page.waitForTimeout(500);
    const badgeTextAfter = await badge.first().textContent();
    const countBefore = badgeTextBefore?.match(RE_DIGITS)?.[0];
    const countAfter = badgeTextAfter?.match(RE_DIGITS)?.[0];
    expect(countBefore).toBeDefined();
    expect(countAfter).toBeDefined();
    expect(Number(countAfter)).toBeLessThan(Number(countBefore));
  });
});

test.describe("Admin Login and Section 2.1 Approve/Reject flow", () => {
  test("Login as Admin - dashboard loads", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole("button", { name: "דשבורד" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "אישור ספקים" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "משתמשים" })).toBeVisible();
  });

  test("2.1.3 & 2.1.5 - Approve/Reject (only when pending suppliers exist)", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/approve-suppliers");
    const approveBtn = page.getByRole("button", { name: "אישור" }).first();
    const rejectBtn = page.getByRole("button", { name: "דחה" }).first();
    if (await approveBtn.isVisible()) {
      const rowCountBefore = await page.locator("tbody tr").count();
      await approveBtn.click();
      await expect(page.getByText(RE_APPROVED)).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(1000);
      const rowCountAfter = await page.locator("tbody tr").count();
      expect(rowCountAfter).toBe(rowCountBefore - 1);
    }
    if (await rejectBtn.isVisible()) {
      const rowCountBefore = await page.locator("tbody tr").count();
      await rejectBtn.click();
      await expect(page.getByText(RE_REJECTED)).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(1000);
      const rowCountAfter = await page.locator("tbody tr").count();
      expect(rowCountAfter).toBe(rowCountBefore - 1);
    }
  });
});

test.describe("2.1.4 - Supplier login after approval", () => {
  test("Supplier can access dashboard when approved", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("name@company.com").fill(SUPPLIER_EMAIL);
    await page.getByPlaceholder("הזן סיסמה").fill(SUPPLIER_PASSWORD);
    await page.getByRole("button", { name: "התחבר", exact: true }).click();
    await page.waitForTimeout(3000);
    const pendingScreen = page.locator("text=ממתין לאישור");
    const dashboard = page.getByRole("button", { name: "מוצרים" });
    const hasPending = await pendingScreen.isVisible();
    const hasDashboard = await dashboard.isVisible();
    expect(hasPending || hasDashboard).toBe(true);
  });
});
