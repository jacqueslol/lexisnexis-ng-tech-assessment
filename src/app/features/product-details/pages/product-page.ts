import { Component, computed, inject, Signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { NoticeBox } from '../../../shared/components/notice-box/notice-box';

type ProductStatus = 'loading' | 'loaded' | 'not-found';

@Component({
  selector: 'app-product-page',
  imports: [NoticeBox],
  standalone: true,
  template: `
    <h2>Product data:</h2>
    @if (productStatus() === 'loading') {
      <app-notice-box [type]="'loader'">Loading...</app-notice-box>
    } @else if (productStatus() === 'not-found') {
      <app-notice-box [type]="'error'">Product not found</app-notice-box>
    } @else if (productStatus() === 'loaded') {
      @if (product(); as product) {
        <div class="product-details">
          <img [src]="product.imageUrl" [alt]="'Image of ' + product.name" class="product-image" />
          <p><strong>Title:</strong> {{ product.name }}</p>
          <p><strong>Price:</strong> \${{ product.price }}</p>
          <hr />
          <p><strong>Description:</strong> {{ product.description }}</p>
        </div>
      } @else {
        <p>Error viewing</p>
      }
    }
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

  // reactive product status
  productStatus: Signal<ProductStatus> = computed(() => {
    if (this.service.loading()) return 'loading';
    return this.product() ? 'loaded' : 'not-found';
  });

  constructor() {
    this.service.loadProducts();
  }
}
