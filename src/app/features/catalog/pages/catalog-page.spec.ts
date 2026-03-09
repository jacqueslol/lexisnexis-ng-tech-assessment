import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CatalogPageComponent } from './catalog-page';
import { ProductService } from '../../../shared/services/product';
import { Product } from '../../../core/models/product.model';
import { provideRouter } from '@angular/router';

// Simple mock ProductService using signals
class MockProductService {
  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _favorites = signal<string[]>([]);

  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // let tests control state
  setProducts(p: Product[]) {
    this._products.set(p);
  }
  setLoading(v: boolean) {
    this._loading.set(v);
  }
  setError(msg: string | null) {
    this._error.set(msg);
  }

  loadProducts() {
    // no-op for now; tests will set products directly
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

describe('CatalogPageComponent', () => {
  let fixture: any;
  let component: CatalogPageComponent;
  let mockService: MockProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [{ provide: ProductService, useClass: MockProductService }, provideRouter([])],
    });
    fixture = TestBed.createComponent(CatalogPageComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ProductService) as unknown as MockProductService;
  });

  it('shows loader when loading', () => {
    mockService.setLoading(true);
    mockService.setError(null);
    mockService.setProducts([]);
    fixture.detectChanges();

    const loader = fixture.debugElement.query(By.css('.notice-box.loader'));
    expect(loader).toBeTruthy();
  });

  it('shows error when service.error() has value', () => {
    mockService.setLoading(false);
    mockService.setError('Failed to load');
    mockService.setProducts([]);
    fixture.detectChanges();

    const errorBox = fixture.debugElement.query(By.css('.notice-box.error'));
    expect(errorBox).toBeTruthy();
    expect(errorBox.nativeElement.textContent).toContain('Error occurred while loading products');
  });

  it('shows "No products found" when list is empty and not loading/error', () => {
    mockService.setLoading(false);
    mockService.setError(null);
    mockService.setProducts([]);
    fixture.detectChanges();

    const infoBox = fixture.debugElement.query(By.css('.notice-box.info'));
    expect(infoBox).toBeTruthy();
    expect(infoBox.nativeElement.textContent).toContain('No products found');
  });

  it('renders product grid when there are filtered products', () => {
    mockService.setProducts([
      {
        id: '1',
        name: 'Wireless Mouse',
        description: 'Ergonomic',
        price: 29.99,
        category: 'electronics',
        imageUrl: 'assets/images/mouse.jpg',
      },
    ]);
    mockService.setLoading(false);
    mockService.setError(null);

    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('app-product-grid'));
    expect(grid).toBeTruthy();
  });

});
