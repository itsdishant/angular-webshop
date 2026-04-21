import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-products-header",
  imports: [MatCard, MatIcon, MatMenuModule],
  template: `<mat-card class="mb-4 px-4">
    <div class="flex justify-between">
      <div class="my-5 mx-3">
        <button mat-button [matMenuTriggerFor]="sortByMenu">
          Sort by {{ sort }}
        </button>
        <mat-menu #sortByMenu="matMenu">
          <button mat-menu-item (click)="onSortUpdated('desc')">desc</button>
          <button mat-menu-item (click)="onSortUpdated('asc')">asc</button>
        </mat-menu>
      </div>
      <div class="flex items-center">
        <div>
          <button mat-button [matMenuTriggerFor]="menu">
            Show {{ itemsShowCount }}
            <mat-icon iconPositionEnd>expand_more</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onItemsUpdated(12)">12</button>
            <button mat-menu-item (click)="onItemsUpdated(24)">24</button>
            <button mat-menu-item (click)="onItemsUpdated(36)">36</button>
          </mat-menu>
        </div>
        <button (click)="onColumnsUpdated(1)">
          <mat-icon>view_list</mat-icon>
        </button>
        <button (click)="onColumnsUpdated(3)">
          <mat-icon>view_module</mat-icon>
        </button>
        <button (click)="onColumnsUpdated(4)">
          <mat-icon>view_comfy</mat-icon>
        </button>
      </div>
    </div>
  </mat-card> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsHeaderComponent {
  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() sortValueChange = new EventEmitter<string>();
  @Output() itemsShowCountChange = new EventEmitter<number>();

  sort = "desc";
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
