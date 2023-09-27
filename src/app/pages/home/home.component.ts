import { Component, OnInit, inject } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";

const ROWS_HEIGHT: { [id: number]: number } = {
  1: 400,
  3: 335,
  4: 350,
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styles: [],
})
export class HomeComponent implements OnInit {
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string = "all";
  products: Array<Product> | undefined;
  sort = "desc";
  limit = 12;
  productSubscription: Subscription | undefined;

  private cartService = inject(CartService);
  private storeService = inject(StoreService);

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productSubscription = this.storeService
      .getAllProducts(this.limit, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  onSortValueChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  onItemsShowCountChange(newLimit: number): void {
    this.limit = newLimit;
    this.getProducts();
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
