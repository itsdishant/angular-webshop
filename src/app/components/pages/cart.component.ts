import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { CartItem } from "@app/models/cart.model";
import { CartService } from "@app/services/cart.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-cart",
  imports: [MatIcon, CurrencyPipe, RouterLink],
  template: `
    @if (cartItems() && cartItems().length > 0) {
      <div class="min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div class="mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
              {{ "Shopping Cart" }}
            </h1>
            <p class="text-sm sm:text-base text-gray-600 mt-2">
              You have {{ cartItems().length }} item{{
                cartItems().length > 1 ? "s" : ""
              }}
              in your cart
            </p>
          </div>

          <div class="space-y-4 sm:space-y-6">
            @for (item of cartItems(); track $index) {
              <div
                class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
              >
                <div class="p-4 sm:p-6">
                  <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div class="flex-shrink-0">
                      <div
                        class="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-gray-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0"
                      >
                        <img
                          [src]="item.product"
                          [alt]="item.name"
                          class="max-w-full max-h-full object-contain p-2"
                        />
                      </div>
                    </div>

                    <div class="flex-grow">
                      <div
                        class="flex flex-col sm:flex-row sm:justify-between gap-4"
                      >
                        <div class="flex-grow">
                          <h3
                            class="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2"
                          >
                            {{ item.name }}
                          </h3>

                          <div class="block sm:hidden mt-2">
                            <div class="flex items-baseline gap-2">
                              <span class="text-2xl font-bold text-blue-600">
                                {{ item.price * item.quantity | currency }}
                              </span>
                              <span class="text-sm text-gray-500">
                                ({{ item.price | currency }} each)
                              </span>
                            </div>
                          </div>

                          <div class="hidden sm:block mt-1">
                            <div class="flex items-baseline gap-1">
                              <span class="text-sm text-gray-500">{{
                                "Unit Price:"
                              }}</span>
                              <span class="text-base font-medium text-gray-900">
                                {{ item.price | currency }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div class="hidden sm:block text-right">
                          <div class="text-sm text-gray-500 mb-1">
                            {{ "Total" }}
                          </div>
                          <div class="text-xl font-bold text-blue-600">
                            {{ item.price * item.quantity | currency }}
                          </div>
                        </div>

                        <div class="flex justify-end sm:justify-start">
                          <button
                            (click)="removeFromCart(item)"
                            class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                            aria-label="Remove item"
                          >
                            <mat-icon class="text-xl sm:text-2xl"
                              >close</mat-icon
                            >
                          </button>
                        </div>
                      </div>

                      <div class="mt-4 sm:mt-6">
                        <div
                          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div class="flex items-center gap-3">
                            <span class="text-sm text-gray-600">{{
                              "Quantity:"
                            }}</span>
                            <div class="flex items-center gap-2 sm:gap-3">
                              <button
                                (click)="removeQuantity(item)"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors duration-200"
                                aria-label="Decrease quantity"
                              >
                                <mat-icon class="text-sm sm:text-base"
                                  >remove</mat-icon
                                >
                              </button>
                              <span
                                class="text-base sm:text-lg font-semibold min-w-[2rem] text-center"
                              >
                                {{ item.quantity }}
                              </span>
                              <button
                                (click)="addQuantity(item)"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors duration-200"
                                aria-label="Increase quantity"
                              >
                                <mat-icon class="text-sm sm:text-base"
                                  >add</mat-icon
                                >
                              </button>
                            </div>
                          </div>

                          <div
                            class="block sm:hidden pt-3 border-t border-gray-100"
                          >
                            <div class="flex justify-between items-center">
                              <span class="text-sm font-medium text-gray-600">{{
                                "Item Total:"
                              }}</span>
                              <span class="text-lg font-bold text-blue-600">
                                {{ item.price * item.quantity | currency }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="mt-6 sm:mt-8">
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="p-4 sm:p-6">
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
                >
                  <div class="order-2 sm:order-1">
                    <button
                      (click)="clearAllCartItems()"
                      class="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <mat-icon class="text-base sm:text-lg"
                        >delete_sweep</mat-icon
                      >
                      {{ "Clear All Items" }}
                    </button>
                  </div>

                  <div class="order-1 sm:order-2 w-full sm:w-auto">
                    <div class="flex flex-col items-end gap-4">
                      <div class="w-full sm:w-80">
                        <div
                          class="flex justify-between items-center pb-3 border-b border-gray-200"
                        >
                          <span
                            class="text-base sm:text-lg font-medium text-gray-600"
                            >{{ "Subtotal:" }}</span
                          >
                          <span
                            class="text-xl sm:text-2xl font-bold text-gray-900"
                          >
                            {{ total() | currency }}
                          </span>
                        </div>
                        <div class="mt-3 text-right">
                          <p class="text-xs text-gray-500">
                            {{ "Shipping and taxes calculated at checkout." }}
                          </p>
                        </div>
                      </div>

                      <div class="w-full sm:w-auto">
                        <button
                          (click)="onCheckout()"
                          [disabled]="isProcessingPayment()"
                          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          @if (isProcessingPayment()) {
                            <div
                              class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                            ></div>
                            <span>{{ "Processing..." }}</span>
                          } @else {
                            <mat-icon class="text-base sm:text-lg"
                              >shopping_cart_checkout</mat-icon
                            >
                            <span>{{ "Proceed to Checkout" }}</span>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 sm:mt-8 text-center">
            <a
              routerLink="/home"
              class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
            >
              <mat-icon
                class="text-base sm:text-lg group-hover:-translate-x-1 transition-transform"
                >arrow_back</mat-icon
              >
              {{ "Continue Shopping" }}
            </a>
          </div>
        </div>
      </div>
    } @else {
      <div
        class="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:py-16 lg:py-20"
      >
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-md mx-auto">
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center"
            >
              <div class="flex justify-center mb-4 sm:mb-6">
                <div class="bg-gray-100 rounded-full p-4 sm:p-6">
                  <mat-icon class="text-4xl sm:text-5xl text-gray-400"
                    >shopping_cart</mat-icon
                  >
                </div>
              </div>

              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                {{ "Your cart is empty" }}
              </h2>
              <p class="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                {{ "Looks like you haven't added any items to your cart yet." }}
              </p>

              <button
                routerLink="/home"
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <mat-icon class="text-base sm:text-lg">shopping_bag</mat-icon>
                {{ "Start Shopping" }}
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

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly cartItems = toSignal(this.cartService.cartItems$, {
    initialValue: [],
  });

  readonly isProcessingPayment = signal<boolean>(false);

  readonly total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  private readonly stripeSecretKey =
    "sk_test_51TOvPrIPz5nIzXXmDKeWytnwh4LBZKW6LLz1NcZIakwuvaylUu0fyHF9wRJd8FfQXiuJOa3jiP9kFAHThXJb1Ipx00sAbnHUN0";

  async onCheckout(): Promise<void> {
    if (this.isProcessingPayment() || this.cartItems().length === 0) {
      return;
    }

    this.isProcessingPayment.set(true);

    try {
      const response = await fetch(
        "https://api.stripe.com/v1/checkout/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.stripeSecretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: this.buildCheckoutSessionBody(),
        },
      );

      const session = await response.json();

      if (session.id && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(
          session.error?.message || "Failed to create checkout session",
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        `Payment initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      this.isProcessingPayment.set(false);
    }
  }

  private buildCheckoutSessionBody(): string {
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${window.location.origin}/payment-success`);
    params.append("cancel_url", `${window.location.origin}/payment-cancel`);

    this.cartItems().forEach((item, index) => {
      params.append(`line_items[${index}][price_data][currency]`, "usd");
      params.append(
        `line_items[${index}][price_data][product_data][name]`,
        item.name,
      );
      params.append(
        `line_items[${index}][price_data][product_data][images][0]`,
        item.product,
      );
      params.append(
        `line_items[${index}][price_data][unit_amount]`,
        (item.price * 10 * 100).toString(),
      );
      params.append(`line_items[${index}][quantity]`, item.quantity.toString());
    });

    return params.toString();
  }

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
}
