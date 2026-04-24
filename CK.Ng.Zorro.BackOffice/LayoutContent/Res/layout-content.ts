import { Component, computed, inject, input, linkedSignal, output, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

import {
    ActionBar,
    ActionBarContent,
    Breadcrumb,
    BreadcrumbItem,
    Filter,
    Filters
} from '@local/ck-gen';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component( {
    selector: 'ck-backoffice-layout-content',
    templateUrl: './layout-content.html',
    imports: [
        CommonModule,
        FormsModule,
        ActionBar,
        Breadcrumb,
        Filters,
        NzBadgeModule,
        NzButtonModule,
        NzCheckboxModule,
        NzDrawerModule,
        NzPopoverModule,
        NzToolTipModule,
        FontAwesomeModule,
        TranslateModule
    ],
    host: { 'class': 'ck-backoffice-layout-content' }
} )
export class LayoutContent<T> {
    headerTitle = input<string>( '' );
    selectedItems = input<Array<T>>( [] );
    showFilters = input<boolean>( true );
    filters = input<Array<Filter<unknown>>>( [] );
    actions = input<ActionBarContent<T>>( { left: [], right: [] } );
    breadcrumb = input<Array<BreadcrumbItem>>( [] );
    breadcrumbSeparator = input<string>( '>' );
    filterPopoverPosition = input<'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'>( 'top' )
    breadcrumbItemClicked = output<BreadcrumbItem>();
    filtersApplied = output<Array<Filter<unknown>>>();
    filtersCleared = output<void>();

    filterChoices = computed( () => this.filters().map( f => { return { label: f.label, value: f.label } as NzCheckboxOption } ) );
    selectedFilters: WritableSignal<Array<string>> = linkedSignal( () => this.filters().filter( f => f.active ).map( f => f.label ) );

    readonly filterIcon = faFilter;

    readonly #breakpointObserver = inject( BreakpointObserver );

    isMobile = toSignal(
        this.#breakpointObserver.observe( '(max-width: 991px)' ).pipe(
            map( result => result.matches )
        ),
        { initialValue: false }
    );

    popoverTrigger = computed( (): 'click' | null => this.isMobile() ? null : 'click' );

    drawerVisible = signal( false );

    onFilterButtonClick(): void {
        if ( this.isMobile() ) {
            this.drawerVisible.set( true );
        }
    }

    closeFilterDrawer(): void {
        this.drawerVisible.set( false );
    }

    onFilterApplied( f: Array<Filter<unknown>> ): void {
        this.filtersApplied.emit( f );
    }

    itemClicked( i: BreadcrumbItem ): void {
        this.breadcrumbItemClicked.emit( i );
    }

    onFiltersCleared(): void {
        this.filtersCleared.emit();
    }

    updateFilterChecked( selected: Array<string> ): void {
        this.selectedFilters.set( selected );
        const selectedSet = new Set( selected );
        this.filters().forEach( f => f.active = selectedSet.has( f.label ) );
        this.onFilterApplied( this.filters() );
    }

    toggleAllFilters(): void {
        if ( this.selectedFilters().length > 0 ) {
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
