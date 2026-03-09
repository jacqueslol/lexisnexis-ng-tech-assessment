import { Component, inject, computed, Signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product';
import { CatalogComponent } from '../../../shared/components/features/catalog/catalog.component';

@Component({
  selector: 'app-favorites-page',
  imports: [CatalogComponent],
  template: `
    <app-catalog
      [title]="'Favorites'"
      [pageStatus]="pageStatus()"
      [products]="favoriteProducts()"
    ></app-catalog>
  `,
})
export class FavoritesPageComponent {
  service = inject(ProductService);

  pageStatus: Signal<string> = computed(() => {
    if (this.service.loading()) return 'loader';
    if (this.service.error()) return 'error';
    return 'loaded';
  });

  favoriteProducts = computed(() => {
    const favorites = this.service.favorites();
    return this.service.products().filter((p) => favorites.includes(p.id));
  });

  constructor() {
    this.service.loadProducts();
  }
}
