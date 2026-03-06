import { Routes } from '@angular/router';
import { ProductPageComponent } from './pages/product-page';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':id',
    component: ProductPageComponent,
  },
];
