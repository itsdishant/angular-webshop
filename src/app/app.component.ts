import { Component, OnInit, inject } from "@angular/core";
import { Cart } from "./models/cart.model";
import { CartService } from "./services/cart.service";

@Component({
  selector: "app-root",
  template: `<app-header [cart]="cart"></app-header
    ><router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent implements OnInit {
  cart: Cart = { items: [] };
  private cartSerice = inject(CartService);

  ngOnInit(): void {
    this.cartSerice.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
  }
}
