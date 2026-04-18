import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from "@angular/material/sidenav";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";
import { FiltersComponent } from "../filters.component";
import { ProductsHeaderComponent } from "../products-header.component";
import { ProductBoxComponent } from "../product-box.component";

const ROWS_HEIGHT: { [id: number]: number } = {
  1: 400,
  3: 335,
  4: 350,
};

@Component({
  selector: "app-home",
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MatGridList,
    MatGridTile,
    FiltersComponent,
    ProductsHeaderComponent,
    ProductBoxComponent,
  ],
  template: `<mat-drawer-container
    [autosize]="true"
    class="min-h-full max-w-7xl mx-auto border-x"
  >
    <mat-drawer mode="side" opened class="p-6">
      <app-filters (showCategory)="onShowCategory($event)"></app-filters>
    </mat-drawer>
    <mat-drawer-content class="p-6">
      <app-products-header
        (columnsCountChange)="onColumnsCountChange($event)"
        (sortValueChange)="onSortValueChange($event)"
        (itemsShowCountChange)="onItemsShowCountChange($event)"
      ></app-products-header>
      <mat-grid-list gutterSize="16" [cols]="cols" [rowHeight]="rowHeight">
        @for (product of products; track product.id) {
          <mat-grid-tile>
            <app-product-box
              [product]="product"
              class="w-full"
              [fullWidthMode]="cols === 1"
              (addToCart)="onAddToCart($event)"
            ></app-product-box>
          </mat-grid-tile>
        }
      </mat-grid-list>
    </mat-drawer-content>
  </mat-drawer-container> `,
  providers: [CartService, StoreService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private cartService = inject(CartService);
  private storeService = inject(StoreService);

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string = "all";
  products: Array<Product> | undefined;
  sort = "desc";
  limit = 12;
  productSubscription: Subscription | undefined;

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
