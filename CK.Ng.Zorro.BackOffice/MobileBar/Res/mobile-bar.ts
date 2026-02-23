import { Component, computed, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCheck, faMagnifyingGlass, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavigationItem, NavigationSection, WCSType } from '@local/ck-gen';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component( {
    selector: 'ck-backoffice-mobile-bar',
    templateUrl: './mobile-bar.html',
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NzInputModule,
        NzSelectModule,
    ],
    host: { 'class': 'ck-backoffice-mobile-bar' }
} )
export class MobileBar {
    readonly #router = inject( Router );

    navigationItems = input<Array<NavigationSection>>( [] );
    selectedWCS = input<string | WCSType>();
    allWCS = input<Array<string> | Array<WCSType>>();
    displayNotifIcon = input<boolean>( false );
    searchPlaceholder = input<string>( '' );

    searchRequested = output<string>();
    wcsSelected = output<string | WCSType>();
    profileClicked = output<void>();
    notificationClicked = output<void>();

    readonly barsIcon = faBars;
    readonly searchIcon = faMagnifyingGlass;
    readonly bellIcon = faBell;
    readonly closeIcon = faXmark;
    readonly checkIcon = faCheck;
    readonly userIcon = faUser;

    searching = signal( false );
    searchString = signal( '' );
    isMenuOpen = signal( false );
    currentWCS = linkedSignal( () => this.selectedWCS() );
    navItems = linkedSignal( () => this.navigationItems() );

    containerClass = computed( () => {
        if ( this.searching() ) return 'ck-backoffice-mobile-bar-container searching';
        if ( this.isMenuOpen() ) return 'ck-backoffice-mobile-bar-container menu-open';
        return 'ck-backoffice-mobile-bar-container';
    } );

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

    requestSearch(): void {
        if ( this.searchString().length > 0 ) {
            this.searchRequested.emit( this.searchString() );
        }
    }

    cancelSearch(): void {
        this.searchString.set( '' );
        this.searching.set( false );
    }

    selectWCS( wcs: string | WCSType ): void {
        this.currentWCS.set( wcs );
        this.wcsSelected.emit( wcs );
    }

    goToProfile(): void {
        this.profileClicked.emit();
    }

    openNotifications(): void {
        this.notificationClicked.emit();
    }

    navigateItem( item: NavigationItem ): void {
        if ( item.routerLink ) {
            this.#router.navigate( [item.routerLink] );
        }
        this.isMenuOpen.set( false );
    }

    isWCSType( wcs: string | WCSType ): wcs is WCSType {
        return typeof wcs !== 'string' && ( wcs as WCSType ).wcsId !== undefined;
    }

    isWCSTypeArray( arr: Array<string> | Array<WCSType> ): arr is Array<WCSType> {
        return arr.length > 0 && this.isWCSType( arr[0] );
    }

    asWCSArray(): Array<WCSType> {
        return this.allWCS() as Array<WCSType>;
    }

    asStringArray(): Array<string> {
        return this.allWCS() as Array<string>;
    }

    #resetActiveItem(): void {
        let currentPath = this.#router.url;
        if ( currentPath.startsWith( '/' ) ) {
            currentPath = currentPath.substring( 1 );
        }
        const qIdx = currentPath.indexOf( '?' );
        if ( qIdx !== -1 ) currentPath = currentPath.substring( 0, qIdx );
        const hIdx = currentPath.indexOf( '#' );
        if ( hIdx !== -1 ) currentPath = currentPath.substring( 0, hIdx );

        const sections = this.navigationItems().map( s => ( {
            ...s,
            items: s.items.map( ( i: NavigationItem ) => ( {
                ...i,
                isActive: false,
                children: i.children?.map( c => ( { ...c, isActive: false } ) )
            } ) )
        } ) );

        const navItems = sections.flatMap( ns => ns.items );
        const activeItem = this.#findItemByRouterLink( navItems, currentPath );
        if ( activeItem ) {
            activeItem.isActive = true;
        }

        this.navItems.set( sections );
    }

    #findItemByRouterLink( items: Array<NavigationItem>, routerLink: string ): NavigationItem | undefined {
        let best: NavigationItem | undefined;
        for ( const item of items ) {
            if ( item.routerLink && ( item.routerLink === routerLink || routerLink.startsWith( item.routerLink + '/' ) ) ) {
                if ( !best || item.routerLink.length > best.routerLink!.length ) {
                    best = item;
                }
            }
            if ( item.children?.length ) {
                const found = this.#findItemByRouterLink( item.children, routerLink );
                if ( found && ( !best || found.routerLink!.length > best.routerLink!.length ) ) {
                    best = found;
                }
            }
        }
        return best;
    }
}
