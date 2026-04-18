import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { Cart } from "./models/cart.model";
import { CartService } from "./services/cart.service";
import { HeaderComponent } from "./components/layout/header.component";
import { HomeComponent } from "./components/pages/home.component";

@Component({
  selector: "app-root",
  imports: [HomeComponent, HeaderComponent],
  template: `<app-header [cart]="cart"></app-header
    >
    <app-home/>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
