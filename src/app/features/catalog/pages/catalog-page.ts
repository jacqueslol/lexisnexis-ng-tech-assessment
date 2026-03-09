import { Component, inject, computed } from '@angular/core';
import { ProductService } from '../../../shared/services/product';
import { CatalogComponent } from '../../../shared/components/features/catalog/catalog.component';

@Component({
  selector: 'app-catalog-page',
  imports: [CatalogComponent],
  template: `
    <app-catalog
      [title]="'Catalog'"
      [pageStatus]="pageStatus()"
      [products]="service.products()"
    ></app-catalog>
  `,
})
export class CatalogPageComponent {
  service = inject(ProductService);

  pageStatus = computed(() => {
    if (this.service.loading()) return 'loader';
    if (this.service.error()) return 'error';
    return 'loaded';
  });

  constructor() {
    this.service.loadProducts();
  }
}
