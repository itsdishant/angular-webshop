import {
  bootstrapApplication,
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { ApplicationConfig } from "@angular/core";
import { provideRouter, Routes } from "@angular/router";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { HomeComponent } from "./app/components/pages/home.component";
import { CartComponent } from "./app/components/pages/cart.component";
import { provideAnimations } from "@angular/platform-browser/animations";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
