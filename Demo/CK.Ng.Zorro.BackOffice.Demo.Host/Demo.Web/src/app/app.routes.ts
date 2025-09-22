import { Routes } from '@angular/router';
import CKGenRoutes from '@local/ck-gen/CK/Angular/routes';

export const routes: Routes = [
  {
    path: 'overview',
    loadComponent: () => import( './overview/overview' ).then( c => c.Overview )
  },
  {
    path: 'action-bar',
    loadComponent: () =>
      import( './action-bar/action-bar' ).then(
        ( c ) => c.ActionBar
      ),
  },

  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...CKGenRoutes,
];
