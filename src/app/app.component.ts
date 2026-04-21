import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HeaderComponent } from "./components/layout/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [HeaderComponent, RouterOutlet],
  template: `<app-header /> <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
