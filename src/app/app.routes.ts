import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/catalog/catalog.routes').then((m) => m.CATALOG_ROUTES),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./features/product-details/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./features/favorites/favourites.routes').then((m) => m.FAVORITES_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
];
