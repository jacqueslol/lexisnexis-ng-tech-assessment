import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { CatalogComponent } from './catalog.component';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../services/product';

class MockProductService {
  toggleFavorite() {}
  isFavorite() {
    return false;
  }
}

describe('CatalogComponent', () => {
  let fixture: any;
  let component: CatalogComponent;

  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse',
      price: 29.99,
      category: 'electronics',
      imageUrl: 'assets/images/mouse.jpg',
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      description: 'RGB keyboard',
      price: 79.99,
      category: 'electronics',
      imageUrl: 'assets/images/keyboard.jpg',
    },
    {
      id: '3',
      name: 'Mouse Pad',
      description: 'Soft accessory',
      price: 9.99,
      category: 'accessories',
      imageUrl: 'assets/images/mouse-pad.jpg',
    },
  ];

  const setInputs = (status: 'loader' | 'error' | 'loaded', list: Product[]) => {
    fixture.componentRef.setInput('title', 'Catalog');
    fixture.componentRef.setInput('pageStatus', status);
    fixture.componentRef.setInput('products', list);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [provideRouter([]), { provide: ProductService, useClass: MockProductService }],
    });

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
  });

  it('shows loader notice when pageStatus is loader', () => {
    setInputs('loader', products);

    const loader = fixture.debugElement.query(By.css('.notice-box.loader'));
    expect(loader).toBeTruthy();
    expect(loader.nativeElement.textContent).toContain('Loading...');
  });

  it('shows error notice when pageStatus is error', () => {
    setInputs('error', products);

    const error = fixture.debugElement.query(By.css('.notice-box.error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Error occurred while loading products');
  });

  it('shows "No products found" when loaded and filteredProducts is empty', () => {
    setInputs('loaded', []);

    const info = fixture.debugElement.query(By.css('.notice-box.info'));
    expect(info).toBeTruthy();
    expect(info.nativeElement.textContent).toContain('No products found');
  });

  it('renders product grid when loaded and products are available', () => {
    setInputs('loaded', products);

    const grid = fixture.debugElement.query(By.css('app-product-grid'));
    expect(grid).toBeTruthy();
  });

  it('updates filters and recomputes filteredProducts', () => {
    setInputs('loaded', products);

    component.updateFilters({
      search: 'mouse',
      category: 'electronics',
      sort: 'price',
    });

    fixture.detectChanges();

    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Wireless Mouse');
    expect(filtered[0].category).toBe('electronics');
  });
});
