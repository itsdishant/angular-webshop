import {
  ChangeDetectionStrategy,
  Component,
  output,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-products-header",
  imports: [MatIcon, MatMenuModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="flex flex-wrap justify-between items-center gap-4 p-4">
        <div>
          <button
            [matMenuTriggerFor]="sortByMenu"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-200 text-sm"
          >
            Sort by {{ sort }}
            <mat-icon class="text-sm">expand_more</mat-icon>
          </button>
          <mat-menu #sortByMenu="matMenu">
            <button mat-menu-item (click)="onSortUpdated('desc')">desc</button>
            <button mat-menu-item (click)="onSortUpdated('asc')">asc</button>
          </mat-menu>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div>
            <button
              [matMenuTriggerFor]="menu"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-150 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-200 text-sm"
            >
              Show {{ itemsShowCount }}
              <mat-icon class="text-sm">expand_more</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="onItemsUpdated(12)">12</button>
              <button mat-menu-item (click)="onItemsUpdated(24)">24</button>
              <button mat-menu-item (click)="onItemsUpdated(36)">36</button>
            </mat-menu>
          </div>

          <div class="flex gap-1">
            <button
              (click)="onColumnsUpdated(1)"
              class="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              mat-icon-button
            >
              <mat-icon>view_list</mat-icon>
            </button>
            <button
              (click)="onColumnsUpdated(3)"
              class="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              mat-icon-button
            >
              <mat-icon>view_module</mat-icon>
            </button>
            <button
              (click)="onColumnsUpdated(4)"
              class="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              mat-icon-button
            >
              <mat-icon>view_comfy</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsHeaderComponent {
  itemsShowCountChange = output<number>();
  columnsCountChange = output<number>();
  sortValueChange = output<string>();

  sort = "asc";
  itemsShowCount = 12;

  onSortUpdated(newSort: string): void {
    this.sort = newSort;
    this.sortValueChange.emit(newSort);
  }

  onItemsUpdated(count: number): void {
    this.itemsShowCount = count;
    this.itemsShowCountChange.emit(count);
  }

  onColumnsUpdated(colsNum: number): void {
    this.columnsCountChange.emit(colsNum);
  }
}
