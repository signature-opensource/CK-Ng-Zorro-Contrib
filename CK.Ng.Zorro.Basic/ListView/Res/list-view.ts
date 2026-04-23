import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject, input, linkedSignal, output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { createSearchDebouncer, SearchDebouncer, TableAction } from '@local/ck-gen';

@Component( {
  selector: 'ck-list-view',
  imports: [
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzListModule,
    NzTooltipModule,
    NgTemplateOutlet,
    FontAwesomeModule
  ],
  templateUrl: './list-view.html',
  host: { 'class': 'ck-list-view' }
} )
export class ListView<T> {
  readonly #destroyRef = inject( DestroyRef );

  items = input.required<Array<T>>();
  itemUniqueKey = input.required<keyof T>();
  itemActions = input<Array<TableAction<T>>>();
  itemTemplateRef = input.required<TemplateRef<{ $implicit: T }>>();
  searchbarEnabled = input<boolean>( true );
  searchbarDebounceTime = input<number>( 1000 );
  defaultSearchString = input<string>( '' );
  dblClickFunc = input<( item: T ) => void>();

  searchRequested = output<string>();
  searchCleared = output<void>();
  dblClicked = output<T>();

  searchIcon = faSearch;
  closeIcon = faClose;

  #searchDebouncer: SearchDebouncer;
  protected displayedItems = linkedSignal( () => this.items() );
  protected searchString = linkedSignal( () => this.defaultSearchString() );

  constructor() {
    this.#searchDebouncer = createSearchDebouncer(
      this.searchbarDebounceTime(),
      this.#destroyRef,
      ( term: string ) => this.requestSearch( term )
    );
  }

  doubleClick( item: T ): void {
    this.dblClicked.emit( item );
  }

  onSearchInputChange( term: string ): void {
    this.#searchDebouncer.onInputChange( term );
  }

  get debouncing(): boolean {
    return this.#searchDebouncer.debouncing;
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
    this.searchCleared.emit();
    this.displayedItems.set( this.items() );
  }
}
