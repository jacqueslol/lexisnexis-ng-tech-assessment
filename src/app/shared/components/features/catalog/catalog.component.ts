import { Component, computed, input } from '@angular/core';
import { NoticeBox } from '../../notice-box/notice-box';
import { Product } from '../../../../core/models/product.model';
import { ProductGrid } from '../../product-grid/product-grid';
import { FiltersComponent } from '../../filters/filters';
import { createProductFilters } from '../../../state/create-filter';
import { ProductFilters } from '../../../../core/models/product-filters.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NoticeBox, ProductGrid, FiltersComponent],
  template: `
    <section class="top-hero">
      <h2>{{ title() }}</h2>
      <app-filters (filtersChange)="updateFilters($event)"></app-filters>
    </section>
    <section class="content">
      @if (pageStatus() === 'loader') {
        <app-notice-box [type]="'loader'">Loading...</app-notice-box>
      } @else if (pageStatus() === 'error') {
        <app-notice-box [type]="'error'">Error occurred while loading products</app-notice-box>
      } @else if (!filteredProducts().length) {
        <app-notice-box [type]="'info'">No products found</app-notice-box>
      } @else {
        <app-product-grid [productsSignal]="filteredProducts"></app-product-grid>
      }
    </section>
  `,
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  title = input<string>();
  pageStatus = input();
  products = input<Product[]>([]);
  filters: ProductFilters = createProductFilters();

  filteredProducts = computed(() => {
    let list = [...this.products()];

    if (this.filters.search())
      list = list.filter((p) => p.name.toLowerCase().includes(this.filters.search().toLowerCase()));
    if (this.filters.category() !== 'all')
      list = list.filter((p) => p.category === this.filters.category());
    if (this.filters.sort() === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (this.filters.sort() === 'price') list.sort((a, b) => a.price - b.price);

    return list;
  });

  updateFilters(filters: { search: string; category: string; sort: 'name' | 'price' }) {
    this.filters.search.set(filters.search);
    this.filters.category.set(filters.category);
    this.filters.sort.set(filters.sort);
  }
}
