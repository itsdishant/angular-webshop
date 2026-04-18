import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from "@angular/core";
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from "@angular/material/expansion";
import { MatListItem, MatSelectionList } from "@angular/material/list";
import { toSignal } from "@angular/core/rxjs-interop";
import { StoreService } from "src/app/services/store.service";

@Component({
  selector: "app-filters",
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatSelectionList,
    MatListItem,
  ],
  template: `
    @if (categories()) {
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> CATEGORIES </mat-panel-title>
        </mat-expansion-panel-header>
        <mat-selection-list [multiple]="false">
          @for (category of categories(); track category) {
            <mat-list-item
              class="text-center"
              (click)="onShowCategory(category)"
            >
              {{ category }}
            </mat-list-item>
          }
        </mat-selection-list>
      </mat-expansion-panel>
    }
  `,
  providers: [StoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private readonly storeService = inject(StoreService);

  readonly showCategory = output<string>();

  private readonly categoriesFromApi = toSignal(
    this.storeService.getAllCategories(),
    { initialValue: [] },
  );

  readonly categories = computed(() => {
    const categories = this.categoriesFromApi();
    return categories.length ? ["all", ...categories] : [];
  });

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }
}
