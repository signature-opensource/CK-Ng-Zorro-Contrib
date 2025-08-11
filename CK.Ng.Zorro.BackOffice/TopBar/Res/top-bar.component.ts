import { Component, HostBinding, inject, input, linkedSignal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown, faChevronDown, faClose, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { WCSType } from './wcs-type.model';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs';
import { locales } from '@local/ck-gen/ts-locales/locales';

@Component( {
    selector: 'ck-backoffice-top-bar',
    templateUrl: './top-bar.component.html',

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        NzDropDownModule,
        NzSelectModule,
    ]
} )
export class TopBarComponent {
    @HostBinding( 'class' ) class = 'ck-backoffice-top-bar';

    readonly #translateService = inject( TranslateService );

    selectedWCS = input<string | WCSType>();
    allWCS = input<Array<string> | Array<WCSType>>();
    selectedLanguage = input<string>( 'fr' );
    userName = input<string>( '' );
    displayLanguageChoices = input<boolean>( false );
    displayNotifIcon = input<boolean>( false );
    searchPlaceholder = input<string>( 'Vous pouvez rechercher ici un N° de mission, un emplacement, un conteneur ...' );
    displayWCSDropdown = input<boolean>( false );
    profileButtonText = input<string>( '' );
    disconnectButtonText = input<string>( '' );
    displayThemeToggle = input<boolean>( false );

    appIconClicked = output<void>();
    wcsSelected = output<string | WCSType>();
    languageChanged = output<string>();
    profileClicked = output<void>();
    disconnectClicked = output<void>();
    notificationClicked = output<void>();
    themeToggled = output<void>();

    readonly bellIcon = faBell;
    readonly downIcon = faCaretDown;
    readonly searchIcon = faMagnifyingGlass;
    readonly userIcon = faUser;
    readonly closeIcon = faClose;
    readonly down = faChevronDown;

    public currentLanguage: string = this.selectedLanguage();
    public currentWCS?: string | WCSType = this.selectedWCS();
    public logoutBtnLabel = linkedSignal( () => this.disconnectButtonText() );
    public themeBtnLabel = '';
    public activeCultures = locales;

    constructor() {
        this.#translateService.get( ['CK.TopBar.Button.ThemeToggle'] ).pipe( first() ).subscribe( t => {
            this.themeBtnLabel = t['CK.TopBar.Button.ThemeToggle'];
        } );
    }

    toggleAppIcon(): void {
        this.appIconClicked.emit();
    }

    selectLanguage( lang: string ): void {
        this.currentLanguage = lang;
        this.languageChanged.emit( this.currentLanguage );
    }

    selectWCS( wcs: WCSType | string ): void {
        this.currentWCS = wcs;
        this.wcsSelected.emit( this.currentWCS );
    }

    openNotifications(): void {
        this.notificationClicked.emit();
    }

    asWCSType( wcs: string | WCSType ): WCSType {
        return wcs as WCSType;
    }

    isWCSType( wcs: string | WCSType ): boolean {
        if ( typeof wcs === 'string' ) {
            return false;
        }

        if ( ( wcs as WCSType ).wcsId !== undefined ) {
            return true;
        }

        return false;
    }

    isWCSTypeArray(): boolean {
        if ( this.allWCS() && this.allWCS()!.length > 0 ) {
            if ( ( this.allWCS() as Array<any> ).length > 0 && ( this.allWCS()![0] as WCSType ).wcsId !== undefined ) {
                return true;
            }
        }
        return false;
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
