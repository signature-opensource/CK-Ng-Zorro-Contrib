import { Component, computed, input, linkedSignal, output, signal, viewChild, TemplateRef, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ActionBar, ActionBarContent, Filter, Filters, LayoutRadioChoice, ListView, ResponsiveDirective, Table, TableAction, TableColumn } from '@local/ck-gen';

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
    NzRadioModule,
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
  pageIndex = input<number>( 1 );
  searchString = input<string>( '' );
  actions = input<ActionBarContent<T>>();
  itemActions = input<Array<TableAction<T>>>();
  searchbarEnabled = input<boolean>( true );
  searchbarDebounceTime = input<number>( 1000 );
  searchFunc = input<( input: string ) => Array<T>>();
  filters = input<Array<Filter<unknown>>>();
  filterFunc = input<() => Array<T>>();
  radioChoices = input<Array<LayoutRadioChoice>>();
  radioValue = input<LayoutRadioChoice>();
  dblClickFunc = input<( item: T ) => void>();
  inputRadioFilter = input<string>();
  radioFilterOptions = input<Array<NzCheckboxOption>>();
  filterByRadioFunc = input<( value: string ) => Array<T> | Promise<Array<T>>>();
  frontPagination = input<boolean>( true );
  totalCount = input<number>( 0 );
  radioFilterChanged = output<string>();
  radioValueChanged = output<LayoutRadioChoice>();
  pageSizeSet = output<number>();
  pageIndexChanged = output<number>();
  searchStringChanged = output<string>();
  searchCleared = output<void>();
  columnsSet = output<void>();
  tableSelectionChanged = output<Array<T>>();
  sortChanged = output<{ field: string; direction: 'ascend' | 'descend' | null }>();
  filtersChanged = output<void>();

  table = viewChild<Table<T>>( 'table' );

  readonly filterIcon = faFilter;

  displayedItems = linkedSignal( () => this.items() );
  selectedFilters = linkedSignal( () => this.filters()?.filter( f => f.active ).map( f => f.label ) ?? [] );
  filterChoices = computed( () => this.filters()?.map( f => { return { label: f.label, value: f.label } as NzCheckboxOption } ) ?? [] );
  radioFilterValue = linkedSignal( () => this.inputRadioFilter() ?? '' );
  selectedItems: WritableSignal<Array<T>> = signal( [] );

  doubleClick( item: T ): void {
    if( this.dblClickFunc() ) {
      this.dblClickFunc()!( item );
    }
  }

  search( input: string ): void {
    if ( this.frontPagination() ) {
      this.displayedItems.set( this.searchFunc ? this.searchFunc()!( input ) : this.items() );
    }
    this.searchStringChanged.emit( input );
  }

  clearSearch(): void {
    if ( this.frontPagination() ) {
      this.displayedItems.set( this.items() );
    }
    this.searchCleared.emit();
  }

  onPageIndexChanged( index: number ): void {
    this.pageIndexChanged.emit( index );
  }

  filterData(): void {
    if ( this.frontPagination() ) {
      this.displayedItems.set( this.filterFunc ? this.filterFunc()!() : this.items() );
    }
    this.filtersChanged.emit();
  }

  activateAllFilters(): void {
    if ( this.filters() ) {
      this.filters()!.forEach( f => f.active = true );
      this.selectedFilters.set( this.filters()!.map( f => f.label ) );

      this.filterData();
    }
  }

  clearFilters(): void {
    if( this.filters() ) {
      this.filters()!.forEach( f => f.active = false );
      this.selectedFilters.set( [] );
      this.filterData();
    }
  }

  updateFilterChecked(): void {
    const b = new Set( this.selectedFilters() );
    const hidden = [...this.filters()!.filter( f => !b.has( f.label ) )];

    const filters = [...this.filters()!];
    hidden.forEach( f => {
      const filter = filters.find( filter => filter.label === f.label );
      if ( filter ) {
        filter.active = false;

        if ( this.selectedFilters().find( sf => sf === f.label ) ) {
          this.selectedFilters.set( [...this.selectedFilters().filter( sf => sf !== f.label )] );
        }
      }
    } );

    filters.forEach( f => {
      if ( !hidden.find( h => h.label === f.label ) ) {
        f.active = true;

        if ( !this.selectedFilters().find( sf => sf === f.label ) ) {
          this.selectedFilters.set( [...this.selectedFilters(), f.label] );
        }
      }
    } );

    this.filterData();
  }

  updateRadioFilterValue( value: string ): void {
    this.radioFilterValue.set( value );
    this.radioFilterChanged.emit( value );
    if ( this.frontPagination() ) {
      if ( this.filterByRadioFunc ) {
        const result = this.filterByRadioFunc()!( value );
        if ( result instanceof Promise ) {
          result.then( items => this.displayedItems.set( items ) );
        } else {
          this.displayedItems.set( result );
        }
      } else {
        this.displayedItems.set( this.items() );
      }
    }
  }

  updateSelectedItems( items: Array<T> ): void {
    this.selectedItems.set( [...items] );
    this.tableSelectionChanged.emit( items );
  }

  clearSelection(): void {
    this.table()?.clearSelection();
  }
}
