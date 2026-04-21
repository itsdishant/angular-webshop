import { CurrencyPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-product-box",
  imports: [CurrencyPipe, MatIcon],
  template: `
    @if (product) {
      <div
        class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col"
      >
        <div [class]="fullWidthMode ? 'flex flex-col sm:flex-row' : ''">
          <div
            [class]="fullWidthMode ? 'sm:w-48 md:w-64 flex-shrink-0' : 'p-4'"
          >
            <img
              [class]="
                fullWidthMode
                  ? 'w-full h-48 sm:h-full object-contain'
                  : 'w-full h-48 object-contain mb-2'
              "
              [src]="product.image"
              [alt]="product.title"
            />
          </div>

          <div
            [class]="
              fullWidthMode
                ? 'flex-1 p-4 sm:p-6 flex flex-col justify-between'
                : 'p-4'
            "
          >
            <div>
              <h5 class="text-xs text-gray-500 uppercase tracking-wide mb-2">
                {{ product.category }}
              </h5>

              <p
                class="text-sm font-medium text-gray-900 line-clamp-2 hover:line-clamp-none mb-2"
              >
                {{ product.title }}
              </p>

              @if (fullWidthMode) {
                <p class="text-sm text-gray-600 line-clamp-3 mb-3">
                  {{ product.description }}
                </p>
              }
            </div>

            <div
              class="flex justify-between items-center pt-3 border-t border-gray-100"
            >
              <span class="text-lg font-bold text-red-500">
                {{ product.price | currency }}
              </span>
              <button
                (click)="onAddToCart()"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors duration-200 shadow-md hover:shadow-lg"
                aria-label="Add to cart"
              >
                <mat-icon>shopping_cart</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .hover\:line-clamp-none:hover {
        -webkit-line-clamp: unset;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
