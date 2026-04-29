import { expect, Page, test } from "@playwright/test";

const categories = ["electronics", "jewelery"];

const products = {
  default: [
    {
      id: 1,
      title: "Everyday Backpack",
      price: 49.99,
      category: "electronics",
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
  ],
  sortedDesc: [
    {
      id: 3,
      title: "Descending Sort Jacket",
      price: 89.99,
      category: "electronics",
      description: "Returned when sort changes to descending.",
      image: "https://example.com/jacket.jpg",
    },
  ],
  limited: [
    {
      id: 4,
      title: "Twenty Four Item Result",
      price: 24,
      category: "electronics",
      description: "Returned when the limit changes to twenty four.",
      image: "https://example.com/limited.jpg",
    },
  ],
  category: [
    {
      id: 5,
      title: "Electronics Only Speaker",
      price: 59,
      category: "electronics",
      description: "Returned when electronics category is selected.",
      image: "https://example.com/speaker.jpg",
    },
  ],
};

async function mockStoreApi(page: Page): Promise<string[]> {
  const productRequests: string[] = [];

  await page.route("https://fakestoreapi.com/products**", async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.pathname === "/products/categories") {
      await route.fulfill({ json: categories });
      return;
    }

    const pathAndQuery = `${requestUrl.pathname}${requestUrl.search}`;
    productRequests.push(pathAndQuery);

    if (requestUrl.pathname.includes("/products/category/electronics")) {
      await route.fulfill({ json: products.category });
      return;
    }

    const sort = requestUrl.searchParams.get("sort");
    const limit = requestUrl.searchParams.get("limit");

    if (sort === "desc" && limit === "24") {
      await route.fulfill({ json: products.limited });
      return;
    }

    if (sort === "desc") {
      await route.fulfill({ json: products.sortedDesc });
      return;
    }

    await route.fulfill({ json: products.default });
  });

  return productRequests;
}

test.describe("StoreService", () => {
  test("loads products and categories from the store API defaults", async ({
    page,
  }) => {
    const productRequests = await mockStoreApi(page);

    await page.goto("/home");

    await expect(page.getByText("Everyday Backpack")).toBeVisible();
    await expect(page.getByText("Silver Bracelet")).toBeVisible();
    await expect(page.getByRole("button", { name: "all" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "electronics" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "jewelery" })).toBeVisible();
    expect(productRequests).toContain("/products?sort=asc&limit=12");
  });

  test("updates product requests when sort, limit, and category filters change", async ({
    page,
  }) => {
    const productRequests = await mockStoreApi(page);

    await page.goto("/home");

    await page.getByRole("button", { name: /Sort by asc/ }).click();
    await page.getByRole("menuitem", { name: "desc" }).click();
    await expect(page.getByText("Descending Sort Jacket")).toBeVisible();
    expect(productRequests).toContain("/products?sort=desc&limit=12");

    await page.getByRole("button", { name: /Show 12/ }).click();
    await page.getByRole("menuitem", { name: "24" }).click();
    await expect(page.getByText("Twenty Four Item Result")).toBeVisible();
    expect(productRequests).toContain("/products?sort=desc&limit=24");

    await page.getByRole("button", { name: "electronics" }).click();
    await expect(page.getByText("Electronics Only Speaker")).toBeVisible();
    expect(productRequests).toContain(
      "/products/category/electronics?sort=desc&limit=24",
    );
  });
});
