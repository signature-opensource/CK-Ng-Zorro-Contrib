import { Component, input, linkedSignal, output } from '@angular/core';
import { DateRangeFilter, Filter, FilterType, SelectFilter, SwitchFilter } from '@local/ck-gen';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component( {
  selector: 'ck-filters',
  imports: [FormsModule, TranslateModule, NzSelectModule, NzSwitchModule, NzDatePickerModule],
  templateUrl: './filters.html'
} )
export class Filters<T> {
  filters = input.required<Array<Filter<T>>>();
  show = input<boolean>();
  filtersChanged = output<void>();

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

  instanceOfDateRange( filter: Filter<unknown> ): filter is DateRangeFilter {
    return filter.filterType === FilterType.DATE_RANGE;
  }

  asDateRangeFilter( filter: Filter<T> ): DateRangeFilter {
    return filter as unknown as DateRangeFilter;
  }

  clearFilter( filter: SelectFilter<T> ): void {
    filter.value = filter.defaultValue;
  }

  // Only impose ng-zorro's max-selection limit (which also renders its "N / M" badge)
  // when the filter defines a genuine cap. Otherwise return Infinity so no limit/badge shows.
  selectionLimit( filter: SelectFilter<T> ): number {
    return filter.maxSelectionCount < filter.options.length ? filter.maxSelectionCount : Infinity;
  }

  filterValueChanged(): void {
    this.filtersChanged.emit();
  }

  getFilterClassName( filter: Filter<T> ): string {
    let res = 'ck-filter';
    if ( this.instanceOfSelect( filter ) ) {
      const selectFilter = this.asSelectFilter( filter );
      // Single-select stores a scalar value; multiple/tags store an array.
      const hasValue = selectFilter.mode === 'default'
        ? selectFilter.value !== undefined && selectFilter.value !== null && selectFilter.value !== ''
        : Array.isArray( selectFilter.value ) && selectFilter.value.length > 0;
      if ( hasValue ) {
        res += ' active';
      }
    }
    if ( this.instanceOfSwitch( filter ) ) {
      const switchFilter = this.asSwitchFilter( filter );
      if ( switchFilter.value === true ) {
        res += ' active';
      }
    }
    if ( this.instanceOfDateRange( filter ) ) {
      const dateRangeFilter = this.asDateRangeFilter( filter );
      if ( dateRangeFilter.value ) {
        res += ' active';
      }
    }
    return res;
  }
}
