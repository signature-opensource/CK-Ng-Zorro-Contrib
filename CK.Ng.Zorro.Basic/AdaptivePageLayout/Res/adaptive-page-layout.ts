import { Component, computed, input, linkedSignal, output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ActionBar, ActionBarContent, Filter, Filters, ListView, ResponsiveDirective, Table, TableAction, TableColumn } from '@local/ck-gen';

@Component( {
  selector: 'ck-adaptive-page-layout',
  imports: [
    FormsModule,
    ActionBar,
    Table,
    NzBadgeModule,
    NzButtonModule,
    NzCheckboxModule,
    NzListModule,
    NzPopoverModule,
    NzTooltipModule,
    FontAwesomeModule,
    TranslateModule,
    ResponsiveDirective,
    ListView,
    Filters
  ],
  templateUrl: './adaptive-page-layout.html',
  host: { 'class': 'ck-adaptive-page-layout' }
} )
export class AdaptivePageLayout<T> {
  title = input.required<string>();
  items = input.required<Array<T>>();
  itemUniqueKey = input.required<keyof T>();
  columns = input.required<Array<TableColumn<T>>>();
  itemTemplateRef = input.required<TemplateRef<{ $implicit: T }>>();
  pageSize = input<number>( 10 );
  actions = input<ActionBarContent<T>>();
  itemActions = input<Array<TableAction<T>>>();
  searchbarEnabled = input<boolean>( true );
  searchbarDebounceTime = input<number>( 1000 );
  searchFunc = input<( input: string ) => Array<T>>();
  filters = input<Array<Filter<unknown>>>();
  filterFunc = input<() => Array<T>>();
  pageSizeSet = output<number>();
  columnsSet = output<void>();

  readonly filterIcon = faFilter;

  displayedItems = linkedSignal( () => this.items() );
  selectedFilters: Array<string> = this.filters()?.filter( f => f.active ).map( f => f.label ) ?? [];
  filterChoices = computed( () => this.filters()?.map( f => { return { label: f.label, value: f.label } as NzCheckboxOption } ) ?? [] );

  search( input: string ): void {
    this.displayedItems.set( this.searchFunc ? this.searchFunc()!( input ) : this.items() );
  }

  clearSearch(): void {
    this.displayedItems.set( this.items() );
  }

  filterData(): void {
    this.displayedItems.set( this.filterFunc ? this.filterFunc()!() : this.items() );
  }

  activateAllFilters(): void {
    if ( this.filters() ) {
      this.filters()!.forEach( f => f.active = true );
      this.selectedFilters = this.filters()!.map( f => f.label );

      this.filterData();
    }
  }

  clearFilters(): void {
    if( this.filters() ) {
      this.filters()!.forEach( f => f.active = false );
      this.selectedFilters = [];
      this.filterData();
    }
  }

  updateFilterChecked(): void {
    const b = new Set( this.selectedFilters );
    const hidden = [...this.filters()!.filter( f => !b.has( f.label ) )];

    const filters = [...this.filters()!];
    hidden.forEach( f => {
      const filter = filters.find( filter => filter.label === f.label );
      if ( filter ) {
        filter.active = false;

        if ( this.selectedFilters.find( sf => sf === f.label ) ) {
          this.selectedFilters = [...this.selectedFilters.filter( sf => sf !== f.label )];
        }
      }
    } );

    filters.forEach( f => {
      if ( !hidden.find( h => h.label === f.label ) ) {
        f.active = true;

        if ( !this.selectedFilters.find( sf => sf === f.label ) ) {
          this.selectedFilters.push( f.label );
        }
      }
    } );

    this.filterData();
  }
}
