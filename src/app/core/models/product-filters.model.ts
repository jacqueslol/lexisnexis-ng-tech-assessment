import { WritableSignal } from '@angular/core';

export interface ProductFilters {
  search: WritableSignal<string>;
  category: WritableSignal<string>;
  sort: WritableSignal<'name' | 'price'>;
}
