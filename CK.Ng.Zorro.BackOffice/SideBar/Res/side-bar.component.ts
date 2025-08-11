import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostBinding, inject, input, OnDestroy, output, OutputRefSubscription, signal, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faInfoCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NavigationItem, NavigationSection } from './navigation.model';
import { VersionInfos } from './version-infos.model';
import { SearchModalComponent } from '@local/ck-gen';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ModalOptions, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component( {
    selector: 'ck-backoffice-side-bar',
    templateUrl: './side-bar.component.html',
    imports: [CommonModule, FormsModule, FontAwesomeModule, NzDividerModule, NzModalModule, NzToolTipModule, TranslateModule]
} )
export class SideBarComponent implements OnDestroy {
    @HostBinding( 'class' ) class = 'ck-backoffice-side-bar';

    readonly #router = inject( Router );
    readonly #translateService = inject( TranslateService );
    readonly #modal = inject( NzModalService );

    logoSrc = input<string>( '' );
    navigationItems = input<Array<NavigationSection>>( [] );
    versionInfos = input<VersionInfos>();
    isCollapsed = input<boolean>( false );
    showGlobalSearchBtn = input<boolean>( false );
    defaultContentTpl = input<TemplateRef<unknown>>();
    searchResultTpl = input<TemplateRef<unknown>>();
    globalSearchPlaceholder = input<string>( '' );
    globalSearchDebounceTime = input<number>( 300 );

    collapseChanged = output<boolean>();
    logoClicked = output<void>();
    navItemClicked = output<NavigationItem>();
    searchRequested = output<string>();
    searchCleared = output<void>();

    readonly barsIcon = faBars;
    readonly infoIcon = faInfoCircle;
    readonly searchIcon = faSearch;

    #subscriptions: Array<OutputRefSubscription> = [];
    collapsed = signal<boolean>( this.isCollapsed() );

    toggleCollapse(): void {
        this.collapsed.set( !this.collapsed() );
        this.collapseChanged.emit( this.collapsed() );
    }

    clickLogo(): void {
        this.logoClicked.emit();
    }

    itemClicked( e: MouseEvent, i: NavigationItem ): void {
        if ( i.disabled ) return;
        this.navItemClicked.emit( i );
        this.#resetActiveItem();
        i.isActive = true;
        if ( i.routerLink ) {
            if ( e.ctrlKey ) {
                const url = this.#generateUrl( i.routerLink );
                window.open( url, '_blank' );
                e.preventDefault();
                e.stopPropagation();
            } else {
                this.#router.navigate( [i.routerLink] );
            }
        }
    }

    handleAuxClick( e: MouseEvent, i: NavigationItem ) {
        // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        // button 1 should be wheel button (or middle button if present)
        if ( e.button === 1 && i.routerLink ) {
            const url = this.#generateUrl( i.routerLink );
            window.open( url, '_blank' );
        }
    }

    public getNavItemClass( item: NavigationItem ): string {
        const classes = ['sidebar-item'];
        if ( this.collapsed() ) classes.push( 'collapsed' );
        if ( item.isActive ) classes.push( 'active' );
        if ( item.disabled ) classes.push( 'disabled' );
        return classes.join( ' ' );
    }

    openSearchModal(): void {
        const opts: ModalOptions<SearchModalComponent> = {
            nzClosable: false,
            nzWidth: window.innerWidth * 0.4,
            nzContent: SearchModalComponent,
            nzData: { placeholder: this.globalSearchPlaceholder(), inputDebounceTime: this.globalSearchDebounceTime(), defaultContentTpl: this.defaultContentTpl(), searchResultTpl: this.searchResultTpl() },
            nzStyle: { top: '20px' },
            nzBodyStyle: { height: `${window.innerHeight * 0.7}px`, padding: '2%' },
            nzMaskStyle: { 'background-color': 'rgb(0 0 0 / 70%)' },
            nzFooter: [
                {
                    label: this.#translateService.instant( 'Button.Close' ),
                    type: 'primary',
                    onClick: c => {
                        c!.searchString = '';
                        ref.close();
                    }
                }
            ]
        };

        const ref: NzModalRef<SearchModalComponent> = this.#modal.create( opts );
        const comp = ref.getContentComponent();
        this.#subscriptions.push( comp.searchRequested.subscribe( ( s: string ) => {
            this.searchRequested.emit( s );
            console.log( s )
        } ) );
        this.#subscriptions.push( comp.searchCleared.subscribe( () => {
            this.searchCleared.emit();
        } ) );
    }

    getSearchTooltip(): string {
        return this.#translateService.instant( 'Button.Search' );
    }

    #generateUrl( routerLink: string ): string {
        return this.#router.serializeUrl( this.#router.createUrlTree( [routerLink] ) );
    }

    #resetActiveItem(): void {
        this.navigationItems().forEach( ( n ) => {
            n.items.forEach( ( i ) => ( i.isActive = false ) );
        } );
    }

    ngOnDestroy(): void {
        this.#subscriptions.forEach( s => s.unsubscribe() );
    }
}
