import { Page } from "@playwright/test";

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
      title: "Jewelry Only Necklace",
      price: 59,
      category: "jewelery",
      description: "Returned when jewelery category is selected.",
      image: "https://example.com/necklace.jpg",
    },
  ],
};

export async function mockStoreApi(page: Page): Promise<string[]> {
  const productRequests: string[] = [];

  await page.route("https://fakestoreapi.com/products**", async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.pathname === "/products/categories") {
      await route.fulfill({ json: categories });
      return;
    }

    const pathAndQuery = `${requestUrl.pathname}${requestUrl.search}`;
    productRequests.push(pathAndQuery);

    if (requestUrl.pathname.includes("/products/category/jewelery")) {
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

export async function addProductToCart(
  page: Page,
  productName: string,
): Promise<void> {
  await page
    .locator("app-product-box")
    .filter({ hasText: productName })
    .getByRole("button", { name: "Add to cart" })
    .click();
}
