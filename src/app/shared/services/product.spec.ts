import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product';
import { Product } from '../../core/models/product.model';

describe('ProductService (Angular TestBed)', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with high precision.',
      price: 29.99,
      category: 'electronics',
      imageUrl: 'assets/images/mouse.jpg',
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      description: 'RGB keyboard with tactile switches.',
      price: 79.99,
      category: 'electronics',
      imageUrl: 'assets/images/keyboard.jpg',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    // Make tests deterministic
    (service as any).loadingDuration = '0';
    (service as any).simulateError = false;
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads products successfully', async () => {
    service.loadProducts();
    const req = httpMock.expectOne('/assets/products.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(service.products()).toEqual(mockProducts);
    expect(service.loaded()).toBe(true);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('handles simulated error', () => {
    (service as any).simulateError = true;

    service.loadProducts();

    const req = httpMock.expectOne('/assets/products.json');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(service.error()).toBe('Failed to load products');
    expect(service.loading()).toBe(false);
  });

  it('should toggle favorites', () => {
    const id = '1';
    service.toggleFavorite(id);
    expect(service.isFavorite(id)).toBe(true);

    service.toggleFavorite(id);
    expect(service.isFavorite(id)).toBe(false);
  });

  it('should return product by id', () => {
    (service as any)._products.set(mockProducts);
    (service as any)._loaded.set(true);

    const product = service.getById('2');
    expect(product()).toEqual(mockProducts[1]);
  });
});
