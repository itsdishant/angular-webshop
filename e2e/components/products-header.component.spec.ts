import { expect, test } from "../coverage";
import { mockStoreApi } from "./helpers/store-api";

test.describe("ProductsHeaderComponent", () => {
  test("emits sort, item count, and column layout changes", async ({ page }) => {
    const productRequests = await mockStoreApi(page);
    await page.goto("/home");

    await page.getByRole("button", { name: /Sort by asc/ }).click();
    await page.getByRole("menuitem", { name: "desc" }).click();
    await expect(page.getByText("Descending Sort Jacket")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Sort by desc/ }),
    ).toBeVisible();
    expect(productRequests).toContain("/products?sort=desc&limit=12");

    await page.getByRole("button", { name: /Show 12/ }).click();
    await page.getByRole("menuitem", { name: "24" }).click();
    await expect(page.getByText("Twenty Four Item Result")).toBeVisible();
    await expect(page.getByRole("button", { name: /Show 24/ })).toBeVisible();
    expect(productRequests).toContain("/products?sort=desc&limit=24");

    await page
      .locator("app-products-header button")
      .filter({ hasText: "view_list" })
      .click();
    await expect(
      page.getByText("Returned when the limit changes to twenty four."),
    ).toBeVisible();

    await page
      .locator("app-products-header button")
      .filter({ hasText: "view_module" })
      .click();
    await expect(
      page.getByText("Returned when the limit changes to twenty four."),
    ).toBeHidden();
  });
});
