import { CurrencyPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { loadStripe } from "@stripe/stripe-js";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  imports: [MatCard, MatTableModule, MatIcon, CurrencyPipe],
  template: ` @if (cart.items.length > 0) {
      <mat-card class="max-w-7xl mx-auto">
        <ng-template></ng-template>
        <table
          mat-table
          [dataSource]="dataSource"
          class="mat-elevation-z8 w-full"
        >
          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let element">
              <img
                src="{{ element.product }}"
                alt="product"
                class="w-[100px] my-5"
              />
            </td>
            <td mat-footer-cell *matFooterCellDef>
              <button mat-raised-button routerLink="/home">
                Continue Shopping
              </button>
            </td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">
              <span class="truncate max-w-xs block">{{ element.name }}</span>
            </td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let element">
              {{ element.price | currency }}
            </td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Quantity</th>
            <td mat-cell *matCellDef="let element">
              <button (click)="removeQuantity(element)" mat-icon-button>
                <mat-icon>remove</mat-icon>
              </button>
              <span>{{ element.quantity }}</span>
              <button (click)="addQuantity(element)" mat-icon-button>
                <mat-icon>add</mat-icon>
              </button>
            </td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let element">
              {{ element.price * element.quantity | currency }}
            </td>
            <td mat-footer-cell *matFooterCellDef>
              <span class="font-bold py-5 block">
                {{ getTotal(cart.items) | currency }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>
              <button
                (click)="clearAllCartItems()"
                mat-raised-button
                color="warn"
                class="float-right"
              >
                Clear All
              </button>
            </th>
            <td mat-cell *matCellDef="let element">
              <button
                (click)="removeFromCart(element)"
                mat-mini-fab
                color="warn"
                class="float-right"
              >
                <mat-icon>close</mat-icon>
              </button>
            </td>
            <td mat-footer-cell *matFooterCellDef>
              <button
                (click)="onCheckout()"
                mat-raised-button
                color="primary"
                class="float-right"
              >
                Proceed to Checkout
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
        </table>
      </mat-card>
    } @else {
      <mat-card class="max-w-7xl mx-auto">
        <p class="p-2">
          Your cart is empty!
          <button mat-raised-button routerLink="/home">Start Shopping</button>
        </p>
      </mat-card>
    }`,
  providers: [HttpClient],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private http = inject(HttpClient);

  cart: Cart = {
    items: [
      {
        product: "https://via.placeholder.com/300",
        name: "snickers",
        price: 150,
        quantity: 1,
        id: 1,
      },
      {
        product: "https://via.placeholder.com/300",
        name: "shoes",
        price: 150,
        quantity: 1,
        id: 1,
      },
    ],
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<String> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  clearAllCartItems(): void {
    this.cartService.clearCart();
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  addQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  removeQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http
      .post("http://localhost:4242/checkout", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51L3e7nSHAdMfPiwldQLIqAVhtA0QacBNjRS79zKqdfXZ4zMu5nJi5udA58sMbVvKURDgSTkLPddPuMNkH4bAkY9y00342NgoQh",
        );
      });
  }
}
