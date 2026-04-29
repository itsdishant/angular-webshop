import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FiltersComponent } from "../products/filters.component";
import { ProductsHeaderComponent } from "../products/products-header.component";
import { ProductBoxComponent } from "../products/product-box.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { StoreService } from "@app/services/store.service";
import { CartService } from "@app/services/cart.service";
import { Product } from "@app/models/product.model";

const ROWS_HEIGHT: Record<number, number> = {
  1: 400,
  3: 335,
  4: 350,
};

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    FiltersComponent,
    ProductsHeaderComponent,
    ProductBoxComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex flex-col lg:flex-row gap-6 py-6">
          <aside class="lg:w-80 w-full">
            <div class="sticky top-6">
              <app-filters
                (showCategory)="onShowCategory($event)"
              ></app-filters>
            </div>
          </aside>

          <main class="flex-1">
            <app-products-header
              (columnsCountChange)="onColumnsCountChange($event)"
              (sortValueChange)="onSortValueChange($event)"
              (itemsShowCountChange)="onItemsShowCountChange($event)"
            ></app-products-header>

            <div [class]="getGridClass()" class="gap-4">
              @for (product of products(); track product.id) {
                <div>
                  <app-product-box
                    [product]="product"
                    [fullWidthMode]="cols() === 1"
                    (addToCart)="onAddToCart($event)"
                  ></app-product-box>
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  providers: [StoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly cartService = inject(CartService);
  private readonly storeService = inject(StoreService);

  readonly cols = signal<number>(3);
  readonly rowHeight = computed(() => ROWS_HEIGHT[this.cols()]);

  readonly products = toSignal(this.storeService.products$, {
    initialValue: [],
  });

  getGridClass(): string {
    const cols = this.cols();
    if (cols === 1) return "grid grid-cols-1";
    if (cols === 3) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (cols === 4)
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }

  onSortValueChange(newSort: string): void {
    this.storeService.setSort(newSort);
  }

  onItemsShowCountChange(newLimit: number): void {
    this.storeService.setLimit(newLimit);
  }

  onShowCategory(newCategory: string): void {
    this.storeService.setCategory(newCategory);
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
