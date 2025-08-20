import { Component, computed, HostBinding, inject, input, linkedSignal, output, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActionBarComponent } from '../action-bar/action-bar.component';
import { ActionBarContent } from '../action-bar/action-bar.model';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../breadcrumb/breadcrumb-item.model';
import { Filter } from '../filters/filter.model';
import { FiltersComponent } from '../filters/filters.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component( {
    selector: 'ck-backoffice-layout-content',
    templateUrl: './layout-content.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ActionBarComponent,
        BreadcrumbComponent,
        FiltersComponent,
        NzBadgeModule,
        NzButtonModule,
        NzCheckboxModule,
        NzPopoverModule,
        NzToolTipModule,
        FontAwesomeModule,
        TranslateModule
    ]
} )
export class LayoutContentComponent<T> {
    @HostBinding( 'class' ) class = 'ck-backoffice-layout-content';

    headerTitle = input<string>( '' );
    selectedItems = input<Array<T>>( [] );
    showFilters = input<boolean>( true );
    filters = input<Array<Filter<unknown>>>( [] );
    actions = input<ActionBarContent<T>>( { left: [], right: [] } );
    breadcrumb = input<Array<BreadcrumbItem>>( [] );
    breadcrumbSeparator = input<string>( '>' );
    filterPopoverPosition = input<'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'>( 'top' )
    searchbarDebounceTime = input<number>( 2000 );
    contentSearchBarEnabled = input<boolean>( true );

    breadcrumbItemClicked = output<BreadcrumbItem>();
    contentSearchCleared = output<void>();
    contentSearchRequested = output<string>();
    filtersApplied = output<Array<Filter<unknown>>>();
    filtersCleared = output<void>();

    currentFilters: Array<Filter<unknown>> = [];
    filterChoices = computed( () => this.filters().map( f => { return { label: f.label, value: f.label } as NzCheckboxOption } ) );
    selectedFilters: WritableSignal<Array<string>> = linkedSignal( () => this.filters().filter( f => f.active ).map( f => f.label ) );

    readonly filterIcon = faFilter;

    onFilterApplied( f: Array<Filter<unknown>> ): void {
        this.currentFilters = [...f];
        this.filtersApplied.emit( f );
    }

    itemClicked( i: BreadcrumbItem ): void {
        this.breadcrumbItemClicked.emit( i );
    }

    onSearchCleared(): void {
        this.contentSearchCleared.emit();
    }

    onSearchRequested( searchString: string ): void {
        this.contentSearchRequested.emit( searchString );
    }

    onFiltersCleared(): void {
        this.filtersCleared.emit();
    }

    updateFilterChecked( selected: Array<string> ): void {
        this.selectedFilters.set( selected );
        const b = new Set( this.selectedFilters() );
        const hidden = this.filters().filter( f => !b.has( f.label ) );
        hidden.forEach( f => {
            const filter = this.filters().find( filter => filter.label === f.label );
            if ( filter ) {
                filter.active = false;
            }
        } );

        this.filters().forEach( f => {
            if ( !hidden.find( h => h.label === f.label ) ) {
                f.active = true;

                if ( !this.selectedFilters().find( sf => sf === f.label ) ) {
                    this.selectedFilters().push( f.label );
                }
            }
        } );

        this.onFilterApplied( this.filters() );
    }

    toggleAllFilters(): void {
        if ( this.selectedFilters.length > 0 ) {
            this.clearFilters();
        } else {
            this.activateAllFilters();
        }
    }

    clearFilters(): void {
        this.filters().forEach( f => f.active = false );
        this.selectedFilters.set( [] );

        this.onFilterApplied( this.filters() );
    }

    activateAllFilters(): void {
        this.filters().forEach( f => f.active = true );
        this.selectedFilters.set( this.filters().map( f => f.label ) );

        this.onFilterApplied( this.filters() );
    }
}
