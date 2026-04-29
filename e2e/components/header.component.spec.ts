import { expect, test } from "@playwright/test";
import { addProductToCart, mockStoreApi } from "./helpers/store-api";

test.describe("HeaderComponent", () => {
  test("shows cart quantity, menu details, and clears cart items", async ({
    page,
  }) => {
    await mockStoreApi(page);
    await page.goto("/home");

    await addProductToCart(page, "Everyday Backpack");
    await addProductToCart(page, "Everyday Backpack");
    await addProductToCart(page, "Silver Bracelet");

    const header = page.locator("app-header");
    await expect(header.getByText("3")).toBeVisible();

    await page.getByLabel("Shopping cart").click();
    await expect(page.getByText("3 items")).toBeVisible();
    await expect(page.getByText(/Everyday Backpack x 2/)).toBeVisible();
    await expect(page.getByText(/Silver Bracelet x 1/)).toBeVisible();
    await expect(page.getByText("$129.48")).toBeVisible();

    await page.getByRole("button", { name: "Clear Cart" }).click();
    await page.getByLabel("Shopping cart").click();

    await expect(page.getByText("0 items")).toBeVisible();
    await expect(header.getByText("3")).toBeHidden();
  });
});
