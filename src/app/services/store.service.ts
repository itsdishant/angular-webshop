import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { switchMap, shareReplay } from "rxjs/operators";
import { Product } from "../models/product.model";

const STORE_BASE_URL = "https://fakestoreapi.com";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private httpClient = inject(HttpClient);

  private readonly limit$ = new BehaviorSubject<number>(12);
  private readonly sort$ = new BehaviorSubject<string>("asc");
  private readonly category$ = new BehaviorSubject<string>("all");

  readonly products$ = combineLatest([
    this.limit$,
    this.sort$,
    this.category$,
  ]).pipe(
    switchMap(([limit, sort, category]) =>
      this.httpClient.get<Product[]>(
        category === "all"
          ? `${STORE_BASE_URL}/products?sort=${sort}&limit=${limit}`
          : `${STORE_BASE_URL}/products/category/${category}?sort=${sort}&limit=${limit}`,
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly categories$ = this.httpClient
    .get<string[]>(`${STORE_BASE_URL}/products/categories`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  setLimit(limit: number): void {
    this.limit$.next(limit);
  }

  setSort(sort: string): void {
    this.sort$.next(sort);
  }

  setCategory(category: string): void {
    this.category$.next(category);
  }
}
