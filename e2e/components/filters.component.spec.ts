import { expect, test } from "@playwright/test";
import { mockStoreApi } from "./helpers/store-api";

test.describe("FiltersComponent", () => {
  test("emits the selected category and refreshes the product list", async ({
    page,
  }) => {
    const productRequests = await mockStoreApi(page);
    await page.goto("/home");

    await page.getByRole("button", { name: "jewelery" }).click();

    await expect(page.getByText("Jewelry Only Necklace")).toBeVisible();
    expect(productRequests).toContain(
      "/products/category/jewelery?sort=asc&limit=12",
    );
  });
});
