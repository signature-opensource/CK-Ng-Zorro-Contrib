import { Routes } from '@angular/router';
import CKGenRoutes from '@local/ck-gen/CK/Angular/routes';

export const routes: Routes = [
  ...CKGenRoutes,
  {
    path: 'overview',
    loadComponent: () => import( './overview/overview.component' ).then( c => c.OverviewComponent )
  },
  {
    path: 'action-bar',
    loadComponent: () =>
      import( './action-bar/action-bar.component' ).then(
        ( c ) => c.ActionBarComponent
      ),
  },


  { path: '', redirectTo: 'overview', pathMatch: 'full' }
];
