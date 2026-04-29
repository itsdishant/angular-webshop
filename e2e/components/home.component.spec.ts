import { expect, test } from "@playwright/test";
import { mockStoreApi } from "./helpers/store-api";

test.describe("HomeComponent", () => {
  test("renders filters, header controls, and product boxes", async ({
    page,
  }) => {
    await mockStoreApi(page);

    await page.goto("/home");

    await expect(page.locator("app-home")).toBeVisible();
    await expect(page.locator("app-filters")).toBeVisible();
    await expect(page.locator("app-products-header")).toBeVisible();
    await expect(page.locator("app-product-box")).toHaveCount(2);
    await expect(page.getByRole("button", { name: "all" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "electronics" }),
    ).toBeVisible();
  });
});
