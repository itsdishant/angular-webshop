import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-payment-cancel",
  standalone: true,
  imports: [RouterLink, MatIcon],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div
        class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-center"
      >
        <div class="flex justify-center mb-4">
          <div class="bg-red-100 rounded-full p-3">
            <mat-icon class="text-red-600 text-4xl">cancel</mat-icon>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p class="text-gray-600 mb-6">
          Your payment was not completed. You can try again whenever you're
          ready.
        </p>
        <button
          routerLink="/cart"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Return to Cart
        </button>
      </div>
    </div>
  `,
})
export class PaymentCancelComponent {}
