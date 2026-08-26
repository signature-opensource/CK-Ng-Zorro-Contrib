import { Component, DestroyRef, WritableSignal, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faQuestion, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { faClose, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { createSearchDebouncer, SearchDebouncer } from './search-debouncer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TableColumn } from './table-column-model';
import { TableAction } from './table-action-model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component( {
  selector: 'ck-table',
  templateUrl: './table.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzPopoverModule,
    NzTableModule,
    NzTooltipModule,
    TranslateModule
  ],
  host: { 'class': 'ck-table' }
} )
export class Table<T> {
  readonly #translateService = inject( TranslateService );
  readonly #destroyRef = inject( DestroyRef );

  columns = input.required<Array<TableColumn<T>>>();
  tableData = input.required<Array<T>>();
  dataUniqueKey = input.required<keyof T>();
  defaultPageSize = input<number>( 10 );
  defaultPageIndex = input<number>( 1 );
  defaultSearchString = input<string>( '' );
  selectableRows = input<boolean>( true );
  showPageSizeOptions = input<boolean>( true );
  pageSizeOptions = input<Array<number>>( [10, 20, 30, 40, 50] );
  totalCount = input<number>( 0 );
  totalCountLabel = input<string>();
  tableActions = input<Array<TableAction<T>>>( [] );
  searchButtonTitle = input<string>( '' );
  cancelButtonTitle = input<string>( '' );
  actionColumnHeader = input<string>( '' );
  frontPagination = input<boolean>( true );
  searchbarEnabled = input<boolean>( true );
  searchbarDebounceTime = input<number>( 1000 );
  columnsPopoverPosition = input<'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'>( 'left' );

  selectionChanged = output<Array<T>>();
  dblClicked = output<T>();
  pageSizeChanged = output<number>();
  pageIndexChanged = output<number>();
  searchCleared = output<void>();
  searchRequested = output<string>();
  columnsChanged = output<void>();
  sortChanged = output<{ field: string; direction: 'ascend' | 'descend' | null }>();

  readonly closeIcon = faClose;
  readonly searchIcon = faMagnifyingGlass;
  readonly tableIcon = faTableColumns;

  #searchDebouncer!: SearchDebouncer;
  #selectedItems = signal<Array<T>>( [] );
  // The rows nz-table actually renders: the page slice when front pagination is on, the whole
  // filtered set otherwise. Selection is scoped to them so a bulk action can never carry a row
  // the user cannot see.
  #currentPageData = signal<Array<T>>( [] );
  public displayedColumns = linkedSignal( () => this.columns().filter( c => !c.hidden ) );
  public pageSize = linkedSignal( () => this.defaultPageSize() );
  public pageIndex = linkedSignal( () => this.defaultPageIndex() );
  public searchString = linkedSignal( () => this.defaultSearchString() );
  public columnChoices = computed( () => this.columns().map( f => { return { label: f.displayedName, value: f.name } as NzCheckboxOption } ) );
  public columnsConfig: WritableSignal<Array<keyof T>> = linkedSignal( () => this.displayedColumns().map( c => c.name ) );
  public searchLabel: WritableSignal<string> = linkedSignal( () => this.searchButtonTitle() );
  public cancelLabel: WritableSignal<string> = linkedSignal( () => this.cancelButtonTitle() );
  public actionsHeaderLabel: WritableSignal<string> = linkedSignal( () => this.actionColumnHeader() );

  constructor() {
    this.#searchDebouncer = createSearchDebouncer(
      this.searchbarDebounceTime(),
      this.#destroyRef,
      ( term: string ) => {
        this.searchString.set( term );
        this.requestSearch( term );
      }
    );

