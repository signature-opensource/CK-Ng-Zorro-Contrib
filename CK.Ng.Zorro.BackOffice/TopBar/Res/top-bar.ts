import { Component, inject, input, linkedSignal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { WCSType } from './wcs-type-model';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { locales } from '@local/ck-gen/ts-locales/locales';

@Component( {
    selector: 'ck-backoffice-top-bar',
    templateUrl: './top-bar.html',

    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NzDropDownModule,
        NzSelectModule,
    ],
    host: { 'class': 'ck-backoffice-top-bar' }
} )
export class TopBar {
    readonly #translateService = inject( TranslateService );

    selectedWCS = input<string | WCSType>();
    allWCS = input<Array<string> | Array<WCSType>>();
    selectedLanguage = input<string>( 'fr' );
    userName = input<string>( '' );
    displayNotifIcon = input<boolean>( false );
    displayWCSDropdown = input<boolean>( false );
    displayThemeToggle = input<boolean>( false );

    appIconClicked = output<void>();
    wcsSelected = output<string | WCSType>();
    profileClicked = output<void>();
    disconnectClicked = output<void>();
    notificationClicked = output<void>();
    themeToggled = output<void>();

    readonly bellIcon = faBell;
    readonly downIcon = faCaretDown;
    readonly down = faChevronDown;

    public currentWCS = linkedSignal( () => this.selectedWCS() );
    public themeBtnLabel = '';
    public activeCultures = locales;

    constructor() {
        this.#translateService.stream( 'CK.TopBar.Button.ThemeToggle' )
            .pipe( takeUntilDestroyed() )
            .subscribe( t => this.themeBtnLabel = t );
    }

    toggleAppIcon(): void {
        this.appIconClicked.emit();
    }

    selectWCS( wcs: WCSType | string ): void {
        this.currentWCS.set( wcs );
        this.wcsSelected.emit( wcs );
    }

    openNotifications(): void {
        this.notificationClicked.emit();
    }

    isWCSType( wcs: string | WCSType ): wcs is WCSType {
        return typeof wcs !== 'string' && ( wcs as WCSType ).wcsId !== undefined;
    }

    isWCSTypeArray( arr: Array<string> | Array<WCSType> ): arr is Array<WCSType> {
        return arr.length > 0 && this.isWCSType( arr[0] );
    }

    asWCSType( wcs: string | WCSType ): WCSType {
        return wcs as WCSType;
    }

    asWCSArray( arr: Array<string> | Array<WCSType> ): Array<WCSType> {
        return arr as Array<WCSType>;
    }

    asStringArray(): Array<string> {
        return this.allWCS() as Array<string>;
    }

    getChildren( arr: WCSType ): Array<WCSType> {
        return arr.children!;
    }

    toggleTheme(): void {
        this.themeToggled.emit();
    }
}
