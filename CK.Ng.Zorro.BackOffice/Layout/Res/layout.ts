import { Component, HostBinding, input, output, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    MobileBar,
    NavigationItem,
    NavigationSection,
    ResponsiveDirective,
    SideBar,
    VersionInfos,
    TopBar,
    WCSType
} from '@local/ck-gen';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component( {
    selector: 'ck-backoffice-layout',
    templateUrl: './layout.html',
    imports: [
        CommonModule,
        FormsModule,
        MobileBar,
        ResponsiveDirective,
        SideBar,
        TopBar,
        NzLayoutModule
    ],
    host: { 'class': 'ck-backoffice-layout' }
} )
export class Layout {
    topbarComponent = viewChild<TopBar>( 'topbar' );

    logoSrc = input<string>( 'logos/signature-one-logo.png' );
    navigationItems = input<Array<NavigationSection>>( [] );
    displayWCSDropdown = input<boolean>( false );
    selectedWCS = input<string | WCSType>();
    allWCS = input<Array<string> | Array<WCSType>>();
    selectedLanguage = input<string>( 'fr' );
    userName = input<string>( '' );
    versionInfos = input<VersionInfos>();
    displaySearchBar = input<boolean>( false );
    displayLanguageChoices = input<boolean>( false );
    displayNotifIcon = input<boolean>( false );
    displayThemeToggle = input<boolean>( false );
    showGlobalSearchBtn = input<boolean>( false );
    defaultContentTpl = input<TemplateRef<unknown>>();
    searchResultTpl = input<TemplateRef<unknown>>();
    globalSearchPlaceholder = input<string>( '' );
    globalSearchDebounceTime = input<number>( 300 );

    appIconClicked = output<void>();
    wcsSelected = output<string | WCSType>();
    languageChanged = output<string>();
    profileClicked = output<void>();
    disconnectClicked = output<void>();
    searchRequested = output<string>();
    notificationClicked = output<void>();
    logoClicked = output<void>();
    navItemClicked = output<NavigationItem>();
    searchCleared = output<void>();
    navbarCollapsedChanged = output<boolean>();
    themeToggled = output<void>();
    globalSearchRequested = output<string>();
    globalSearchCleared = output<void>();

    public collapsed: boolean = false;

    toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        this.navbarCollapsedChanged.emit( this.collapsed );
    }

    toggleAppIcon(): void {
        this.appIconClicked.emit();
    }

    goToProfile(): void {
        this.profileClicked.emit();
    }

    disconnect(): void {
        this.disconnectClicked.emit();
    }

    selectLanguage( lang: string ): void {
        this.languageChanged.emit( lang );
    }

    selectWCS( wcs: string | WCSType ): void {
        this.wcsSelected.emit( wcs );
    }

    requestSearch( searchString: string ): void {
        this.searchRequested.emit( searchString );
    }

    openNotifications(): void {
        this.notificationClicked.emit();
    }

    clickLogo(): void {
        this.logoClicked.emit();
    }

    itemClicked( i: NavigationItem ): void {
        this.navItemClicked.emit( i );
    }

    clearSearch(): void {
        this.searchCleared.emit();
    }

    toggleTheme(): void {
        this.themeToggled.emit();
    }

    requestGlobalSearch( s: string ): void {
        this.globalSearchRequested.emit( s );
    }

    clearGlobalSearch(): void {
        this.globalSearchCleared.emit();
    }
}
