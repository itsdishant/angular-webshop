import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject } from "rxjs";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Cart, CartItem } from "../models/cart.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly cartSubject = new BehaviorSubject<Cart>({ items: [] });

  readonly cart$ = this.cartSubject.asObservable();

  readonly cartItems$ = this.cart$.pipe(
    map((cart) => cart.items),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly cartTotal$ = this.cartItems$.pipe(
    map((items) => this.calculateTotal(items)),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly cartItemCount$ = this.cartItems$.pipe(
    map((items) => items.reduce((count, item) => count + item.quantity, 0)),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly isEmpty$ = this.cartItems$.pipe(
    map((items) => items.length === 0),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, "Ok", { duration: 3000 });
  }

  private updateCart(items: CartItem[], snackbarMessage?: string): void {
    this.cartSubject.next({ items: [...items] });
    if (snackbarMessage) {
      this.showSnackbar(snackbarMessage);
    }
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartSubject.value.items;
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.id === item.id,
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
      };
      this.updateCart(updatedItems, "1 item added to cart.");
    } else {
      this.updateCart(
        [...currentItems, { ...item, quantity: 1 }],
        "1 item added to cart.",
      );
    }
  }

  removeFromCart(item: CartItem, shouldShowSnackbar = true): CartItem[] {
    const filteredItems = this.cartSubject.value.items.filter(
      (cartItem) => cartItem.id !== item.id,
    );

    if (shouldShowSnackbar) {
      this.updateCart(filteredItems, "1 item removed from cart.");
    } else {
      this.cartSubject.next({ items: filteredItems });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    const currentItems = this.cartSubject.value.items;
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.id === item.id,
    );

    if (existingItemIndex === -1) {
      return;
    }

    const existingItem = currentItems[existingItemIndex];

    if (existingItem.quantity > 1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
      this.updateCart(updatedItems, "1 quantity reduced from product.");
    } else {
      this.removeFromCart(item);
    }
  }

  clearCart(): void {
    this.updateCart([], "Cart is cleared.");
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }
}
