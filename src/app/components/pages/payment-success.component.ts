import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-payment-success",
  standalone: true,
  imports: [RouterLink, MatIcon],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div
        class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-center"
      >
        <div class="flex justify-center mb-4">
          <div class="bg-green-100 rounded-full p-3">
            <mat-icon class="text-green-600 text-4xl">check_circle</mat-icon>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p class="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <button
          routerLink="/home"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  `,
})
export class PaymentSuccessComponent {
  private cartService = inject(CartService);
  constructor() {
    this.cartService.clearCart();
  }
}
