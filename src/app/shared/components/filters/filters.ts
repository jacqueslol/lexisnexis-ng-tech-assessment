import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged } from 'rxjs';

type FilterForm = {
  search: FormControl<string>;
  category: FormControl<string>;
  sort: FormControl<'name' | 'price'>;
};

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './filters.html',
  styleUrls: ['./filters.scss'],
})
export class FiltersComponent {
  faFilter = faFilter;
  filtersOpen = false;

  filtersForm = new FormGroup<FilterForm>({
    search: new FormControl('', { nonNullable: true }),
    category: new FormControl('all', { nonNullable: true }),
    sort: new FormControl<'name' | 'price'>('name', { nonNullable: true }),
  });

  constructor() {
    this.filtersForm.controls.search.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.emitFilters());

    this.filtersForm.controls.category.valueChanges.subscribe(() => this.emitFilters());

    this.filtersForm.controls.sort.valueChanges.subscribe(() => this.emitFilters());
  }

  emitFilters() {
    this.filtersChange.emit(this.filtersForm.getRawValue());
  }

  toggleFilters() {
    this.filtersOpen = !this.filtersOpen;
  }

  @Output() filtersChange = new EventEmitter<{
    search: string;
    category: string;
    sort: 'name' | 'price';
  }>();
}
