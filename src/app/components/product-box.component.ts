import { CurrencyPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-product-box",
  imports: [MatCard, MatIcon, NgClass, CurrencyPipe],
  template: ` @if (product) {
    <mat-card [ngClass]="{ 'text-center': !fullWidthMode }">
      <div [ngClass]="{ flex: fullWidthMode }">
        <img
          class="mb-1 mx-auto h-[200px]"
          [ngClass]="{ 'h-200px': !fullWidthMode, 'h-[360px]': fullWidthMode }"
          [src]="product.image"
        />
        <div
          class="w-full"
          [ngClass]="{ 'px-8 flex flex-col justify-between': fullWidthMode }"
        >
          <div>
            <h5>{{ product.category }}</h5>
            <p class="truncate hover:whitespace-normal">{{ product.title }}</p>
            @if (fullWidthMode) {
              <p>{{ product.description }}</p>
            }
          </div>
          <div class="flex justify-between px-3">
            <span class="text-red-400">{{ product.price | currency }}</span>
            <button (click)="onAddToCart()">
              <mat-icon class="text-gray-500">shopping_cart</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </mat-card>
  }`,
  standalone: true,
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
