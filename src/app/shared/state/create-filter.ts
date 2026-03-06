import { signal } from '@angular/core';

export function createProductFilters() {
  const search = signal('');
  const category = signal('all');
  const sort = signal<'name' | 'price'>('name');

  return {
    search,
    category,
    sort,
  };
}
