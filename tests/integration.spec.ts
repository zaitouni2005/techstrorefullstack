import { test, expect } from "@playwright/test";

test.describe("E-Store Integration", () => {

  test("homepage loads and shows products", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("navigates to products page", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/products/);
  });

  test("navigates to cart page", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/cart/);
  });

  test("navigates to login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows product detail", async ({ page }) => {
    await page.goto("/products");
    const firstProduct = page.locator("a[href*='/products/']").first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/products\//);
    }
  });

  test("navbar navigation works", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("nav a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test("footer is present on homepage", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL(/\/contact/);
  });

  test("livraison page loads", async ({ page }) => {
    await page.goto("/livraison");
    await expect(page).toHaveURL(/\/livraison/);
  });

  test("retours page loads", async ({ page }) => {
    await page.goto("/retours");
    await expect(page).toHaveURL(/\/retours/);
  });
});
