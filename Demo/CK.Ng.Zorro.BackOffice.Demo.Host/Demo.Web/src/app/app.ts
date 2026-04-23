// <HasNgPrivatePage />
import { Component, inject, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { faHome, faTable, faList, faBars, faFilter, faColumns, faPen, faInfoCircle, faQuoteLeft, faSpinner, faSearch, faRoute, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { CKGenAppModule } from '@local/ck-gen/CK/Angular/CKGenAppModule';
import { Layout, NavigationSection, PrivatePage, NgAuthService } from '@local/ck-gen';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component( {
  selector: 'app-root',
  imports: [
    RouterOutlet, CommonModule, PrivatePage,
    CKGenAppModule,
    Layout,
    TranslateModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
} )
export class App {

  readonly #authService = inject( NgAuthService );
  isAuthenticated = computed( () => this.#authService.authenticationInfo().user.userId !== 0 );

  #router = inject( Router );
  #translateService = inject( TranslateService );

  title = 'CK.Ng.Zorro.Demo.Web';

  navSections: Array<NavigationSection> = [];

  constructor() {
    this.navSections = [
      {
        sectionHeadline: '',
        bottom: false,
        items: [
          {
            label: 'Overview',
            routerLink: 'overview',
            icon: faHome
          }
        ]
      },
      {
        sectionHeadline: 'Basic',
        bottom: false,
        items: [
          { label: 'Table', routerLink: 'basic/table', icon: faTable },
          { label: 'ListView', routerLink: 'basic/list-view', icon: faList },
          { label: 'ActionBar', routerLink: 'basic/action-bar', icon: faBars },
          { label: 'Filters', routerLink: 'basic/filters', icon: faFilter },
          { label: 'AdaptivePageLayout', routerLink: 'basic/adaptive-page-layout', icon: faColumns },
          { label: 'SplitView', routerLink: 'basic/split-view' },
          { label: 'SelectableList', routerLink: 'basic/selectable-list' },
          { label: 'InlineEdit', routerLink: 'basic/inline-edit', icon: faPen },
          { label: 'SimpleInfoBox', routerLink: 'basic/simple-info-box', icon: faInfoCircle },
          { label: 'Blockquote', routerLink: 'basic/blockquote', icon: faQuoteLeft },
          { label: 'Loader', routerLink: 'basic/loader', icon: faSpinner },
          { label: 'GenericForm', routerLink: 'basic/generic-form' },
        ]
      },
      {
        sectionHeadline: 'BackOffice',
        bottom: false,
        items: [
          { label: 'Layout', routerLink: 'backoffice/layout' },
          { label: 'LayoutContent', routerLink: 'backoffice/layout-content' },
          { label: 'TopBar', routerLink: 'backoffice/top-bar' },
          { label: 'SideBar', routerLink: 'backoffice/side-bar' },
          { label: 'MobileBar', routerLink: 'backoffice/mobile-bar' },
          { label: 'SearchModal', routerLink: 'backoffice/search-modal', icon: faSearch },
        ]
      },
      {
        sectionHeadline: 'Other',
        bottom: false,
        items: [
          { label: 'Breadcrumb', routerLink: 'breadcrumb', icon: faRoute },
        ]
      }
    ];
  }

  goToHome(): void {
    this.#router.navigate( [''] );
  }

  toggleTheme(): void {
    alert( 'theme toggle requested' );
  }

  search( s: string ): void {
    alert( `global search requested: ${s}` );
  }

  clearSearch(): void {
    alert( 'global search cleared' );
  }

  switchLang( lang: string ): void {
    this.#translateService.use( lang );
  }
}
