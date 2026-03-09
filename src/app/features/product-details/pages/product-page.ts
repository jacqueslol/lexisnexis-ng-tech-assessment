import { Component, computed, inject, Signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductDetailsComponent } from '../../../shared/components/features/product-details/product-details.component';

type ProductStatus = 'loading' | 'loaded' | 'not-found';

@Component({
  selector: 'app-product-page',
  imports: [ProductDetailsComponent],
  standalone: true,
  template: `
    <app-product-details
      [product]="product()"
      [productStatus]="productStatus()"
    ></app-product-details>
  `,
  providers: [ProductService],
})
export class ProductPageComponent {
  service = inject(ProductService);
  route = inject(ActivatedRoute);
  productId = this.route.snapshot.paramMap.get('id')!;

  product: Signal<Product | undefined> = computed(() =>
    this.service.products().find((p) => p.id === this.productId),
  );

  productStatus: Signal<ProductStatus> = computed(() => {
    if (this.service.loading()) return 'loading';
    return this.product() ? 'loaded' : 'not-found';
  });

  constructor() {
    this.service.loadProducts();
  }
}
