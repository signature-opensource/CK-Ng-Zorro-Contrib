import { Routes } from '@angular/router';
import CKGenRoutes from '@local/ck-gen/CK/Angular/routes';

export const routes: Routes = [
  // Landing
  {
    path: 'overview',
    loadComponent: () => import( './demos/overview/overview-demo' ).then( c => c.OverviewDemo )
  },

  // Basic components
  {
    path: 'basic/table',
    loadComponent: () => import( './demos/table/table-demo' ).then( c => c.TableDemo )
  },
  {
    path: 'basic/list-view',
    loadComponent: () => import( './demos/list-view/list-view-demo' ).then( c => c.ListViewDemo )
  },
  {
    path: 'basic/action-bar',
    loadComponent: () => import( './demos/action-bar/action-bar-demo' ).then( c => c.ActionBarDemo )
  },
  {
    path: 'basic/filters',
    loadComponent: () => import( './demos/filters/filters-demo' ).then( c => c.FiltersDemo )
  },
  {
    path: 'basic/adaptive-page-layout',
    loadComponent: () => import( './demos/adaptive-page-layout/adaptive-page-layout-demo' ).then( c => c.AdaptivePageLayoutDemo )
  },
  {
    path: 'basic/split-view',
    loadComponent: () => import( './demos/split-view/split-view-demo' ).then( c => c.SplitViewDemo )
  },
  {
    path: 'basic/selectable-list',
    loadComponent: () => import( './demos/selectable-list/selectable-list-demo' ).then( c => c.SelectableListDemo )
  },
  {
    path: 'basic/inline-edit',
    loadComponent: () => import( './demos/inline-edit/inline-edit-demo' ).then( c => c.InlineEditDemo )
  },
  {
    path: 'basic/simple-info-box',
    loadComponent: () => import( './demos/simple-info-box/simple-info-box-demo' ).then( c => c.SimpleInfoBoxDemo )
  },
  {
    path: 'basic/blockquote',
    loadComponent: () => import( './demos/blockquote/blockquote-demo' ).then( c => c.BlockquoteDemo )
  },
  {
    path: 'basic/loader',
    loadComponent: () => import( './demos/loader/loader-demo' ).then( c => c.LoaderDemo )
  },
  {
    path: 'basic/generic-form',
    loadComponent: () => import( './demos/generic-form/generic-form-demo' ).then( c => c.GenericFormDemo )
  },

  // BackOffice components
  {
    path: 'backoffice/layout',
    loadComponent: () => import( './demos/layout/layout-demo' ).then( c => c.LayoutDemo )
  },
  {
    path: 'backoffice/layout-content',
    loadComponent: () => import( './demos/layout-content/layout-content-demo' ).then( c => c.LayoutContentDemo )
  },
  {
    path: 'backoffice/top-bar',
    loadComponent: () => import( './demos/top-bar/top-bar-demo' ).then( c => c.TopBarDemo )
  },
  {
    path: 'backoffice/side-bar',
    loadComponent: () => import( './demos/side-bar/side-bar-demo' ).then( c => c.SideBarDemo )
  },
  {
    path: 'backoffice/mobile-bar',
    loadComponent: () => import( './demos/mobile-bar/mobile-bar-demo' ).then( c => c.MobileBarDemo )
  },
  {
    path: 'backoffice/search-modal',
    loadComponent: () => import( './demos/search-modal/search-modal-demo' ).then( c => c.SearchModalDemo )
  },

  // Other
  {
    path: 'breadcrumb',
    loadComponent: () => import( './demos/breadcrumb/breadcrumb-demo' ).then( c => c.BreadcrumbDemo )
  },

  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...CKGenRoutes,
];
