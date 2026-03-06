import { Component, Input, Signal, inject } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-grid',
  imports: [RouterLink, CurrencyPipe],
  standalone: true,
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  service = inject(ProductService);
  @Input() productsSignal!: Signal<Product[]>;

  constructor() {}
}
