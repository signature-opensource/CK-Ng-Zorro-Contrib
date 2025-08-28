import { Component, HostBinding, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCheck, faMagnifyingGlass, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavigationSection, WCSType } from '@local/ck-gen';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RouterLink } from '@angular/router';

@Component( {
    selector: 'ck-backoffice-mobile-bar',
    templateUrl: './mobile-bar.html',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        NzInputModule,
        NzSelectModule,
        RouterLink
    ],
    host: { 'class': 'ck-backoffice-mobile-bar' }
} )
export class MobileBarComponent {
    navigationItems = input<Array<NavigationSection>>( [] );
    selectedWCS = input<string | WCSType>();
    allWCS = input<Array<string> | Array<WCSType>>();
    displayNotifIcon = input<boolean>( false );
    searchPlaceholder = input<string>( 'N° de mission, emplacement, conteneur...' );

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

    public searching: boolean;
    public searchString: string;
    public isMenuOpen: boolean;
    public currentWCS?: string | WCSType = this.selectedWCS();

    constructor () {
        this.searching = false;
        this.searchString = '';
        this.isMenuOpen = false;
    }

    requestSearch(): void {
        if ( this.searchString.length > 0 ) {
            this.searchRequested.emit( this.searchString );
        }
    }

    cancelSearch(): void {
        this.searchString = '';
        this.searching = false;
    }

    getContainerClass(): string {
        if ( this.searching ) {
            return `ck-backoffice-mobile-bar-container searching`;
        }
        if ( this.isMenuOpen ) {
            return `ck-backoffice-mobile-bar-container menu-open`;
        }

        return `ck-backoffice-mobile-bar-container`;
    }

    selectWCS( wcs: string | WCSType ): void {
        this.currentWCS = wcs;
        this.wcsSelected.emit( this.currentWCS );
    }

    goToProfile(): void {
        this.profileClicked.emit();
    }

    openNotifications(): void {
        this.notificationClicked.emit();
    }

    isWCSTypeArray(): boolean {
        if ( this.allWCS() && this.allWCS()!.length > 0 ) {
            if ( ( this.allWCS() as Array<any> ).length > 0 && ( this.allWCS()![0] as WCSType ).wcsId !== undefined ) {
                return true;
            }
        }
        return false;
    }

    asWCSType( wcs: string | WCSType ): WCSType {
        return wcs as WCSType;
    }

    asWCSArray(): Array<WCSType> {
        return this.allWCS() as Array<WCSType>;
    }

    asStringArray(): Array<string> {
        return this.allWCS() as Array<string>;
    }
}
