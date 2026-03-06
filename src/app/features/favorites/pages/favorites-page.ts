import { Component, inject, computed } from '@angular/core';
import { ProductService } from '../../../shared/services/product';
import { ProductGrid } from '../../../shared/components/product-grid/product-grid';
import { ProductFilters } from '../../../core/models/product-filters.model';
import { FiltersComponent } from '../../../shared/components/filters/filters';
import { createProductFilters } from '../../../shared/state/create-filter';
import { NoticeBox } from '../../../shared/components/notice-box/notice-box';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [ProductGrid, FiltersComponent, NoticeBox],
  template: `
    <section class="top-hero">
      <h2>Favorites</h2>
      <app-filters (filtersChange)="updateFilters($event)"></app-filters>
    </section>

    <section class="content">
      @if (service.loading()) {
        <app-notice-box [type]="'loader'">Loading...</app-notice-box>
      } @else if (service.error()) {
        <app-notice-box [type]="'error'">{{ service.error() }}</app-notice-box>
      } @else if (!filteredFavorites().length) {
        <app-notice-box [type]="'info'">No favorites found</app-notice-box>
      } @else {
        <app-product-grid [productsSignal]="filteredFavorites"></app-product-grid>
      }
    </section>
  `,
})
export class FavoritesPageComponent {
  service = inject(ProductService);
  filters: ProductFilters = createProductFilters();

  favoriteProducts = computed(() =>
    this.service.products().filter((p) => this.service.isFavorite(p.id)),
  );

  filteredFavorites = computed(() =>
    this.service.filterProducts(this.favoriteProducts, this.filters),
  );

  constructor() {
    this.service.loadProducts();
  }

  updateFilters(filters: { search: string; category: string; sort: 'name' | 'price' }) {
    this.filters.search.set(filters.search);
    this.filters.category.set(filters.category);
    this.filters.sort.set(filters.sort);
  }
}
