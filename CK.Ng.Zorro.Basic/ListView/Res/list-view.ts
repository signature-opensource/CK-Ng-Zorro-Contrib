import { NgTemplateOutlet } from '@angular/common';
import { Component, input, linkedSignal, output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TableAction } from '@local/ck-gen';

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
  items = input.required<Array<T>>();
  itemUniqueKey = input.required<keyof T>();
  itemActions = input<Array<TableAction<T>>>();
  itemTemplateRef = input.required<TemplateRef<{ $implicit: T }>>();
  searchbarEnabled = input<boolean>( true );
  searchbarDebounceTime = input<number>( 1000 );
  dblClickFunc = input<( item: T ) => Array<T>>();

  searchRequested = output<string>();
  searchCleared = output<void>();

  searchIcon = faSearch;
  closeIcon = faClose;

  #searchDecouncer$: Subject<string> = new Subject();
  protected displayedItems = linkedSignal( () => this.items() );
  protected searchString = '';
  protected debouncing = false;

  constructor() {
    this.setupSearchInputChange();
  }

  doubleClick( item: T ): void {
    if( this.dblClickFunc() ) {
      this.dblClickFunc()!( item );
    }
  }

  onSearchInputChange( term: string ): void {
    this.debouncing = true;
    this.#searchDecouncer$.next( term );
  }

  setupSearchInputChange(): void {
    this.#searchDecouncer$.pipe( debounceTime( this.searchbarDebounceTime() ), distinctUntilChanged() ).subscribe( ( term: string ) => {
      if ( this.debouncing ) {
        this.debouncing = false;
        this.requestSearch( term );
      }
    } );
  }

  requestSearch( s: string ): void {
    if ( s.length > 0 ) {
      this.searchString = s;
      this.searchRequested.emit( s );
    } else {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchString = '';
    this.searchCleared.emit();
    this.displayedItems.set( this.items() );
  }
}
