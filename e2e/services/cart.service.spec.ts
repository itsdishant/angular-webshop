import { expect, Page, test } from "@playwright/test";

const products = [
  {
    id: 1,
    title: "Everyday Backpack",
    price: 49.99,
    category: "accessories",
    description: "A compact backpack for everyday carry.",
    image: "https://example.com/backpack.jpg",
  },
  {
    id: 2,
    title: "Silver Bracelet",
    price: 29.5,
    category: "jewelery",
    description: "A polished bracelet.",
    image: "https://example.com/bracelet.jpg",
  },
];

async function mockStoreApi(page: Page): Promise<void> {
  await page.route("https://fakestoreapi.com/products**", async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.pathname === "/products/categories") {
      await route.fulfill({ json: ["accessories", "jewelery"] });
      return;
    }

    await route.fulfill({ json: products });
  });
}

test.describe("CartService", () => {
  test("adds products and exposes item count, quantity, and total in the header cart", async ({
    page,
  }) => {
    await mockStoreApi(page);
    await page.goto("/home");

    await page
      .locator("app-product-box")
      .filter({ hasText: "Everyday Backpack" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    await page
      .locator("app-product-box")
      .filter({ hasText: "Everyday Backpack" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    await page
      .locator("app-product-box")
      .filter({ hasText: "Silver Bracelet" })
      .getByRole("button", { name: "Add to cart" })
      .click();

    await expect(page.locator("header").getByText("3")).toBeVisible();

    await page.getByLabel("Shopping cart").click();

    await expect(page.getByText("3 items")).toBeVisible();
    await expect(page.getByText(/Everyday Backpack x 2/)).toBeVisible();
    await expect(page.getByText(/Silver Bracelet x 1/)).toBeVisible();
    await expect(page.getByText("$129.48")).toBeVisible();
  });

  test("updates quantities, removes items, and clears the cart page", async ({
    page,
  }) => {
    await mockStoreApi(page);
    await page.goto("/home");

    await page
      .locator("app-product-box")
      .filter({ hasText: "Everyday Backpack" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    await page
      .locator("app-product-box")
      .filter({ hasText: "Everyday Backpack" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    await page
      .locator("app-product-box")
      .filter({ hasText: "Silver Bracelet" })
      .getByRole("button", { name: "Add to cart" })
      .click();

    await page.getByLabel("Shopping cart").click();
    await page.getByRole("button", { name: "View Cart" }).click();

    const cartPage = page.locator("app-cart");
    const backpackItem = cartPage
      .locator(".bg-white")
      .filter({ hasText: "Everyday Backpack" })
      .first();
    const braceletItem = cartPage
      .locator(".bg-white")
      .filter({ hasText: "Silver Bracelet" })
      .first();
    const backpackQuantity = backpackItem
      .getByRole("button", { name: "Decrease quantity" })
      .locator("xpath=following-sibling::span[1]");
    const braceletQuantity = braceletItem
      .getByRole("button", { name: "Decrease quantity" })
      .locator("xpath=following-sibling::span[1]");
    const subtotal = cartPage
      .getByText("Subtotal:")
      .locator("xpath=following-sibling::span[1]");

    await expect(cartPage.getByText("Shopping Cart")).toBeVisible();
    await expect(backpackQuantity).toHaveText("2");
    await expect(subtotal).toHaveText("$129.48");

    await backpackItem
      .getByRole("button", { name: "Decrease quantity" })
      .click();
    await expect(backpackQuantity).toHaveText("1");
    await expect(subtotal).toHaveText("$79.49");

    await braceletItem
      .getByRole("button", { name: "Increase quantity" })
      .click();
    await expect(braceletQuantity).toHaveText("2");
    await expect(subtotal).toHaveText("$108.99");

    await braceletItem.getByRole("button", { name: "Remove item" }).click();
    await expect(cartPage.getByText("Silver Bracelet")).toBeHidden();
    await expect(subtotal).toHaveText("$49.99");

    await cartPage.getByRole("button", { name: /Clear All Items/ }).click();
    await expect(cartPage.getByText("Your cart is empty")).toBeVisible();
  });
});
