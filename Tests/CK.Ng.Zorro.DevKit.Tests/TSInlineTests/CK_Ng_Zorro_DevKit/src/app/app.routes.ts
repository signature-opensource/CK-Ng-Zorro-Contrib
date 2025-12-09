import { Routes } from '@angular/router';
import { NgZorroPage } from './ng-zorro/ng-zorro-page';
import MockupsRoutes from './mockups/routes';
import CKGenRoutes from '@local/ck-gen/CK/Angular/routes';

export const routes: Routes = [
  { path: 'ng-zorro', component: NgZorroPage },
  ...MockupsRoutes,
 ...CKGenRoutes
];

