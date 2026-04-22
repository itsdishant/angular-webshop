import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { FiltersComponent } from "../products/filters.component";
import { ProductsHeaderComponent } from "../products/products-header.component";
import { ProductBoxComponent } from "../products/product-box.component";
import { derivedAsync } from "ngxtension/derived-async";
import { filter } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
  imports: [FiltersComponent, ProductsHeaderComponent, ProductBoxComponent],
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

  getGridClass(): string {
    const cols = this.cols();
    if (cols === 1) return "grid grid-cols-1";
    if (cols === 3) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (cols === 4)
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }

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
