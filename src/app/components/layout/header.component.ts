import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { MatBadge } from "@angular/material/badge";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbar } from "@angular/material/toolbar";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-header",
  imports: [MatToolbar, MatMenuModule, MatIcon, MatBadge, CurrencyPipe],
  template: `
    <mat-toolbar class="m-auto justify-between max-w-7xl border-x">
      <a routerLink="home">Lifestyle Stores</a>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon
          [matBadge]="itemsQuantity"
          [matBadgeHidden]="!itemsQuantity"
          matBadgeColor="warn"
          >shopping_cart</mat-icon
        >
      </button>
      <mat-menu #menu="matMenu">
        <div class="p-3 divide-y divide-solid">
          <div class="pb-3 flex justify-between">
            <span class="mr-16"> {{ itemsQuantity }} items </span>
            <a routerLink="cart">View Cart</a>
          </div>
          @if (cart.items.length > 0) {
            @for (item of cart.items; track item.id) {
              <div class="py-3">
                <div class="flex font-light mb-2 justify-between">
                  {{ item.name }} x {{ item.quantity }}
                  <span class="font-bold">{{ item.price | currency }}</span>
                </div>
              </div>
            }
            <div class="py-3 font-light flex justify-between">
              Total
              <span class="font-bold">{{
                getTotal(cart.items) | currency
              }}</span>
            </div>
          }
          <div class="pt-3 flex justify-between">
            <button
              (click)="onClearCart()"
              class="bg-rose-600 text-white rounded-full w-9 h-9"
            >
              <mat-icon>remove_shopping_cart</mat-icon>
            </button>
            <button
              routerLink="cart"
              class="bg-green-600 text-white rounded-full w-9 h-9"
            >
              <mat-icon>shopping_cart</mat-icon>
            </button>
          </div>
        </div>
      </mat-menu> </mat-toolbar
    >,
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  private cartService = inject(CartService);

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
