import { Injectable, signal, computed, inject, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../core/models/product.model';
import { delay, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = '/assets/products.json';
  private loadingDuration: string = localStorage.getItem('loadingDuration') || '1000';
  private simulateError: boolean = localStorage.getItem('simulateError') === 'true';

  // ----------------
  // Domain State (signals)
  // ----------------

  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _favorites = signal<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
  private _loaded = signal(false);

  // ----------------
  // Readonly selectors
  // ----------------

  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  favorites = this._favorites.asReadonly();
  loaded = this._loaded.asReadonly();

  // ----------------
  // Filtering helper (pure, uses page-provided filters)
  // ----------------

  getById(id: string): Signal<Product | undefined> {
    if (!this._loaded()) {
      this.loadProducts();
    }

    return computed(() => this._products().find((p) => p.id === id));
  }

  // ----------------
  // Actions
  // ----------------

  loadProducts() {
    if (this._loaded()) return;

    this._loading.set(true);
    this._loaded.set(false);

    this.http
      .get<Product[]>(this.url)
      .pipe(
        delay(Number(this.loadingDuration)),
        switchMap((products) => {
          if (this.simulateError) {
            return throwError(() => new Error('Simulated error'));
          }
          return of(products);
        }),
      )
      .subscribe({
        next: (products) => {
          this._products.set(products);
          this._loading.set(false);
          this._loaded.set(true);
        },
        error: () => {
          this._error.set('Failed to load products');
          this._loading.set(false);
        },
      });
  }

  toggleFavorite(id: string) {
    const updated = this._favorites().includes(id)
      ? this._favorites().filter((f) => f !== id)
      : [...this._favorites(), id];

    this._favorites.set(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  isFavorite(id: string) {
    return this._favorites().includes(id);
  }
}
