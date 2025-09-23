import { Component, input, linkedSignal, TemplateRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ActionBar, ActionBarContent, ListView, ResponsiveDirective, Table, TableAction, TableColumn } from '@local/ck-gen';

@Component( {
  selector: 'ck-adaptive-page-layout',
  imports: [
    ActionBar,
    Table,
    NzButtonModule,
    NzListModule,
    NzTooltipModule,
    FontAwesomeModule,
    TranslateModule,
    ResponsiveDirective,
    ListView
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
  actions = input<ActionBarContent<T>>();
  itemActions = input<Array<TableAction<T>>>();
  searchbarEnabled = input<boolean>( true );
  searchbarDebounceTime = input<number>( 1000 );
  searchFunc = input<( input: string ) => Array<T>>();

  displayedItems = linkedSignal( () => this.items() );

  search( input: string ): void {
    this.displayedItems.set( this.searchFunc ? this.searchFunc()!( input ) : this.items() );
  }

  clearSearch(): void {
    this.displayedItems.set( this.items() );
  }
}
