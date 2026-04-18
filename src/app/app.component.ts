import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HeaderComponent } from "./components/layout/header.component";
import { HomeComponent } from "./components/pages/home.component";

@Component({
  selector: "app-root",
  imports: [HomeComponent, HeaderComponent],
  template: `<app-header /> <app-home />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
