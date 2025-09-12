import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, input, OnDestroy, output, OutputRefSubscription, linkedSignal, TemplateRef, effect, computed, signal, WritableSignal, afterNextRender } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faInfoCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ModalOptions, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NavigationItem, NavigationSection } from '@local/ck-gen/CK/Ng/Zorro/side-bar/navigation-model';
import { SearchModalComponent } from '@local/ck-gen/CK/Ng/Zorro/search-modal/search-modal';
import { VersionInfos } from '@local/ck-gen/CK/Ng/Zorro/side-bar/version-infos-model';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component( {
    selector: 'ck-backoffice-side-bar',
    templateUrl: './side-bar.html',
    imports: [CommonModule, FormsModule, FontAwesomeModule, NzDividerModule, NzModalModule, NzMenuModule, NzTooltipModule, TranslateModule],
    host: { 'class': 'ck-backoffice-side-bar' }
} )
export class SideBarComponent implements OnDestroy {
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
    collapsed = linkedSignal<boolean>( this.isCollapsed );
    menuOpenMap: { [name: string]: boolean } = {};
    navItems = linkedSignal( () => this.navigationItems() );

    constructor() {
        effect( () => {
            const items = this.navigationItems();
            if ( !items.length ) return;
            this.#resetActiveItem();
        } );

        this.#router.events.pipe( filter( event => event instanceof NavigationEnd ), takeUntilDestroyed() ).subscribe( _ => {
            this.#resetActiveItem();
        } );
    }

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
        if ( item.isActive || item.children?.some( c => c.isActive ) ) classes.push( 'active ant-menu-item-selected' );
        if ( item.disabled ) classes.push( 'disabled' );
        return classes.join( ' ' );
    }

    public getNavItemChildClass( child: NavigationItem ): string {
        const classes = ['sidebar-item'];
        if ( this.collapsed() ) classes.push( 'collapsed' );
        if ( child.isActive ) classes.push( 'active ant-menu-item-selected' );
        if ( child.disabled ) classes.push( 'disabled' );
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
        const sections = [...this.navigationItems()];

        sections.forEach( ( n ) => {
            n.items.forEach( ( i: NavigationItem ) => {
                i.isActive = false;
                i.children?.forEach( c => c.isActive = false );
            } );
        } );

        let currentPath = this.#router.url;
        if ( currentPath.startsWith( '/' ) ) {
            currentPath = currentPath.substring( 1 );
        }
        const navItems = sections.flatMap( ns => ns.items );
        const activeItem = this.#findItemByRouterLink( navItems, currentPath );
        if ( activeItem ) {
            activeItem.isActive = true;
        }

        this.navItems.set( sections );
    }

    #findItemByRouterLink( items: Array<NavigationItem>, routerLink: string ): NavigationItem | undefined {
        for ( const item of items ) {
            if ( item.routerLink === routerLink ) {
                return item;
            }

            if ( item.children?.length ) {
                const found = this.#findItemByRouterLink( item.children, routerLink );
                if ( found ) return found;
            }
        }
        return undefined;
    }

    ngOnDestroy(): void {
        this.#subscriptions.forEach( s => s.unsubscribe() );
    }
}
