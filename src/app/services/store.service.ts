import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

const STORE_BASE_URL = "https://fakestoreapi.com";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private httpClient = inject(HttpClient);

  getAllProducts(
    limit = 12,
    sort = "asc",
    category = "all",
  ): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      category === "all"
        ? `${STORE_BASE_URL}/products?sort=${sort}&limit=${limit}`
        : `${STORE_BASE_URL}/products/category/${category}?sort=${sort}&limit=${limit}`,
    );
  }

  getAllCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `${STORE_BASE_URL}/products/categories`,
    );
  }
}
