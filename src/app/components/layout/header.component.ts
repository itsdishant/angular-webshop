import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { MatBadge } from "@angular/material/badge";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbar } from "@angular/material/toolbar";
import { derivedAsync } from "ngxtension/derived-async";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-header",
  imports: [MatToolbar, MatMenuModule, MatIcon, MatBadge, CurrencyPipe],
  template: `
    <mat-toolbar class="m-auto justify-between max-w-7xl border-x">
      <a routerLink="home">Lifestyle Stores</a>
      {{ cartItemCount() + " ----> " + itemsQuantity() }}
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon
          [matBadge]="itemsQuantity()"
          [matBadgeHidden]="!itemsQuantity()"
          matBadgeColor="warn"
          >shopping_cart</mat-icon
        >
      </button>
      <mat-menu #menu="matMenu">
        <div class="p-3 divide-y divide-solid">
          <div class="pb-3 flex justify-between">
            <span class="mr-16"> {{ itemsQuantity() }} items </span>
            <a routerLink="cart">View Cart</a>
          </div>
          @if (!isEmpty()) {
            @for (item of cartItems(); track item.id) {
              <div class="py-3">
                <div class="flex font-light mb-2 justify-between">
                  {{ item.name }} x {{ item.quantity }}
                  <span class="font-bold">{{ item.price | currency }}</span>
                </div>
              </div>
            }
            <div class="py-3 font-light flex justify-between">
              Total
              <span class="font-bold">{{ cartTotal() | currency }}</span>
            </div>
          }
          <div class="pt-3 flex justify-between">
            <button
              (click)="onClearCart()"
              class="bg-rose-600 text-white rounded-full w-10 h-10"
            >
              <mat-icon class="m-2">remove_shopping_cart</mat-icon>
            </button>
            <button
              routerLink="cart"
              class="bg-green-600 text-white rounded-full w-10 h-10"
            >
              <mat-icon class="m-2">shopping_cart</mat-icon>
            </button>
          </div>
        </div>
      </mat-menu>
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  readonly cartItems = derivedAsync(() => this.cartService.cartItems$, { initialValue: [] });
  readonly cartTotal = derivedAsync(() => this.cartService.cartTotal$, { initialValue: 0 });
  readonly cartItemCount = derivedAsync(() => this.cartService.cartItemCount$, { initialValue: 0 });
  readonly isEmpty = derivedAsync(() => this.cartService.isEmpty$, { initialValue: true });

  readonly itemsQuantity = computed(() => this.cartItemCount());

  onClearCart(): void {
    this.cartService.clearCart();
  }
}