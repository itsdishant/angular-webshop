import { Component, OnInit } from "@angular/core";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "cart.component.html",
  styles: [],
})
export class CartComponent implements OnInit {
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

  constructor(private cartService: CartService) {}

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
}