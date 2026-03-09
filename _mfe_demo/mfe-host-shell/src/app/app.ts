import {
  Component,
  signal,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MicroFrontendService } from './micro-frontend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('host');

  products = [
    {
      id: '1',
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with high precision.',
      price: 29.99,
      category: 'electronics',
      imageUrl: 'http://localhost:4200/assets/images/mouse.jpg',
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      description: 'RGB keyboard with tactile switches.',
      price: 79.99,
      category: 'electronics',
      imageUrl: 'http://localhost:4200/assets/images/keyboard.jpg',
    },
    {
      id: '3',
      name: 'Gaming Mouse',
      description: 'High DPI mouse designed for gaming performance.',
      price: 49.99,
      category: 'electronics',
      imageUrl: 'http://localhost:4200/assets/images/mouse.jpg',
    },
  ];

  @ViewChild('productDetails', { read: ViewContainerRef, static: true })
  productDetailsContainer!: ViewContainerRef;
  @ViewChild('catalog', { read: ViewContainerRef, static: true })
  catalogContainer!: ViewContainerRef;

  private productDetailsComponentRef: ComponentRef<any> | null = null;
  private catalogComponentRef: ComponentRef<any> | null = null;

  constructor(private microFrontendService: MicroFrontendService) {}

  async ngOnInit(): Promise<void> {
    try {
      // Product Details
      const productDetailsModule = await this.microFrontendService.loadRemoteComponent(
        'remote-app',
        './ProductDetailsComponent',
      );
      const productDetailsComponent = this.resolveRemoteComponent(
        productDetailsModule,
        './ProductDetailsComponent',
      );

      this.productDetailsContainer.clear();

      this.productDetailsComponentRef =
        this.productDetailsContainer.createComponent(productDetailsComponent);

      this.productDetailsComponentRef.setInput('productStatus', 'loaded');
      this.productDetailsComponentRef.setInput('product', this.products[0]);
      this.productDetailsComponentRef.changeDetectorRef.detectChanges();

      // Catalog
      const catalogModule = await this.microFrontendService.loadRemoteComponent(
        'remote-app',
        './CatalogComponent',
      );
      const catalogComponent = this.resolveRemoteComponent(catalogModule, './CatalogComponent');

      this.catalogContainer.clear();

      this.catalogComponentRef = this.catalogContainer.createComponent(catalogComponent);

      this.catalogComponentRef.setInput('title', 'Remote App Catalog');
      this.catalogComponentRef.setInput('pageStatus', 'loaded');
      this.catalogComponentRef.setInput('products', this.products);
      this.catalogComponentRef.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading remote component:', error);
    }
  }

  setProduct(id: string): void {
    if (!this.productDetailsComponentRef) return;

    const product = this.products.find((p) => p.id === id);
    this.productDetailsComponentRef.setInput('productStatus', 'loading');

    setTimeout(() => {
      this.productDetailsComponentRef?.setInput('product', product);
      this.productDetailsComponentRef?.setInput('productStatus', 'loaded');
    }, 1000);
  }

  private isAngularComponentType(value: unknown): value is Type<unknown> {
    return typeof value === 'function' && 'ɵcmp' in (value as object);
  }

  private resolveRemoteComponent(remoteModule: unknown, exposedModule?: string): Type<unknown> {
    if (typeof remoteModule !== 'object' || remoteModule === null) {
      throw new Error('Remote module did not load as an object.');
    }

    const moduleExports = remoteModule as Record<string, unknown>;

    // Prefer the export that matches exposedModule (e.g., "./CatalogComponent").
    if (exposedModule) {
      const hintedExportName = exposedModule.replace(/^\.\//, '').split('/').pop();
      if (hintedExportName) {
        const hintedType =
          moduleExports[hintedExportName] ??
          (moduleExports['default'] as Record<string, unknown> | undefined)?.[hintedExportName];
        if (this.isAngularComponentType(hintedType)) return hintedType;
      }
    }

    const componentCandidates = new Map<string, Type<unknown>>();
    const addCandidate = (key: string, value: unknown) => {
      if (this.isAngularComponentType(value)) componentCandidates.set(key, value);
    };

    for (const [key, value] of Object.entries(moduleExports)) addCandidate(key, value);

    const defaultExport = moduleExports['default'];
    if (typeof defaultExport === 'object' && defaultExport !== null) {
      for (const [key, value] of Object.entries(defaultExport as Record<string, unknown>)) {
        addCandidate(`default.${key}`, value);
      }
    } else {
      addCandidate('default', defaultExport);
    }

    if (componentCandidates.size === 1) {
      return [...componentCandidates.values()][0];
    }

    const availableExports = Object.keys(moduleExports);
    if (componentCandidates.size > 1) {
      throw new Error(
        `Multiple Angular components found in remote module (${[...componentCandidates.keys()].join(
          ', ',
        )}). Pass a more specific exposedModule/export hint. Available exports: ${
          availableExports.join(', ') || 'none'
        }.`,
      );
    }

    throw new Error(
      `No Angular @Component export found. Available exports: ${
        availableExports.join(', ') || 'none'
      }. Check remoteName, exposedModule, and exported symbol.`,
    );
  }

  ngOnDestroy(): void {
    this.productDetailsComponentRef?.destroy();
  }
}
