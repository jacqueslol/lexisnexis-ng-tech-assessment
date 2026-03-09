import { Component, input } from '@angular/core';
import { NoticeBox } from '../../notice-box/notice-box';
import { Product } from '../../../../core/models/product.model';

export type ProductStatus = 'loading' | 'loaded' | 'not-found';

@Component({
  selector: 'app-product-details',
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
        <p>Error viewing product</p>
      }
    }
  `,
})
export class ProductDetailsComponent {
  product = input<Product | undefined>(undefined);
  productStatus = input<ProductStatus>('loading');
}
