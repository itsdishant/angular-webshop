import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from "@angular/material/sidenav";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";
import { FiltersComponent } from "../products/filters.component";
import { ProductsHeaderComponent } from "../products/products-header.component";
import { ProductBoxComponent } from "../products/product-box.component";
import { derivedAsync } from "ngxtension/derived-async";
import { filter } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
      <mat-grid-list gutterSize="16" [cols]="cols()" [rowHeight]="rowHeight()">
        @for (product of products(); track product.id) {
          <mat-grid-tile>
            <app-product-box
              [product]="product"
              class="w-full"
              [fullWidthMode]="cols() === 1"
              (addToCart)="onAddToCart($event)"
            ></app-product-box>
          </mat-grid-tile>
        }
      </mat-grid-list>
    </mat-drawer-content>
  </mat-drawer-container> `,
  providers: [StoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly cartService = inject(CartService);
  private readonly storeService = inject(StoreService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sortSignal = signal<string>("desc");
  private readonly limitSignal = signal<number>(12);
  private readonly categorySignal = signal<string>("all");
  readonly cols = signal<number>(3);

  readonly rowHeight = computed(() => ROWS_HEIGHT[this.cols()]);

  readonly products = derivedAsync(() =>
    this.storeService
      .getAllProducts(
        this.limitSignal(),
        this.sortSignal(),
        this.categorySignal(),
      )
      .pipe(
        filter((products) => !!products),
        takeUntilDestroyed(this.destroyRef),
      ),
  );

  onSortValueChange(newSort: string): void {
    this.sortSignal.set(newSort);
  }

  onItemsShowCountChange(newLimit: number): void {
    this.limitSignal.set(newLimit);
  }

  onShowCategory(newCategory: string): void {
    this.categorySignal.set(newCategory);
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols.set(colsNum);
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
}
