import { expect, test } from "@playwright/test";
import { mockStoreApi } from "./helpers/store-api";

test.describe("ProductBoxComponent", () => {
  test("renders product details and emits add to cart", async ({ page }) => {
    await mockStoreApi(page);
    await page.goto("/home");

    const productBox = page
      .locator("app-product-box")
      .filter({ hasText: "Everyday Backpack" });

    await expect(
      productBox.getByRole("img", { name: "Everyday Backpack" }),
    ).toBeVisible();
    await expect(productBox.getByText("electronics")).toBeVisible();
    await expect(productBox.getByText("Everyday Backpack")).toBeVisible();
    await expect(productBox.getByText("$49.99")).toBeVisible();

    await productBox.getByRole("button", { name: "Add to cart" }).click();

    await expect(page.locator("app-header").getByText("1")).toBeVisible();
  });
});
