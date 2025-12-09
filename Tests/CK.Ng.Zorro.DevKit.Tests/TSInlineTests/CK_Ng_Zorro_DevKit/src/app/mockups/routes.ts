import {Route} from '@angular/router';
import {ConveyorPage} from './conveyor-page/conveyor-page';
import {PickingPage} from './picking-page/picking-page';
import {DistanceViewPage} from './distance-view-page/distance-view-page';

export default [
  { path: 'picking', component: PickingPage },
  { path: 'conveyor', component: ConveyorPage },
  { path: 'distance-view', component: DistanceViewPage }
] as Route[];
