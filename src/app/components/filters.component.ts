import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from "@angular/material/expansion";
import { MatListItem, MatSelectionList } from "@angular/material/list";
import { Subscription } from "rxjs";
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
  template: ` @if (categories) {
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title> CATEGORIES </mat-panel-title>
      </mat-expansion-panel-header>
      <mat-selection-list [multiple]="false">
        @for (category of categories; track category) {
          <mat-list-item class="text-center" (click)="onShowCategory(category)">
            {{ category }}
          </mat-list-item>
        }
      </mat-selection-list>
    </mat-expansion-panel>
  }`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit {
  categories: Array<string> = [];
  categoriesSubscription: Subscription | undefined;

  @Output() showCategory = new EventEmitter<string>();

  private storeService = inject(StoreService);

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService
      .getAllCategories()
      .subscribe((_categories) => {
        this.categories = _categories;
        this.categories.unshift("all");
      });
  }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
