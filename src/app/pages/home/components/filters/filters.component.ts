import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { Subscription } from "rxjs";
import { StoreService } from "src/app/services/store.service";

@Component({
  selector: "app-filters",
  templateUrl: "filters.component.html",
  styles: [],
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
