import {
  bootstrapApplication,
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, Routes } from "@angular/router";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { HomeComponent } from "./app/components/pages/home.component";
import { CartComponent } from "./app/components/pages/cart.component";
import { PaymentCancelComponent } from "./app/components/pages/payment-cancel.component";
import { PaymentSuccessComponent } from "./app/components/pages/payment-success.component";

export const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "cart", component: CartComponent },
  { path: "payment-success", component: PaymentSuccessComponent },
  { path: "payment-cancel", component: PaymentCancelComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home" },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [provideZoneChangeDetection(), ...appConfig.providers],
}).catch((err) => console.error(err));
