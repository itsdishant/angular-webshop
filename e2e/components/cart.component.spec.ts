import { expect, test } from "../coverage";
import { addProductToCart, mockStoreApi } from "./helpers/store-api";

test.describe("CartComponent", () => {
  test("renders empty cart state and navigates back to shopping", async ({
    page,
  }) => {
    await mockStoreApi(page);

    await page.goto("/cart");

    await expect(page.locator("app-cart")).toBeVisible();
    await expect(page.getByText("Your cart is empty")).toBeVisible();

    await page.getByRole("button", { name: /Start Shopping/ }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByText("Everyday Backpack")).toBeVisible();
  });

  test("renders cart items and updates quantities", async ({ page }) => {
    await mockStoreApi(page);
    await page.goto("/home");

    await addProductToCart(page, "Everyday Backpack");
    await addProductToCart(page, "Everyday Backpack");

    await page.getByLabel("Shopping cart").click();
    await page.getByRole("button", { name: "View Cart" }).click();

    const cartPage = page.locator("app-cart");
    const cartItem = cartPage
      .locator(".bg-white")
      .filter({ hasText: "Everyday Backpack" })
      .first();
    const quantity = cartItem
      .getByRole("button", { name: "Decrease quantity" })
      .locator("xpath=following-sibling::span[1]");
    const subtotal = cartPage
      .getByText("Subtotal:")
      .locator("xpath=following-sibling::span[1]");

    await expect(cartPage.getByText("Shopping Cart")).toBeVisible();
    await expect(
      cartPage.getByText("You have 1 item in your cart"),
    ).toBeVisible();
    await expect(quantity).toHaveText("2");
    await expect(subtotal).toHaveText("$99.98");

    await cartItem.getByRole("button", { name: "Decrease quantity" }).click();
    await expect(quantity).toHaveText("1");
    await expect(subtotal).toHaveText("$49.99");

    await cartItem.getByRole("button", { name: "Increase quantity" }).click();
    await expect(quantity).toHaveText("2");
    await expect(subtotal).toHaveText("$99.98");

    await cartItem.getByRole("button", { name: "Remove item" }).click();
    await expect(cartPage.getByText("Your cart is empty")).toBeVisible();
  });
});
