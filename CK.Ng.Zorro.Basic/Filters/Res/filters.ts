import { Component, input, linkedSignal, output } from '@angular/core';
import { Filter, FilterType, SelectFilter, SwitchFilter } from '@local/ck-gen';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component( {
  selector: 'ck-filters',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzSelectModule, NzSwitchModule, FontAwesomeModule],
  templateUrl: './filters.html'
} )
export class Filters<T> {
  filters = input.required<Array<Filter<T>>>();
  show = input<boolean>();
  filtersChanged = output<void>();

  readonly closeIcon = faClose;
  readonly filterIcon = faFilter;
  readonly plusIcon = faPlus;

  showFilters = linkedSignal( () => this.show() ?? true );

  instanceOfSelect( filter: Filter<T> ): filter is SelectFilter<T> {
    return filter.filterType === FilterType.SELECT;
  }

  asSelectFilter( filter: Filter<T> ): SelectFilter<T> {
    return filter as SelectFilter<T>;
  }

  instanceOfSwitch( filter: Filter<unknown> ): filter is SwitchFilter {
    return filter.filterType === FilterType.SWITCH;
  }

  asSwitchFilter( filter: Filter<T> ): SwitchFilter {
    return filter as SwitchFilter;
  }

  clearFilter( filter: SelectFilter<T> ): void {
    filter.value = filter.defaultValue;
  }

  filterValueChanged(): void {
    this.filtersChanged.emit();
  }

  getFilterClassName( filter: Filter<T> ): string {
    let res = 'ck-filter';
    if ( this.instanceOfSelect( filter ) ) {
      const selectFilter = this.asSelectFilter( filter );
      if ( selectFilter.active && selectFilter.value && ( selectFilter.value as Array<T> ).length > 0 ) {
        res += ' active';
      }
    }
    if ( this.instanceOfSwitch( filter ) ) {
      const switchFilter = this.asSwitchFilter( filter );
      if ( switchFilter.active ) {
        res += ' active';
      }
    }
    return res;
  }
}
