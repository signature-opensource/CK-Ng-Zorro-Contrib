// <HasNgPrivatePage />
import { Component, inject, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { CKGenAppModule } from '@local/ck-gen/CK/Angular/CKGenAppModule';
import { LayoutComponent, NavigationSection, PrivatePageComponent, NgAuthService } from '@local/ck-gen';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
// Private Page is from CK.Ng.AspNet.Auth package.

@Component( {
  selector: 'app-root',
  imports: [
    RouterOutlet, CommonModule, PrivatePageComponent,
    CKGenAppModule,
    LayoutComponent,
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
    this.navSections.push( {
      bottom: false,
      sectionHeadline: '',
      items: [
        {
          label: 'Overview',
          routerLink: 'overview',
          icon: faHome
        },
        {
          label: 'Components',
          routerLink: 'action-bar',
          children: [
            {
              label: 'ActionBar',
              routerLink: 'action-bar',
            },
            {
              label: 'Blockquote',
            },
            {
              label: 'Breadcrumb',
            },
            {
              label: 'Filter',
            },
            {
              label: 'GenericForm',
            },
            {
              label: 'Layout',
            },
            {
              label: 'LayoutContent',
            },
            {
              label: 'Loader',
            },
            {
              label: 'MobileBar',
            },
            {
              label: 'SideBar',
            },
            {
              label: 'Table',
            },
            {
              label: 'TopBar',
            },
          ]
        },
        {
          label: 'Components1',
          routerLink: 'action-bar',
          children: [
            {
              label: 'ActionBar1',
              routerLink: 'action-bar',
            }
          ]
        }
      ]
    } );
    this.navSections.push( {
      bottom: false,
      sectionHeadline: 'Back Office',
      items: [
        {
          label: 'ActionBar',
          routerLink: 'action-bar',
        },
        {
          label: 'Blockquote',
        },
        {
          label: 'Breadcrumb',
        },
        {
          label: 'Filter',
        },
        {
          label: 'GenericForm',
        },
        {
          label: 'Layout',
        },
        {
          label: 'LayoutContent',
        },
        {
          label: 'Loader',
        },
        {
          label: 'MobileBar',
        },
        {
          label: 'SideBar',
        },
        {
          label: 'Table',
        },
        {
          label: 'TopBar',
        },
      ],
    } );
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
