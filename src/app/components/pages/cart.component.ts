import { CurrencyPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  DestroyRef,
} from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { loadStripe } from "@stripe/stripe-js";
import { CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, switchMap } from "rxjs";
import { derivedAsync } from "ngxtension/derived-async";
import { Subject } from "rxjs";

@Component({
  selector: "app-cart",
  imports: [MatCard, MatTableModule, MatIcon, CurrencyPipe],
  template: ` @if (cartItems() && cartItems().length > 0) {
      <mat-card class="max-w-7xl mx-auto">
        <table
          mat-table
          [dataSource]="cartItems()"
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
                {{ total() | currency }}
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
                [disabled]="isProcessingPayment()"
              >
                {{
                  isProcessingPayment()
                    ? "Processing..."
                    : "Proceed to Checkout"
                }}
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
          <tr mat-footer-row *matFooterRowDef="displayedColumns()"></tr>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly cartItems = toSignal(this.cartService.cartItems$, {
    initialValue: [],
  });
  readonly cartTotal = toSignal(this.cartService.cartTotal$, {
    initialValue: 0,
  });

  readonly isProcessingPayment = signal<boolean>(false);
  readonly displayedColumns = signal<string[]>([
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ]);

  readonly total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  private readonly stripePromise = loadStripe(
    "pk_test_51L3e7nSHAdMfPiwldQLIqAVhtA0QacBNjRS79zKqdfXZ4zMu5nJi5udA58sMbVvKURDgSTkLPddPuMNkH4bAkY9y00342NgoQh",
  );

  private readonly checkoutTrigger$ = new Subject<void>();

  private readonly checkoutResponse = derivedAsync(() =>
    this.checkoutTrigger$.pipe(
      filter(() => this.cartItems().length > 0),
      switchMap(() =>
        this.http.post("http://localhost:4242/checkout", {
          items: this.cartItems(),
        }),
      ),
    ),
  );

  addQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  removeQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  clearAllCartItems(): void {
    this.cartService.clearCart();
  }

  async onCheckout(): Promise<void> {
    if (this.isProcessingPayment() || this.cartItems().length === 0) {
      return;
    }

    this.isProcessingPayment.set(true);

    try {
      this.checkoutTrigger$.next();

      const response = await this.checkoutResponse();

      if (response && (response as any).id) {
        const stripe = await this.stripePromise;

        if (stripe) {
          const { error } = await stripe.confirmPayment({
            elements: stripe.elements(),
            clientSecret: (response as any).clientSecret,
            confirmParams: {
              return_url: `${window.location.origin}/payment-success`,
            },
            redirect: "if_required",
          });

          if (error) {
            console.error("Payment error:", error);
            alert(`Payment failed: ${error.message}`);
          } else {
            this.cartService.clearCart();
          }
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      this.isProcessingPayment.set(false);
    }
  }
}
