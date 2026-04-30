import { expect, test } from "../coverage";
import { mockStoreApi } from "./helpers/store-api";

test.describe("AppComponent", () => {
  test("renders the application shell with the header and routed home page", async ({
    page,
  }) => {
    await mockStoreApi(page);

    await page.goto("/");

    await expect(page.locator("app-root")).toBeVisible();
    await expect(page.locator("app-header")).toBeVisible();
    await expect(page.locator("app-home")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "LifeStyle Stores" }),
    ).toBeVisible();
    await expect(page.getByText("Everyday Backpack")).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);
  });
});