    this.#translateService.get( ['Button.Search', 'Button.Cancel', 'CK.Table.Column.Actions'] ).pipe( first() ).subscribe( t => {
      if ( this.searchButtonTitle().length === 0 ) {
        this.searchLabel.set( t['Button.Search'] );
      }
      if ( this.cancelButtonTitle().length === 0 ) {
        this.cancelLabel.set( t['Button.Cancel'] );
      }
      if ( this.actionColumnHeader().length === 0 ) {
        this.actionsHeaderLabel.set( t['CK.Table.Column.Actions'] );
      }
    } );
  }

  isSelected( data: T ): boolean {
    return this.#selectedItems().includes( data );
  }

  itemChecked( data: T, checked: boolean ): void {
    const currentSelection = this.#selectedItems();
    const alreadySelected = currentSelection.includes( data );
    if ( checked && !alreadySelected ) {
      this.#selectedItems.set( [...currentSelection, data] );
    } else if ( !checked && alreadySelected ) {
      this.#selectedItems.set( currentSelection.filter( item => item !== data ) );
    }

    this.triggerSelectionChanged();
  }

  isEveryItemChecked(): boolean {
    const page = this.#currentPageData();
    return page.length > 0 && this.#selectedItems().length === page.length;
  }

  selectAll(): void {
    if ( !this.isEveryItemChecked() ) {
      this.#selectedItems.set( [...this.#currentPageData()] );
    } else {
      this.#selectedItems.set( [] );
    }

    this.triggerSelectionChanged();
  }

  hasSelectedItems(): boolean {
    return this.#selectedItems().length > 0 && this.#selectedItems().length < this.#currentPageData().length;
  }

  onCurrentPageDataChange( data: ReadonlyArray<T> ): void {
    this.#currentPageData.set( [...data] );
    // Selection is reference-based: rows that left the view no longer match any checkbox and
    // could not be unchecked.
    if ( this.#selectedItems().length > 0 ) {
      this.clearSelection();
    }
  }

  getColumnStyle( colName: keyof T, data: T ) {
    const column = this.columns().find( ( c ) => c.name === colName );
    if ( column && typeof column.style === 'function' ) {
      return column.style( data );
    } else if ( column && typeof column.style === 'object' ) {
      return column.style;
    }

    return '';
  }

  shouldDisplayValue( col: TableColumn<T> ): boolean {
    return col!.showInMobile;
  }

  triggerSelectionChanged(): void {
    this.selectionChanged.emit( this.#selectedItems() );
  }

  selectRow( data: T ): void {
    this.itemChecked( data, !this.isSelected( data ) );
  }

  clearSelection(): void {
    this.#selectedItems.set( [] );
    this.triggerSelectionChanged();
  }

  rowDblClicked( data: T ): void {
    this.dblClicked.emit( data );
  }

  reset( column: TableColumn<T> ): void {
    const col = this.columns().filter( ( c ) => c.name === column.name )[0];
    col.filter!.visible = false;
    col.filter!.searchValue = '';
    col.filter!.reset();
    this.columns().forEach( ( c ) => {
      if ( c.filter && c.filter.searchValue.length > 0 ) {
        c.filter.search( c.filter.searchValue );
      }
    } );
  }

  search( column: TableColumn<T> ): void {
    const col = this.columns().filter( ( c ) => c.name === column.name )[0];
    col.filter!.visible = false;
    col.filter!.search( col.filter!.searchValue );
  }

  shouldBeDisplayed( colName: string ): boolean {
    const column = this.columns().find( ( c ) => c.name === colName );
    if ( !column ) return false;
    return !column.hidden;
  }

  hasIconValue( colName: string ): boolean {
    const column = this.columns().find( ( c ) => c.name === colName );
    if ( !column ) return false;
    return column!.defineIcon !== undefined;
  }

  getIconValue( colName: string, value: T ): IconDefinition {
    const column = this.columns().find( ( c ) => c.name === colName );
    if ( column && column.defineIcon ) {
      // return column!.defineIcon!( value );
    }

    return faQuestion;
  }

  onSortOrderChange( col: TableColumn<T>, direction: string | null ): void {
    this.sortChanged.emit( { field: col.name as string, direction: direction as 'ascend' | 'descend' | null } );
  }

  sizeChanged( size: number ): void {
    this.pageSize.set( size );
    this.pageSizeChanged.emit( size );
  }

  indexChanged( index: number ): void {
    this.pageIndex.set( index );
    this.pageIndexChanged.emit( index );
  }

  trackByFn( data: T ) {
    return data[this.dataUniqueKey()];
  }

  requestSearch( s: string ): void {
    if ( s.length > 0 ) {
      this.searchString.set( s );
      this.searchRequested.emit( s );
    } else {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchString.set( '' );
    this.#searchDebouncer.debouncing = false;
    this.searchCleared.emit();
  }

  onSearchInputChange( term: string ): void {
    this.#searchDebouncer.onInputChange( term );
  }

  get debouncing(): boolean {
    return this.#searchDebouncer.debouncing;
  }

  updateColumnsChecked( selected: Array<keyof T> ): void {
    this.columnsConfig.set( selected );

    this.displayedColumns().forEach( dc => {
      if ( !selected.includes( dc.name ) ) {
        const col = this.columns().find( c => c.name === dc.name );
        if ( col ) {
          col.hidden = true;
          this.displayedColumns.set( this.displayedColumns().filter( dc => dc !== col ) );
        }
      }
    } );

    const newlySelected = selected.filter( s => !this.displayedColumns().map( dc => dc.name ).includes( s ) );
    newlySelected.forEach( ns => {
      const col = this.columns().find( c => c.name === ns );
      if ( col ) {
        col.hidden = false;
        this.displayedColumns().push( col );
      }
    } );

    this.columnsChanged.emit();
  }

  activateAllColumns(): void {
    this.displayedColumns.set( this.columns() );
    this.columns().forEach( c => c.hidden = false );
    this.columnsConfig.set( this.columns().map( c => c.name ) );
  }

  clearColumns(): void {
    this.displayedColumns.set( [] );
    this.columnsConfig.set( [] );
    this.columns().forEach( c => c.hidden = true );
  }

  isDisabled( action: TableAction<T>, data: T ): boolean {
    return action.shouldBeDisabled ? action.shouldBeDisabled( data ) : false;
  }

  execAction( event: Event, action: TableAction<T>, data: T ): void {
    action.execute( data );
    event.preventDefault();
    event.stopPropagation();
  }
}
