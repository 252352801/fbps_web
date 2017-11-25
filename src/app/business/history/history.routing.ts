import {Routes, RouterModule} from '@angular/router';
import { HistoryComponent }   from './history.component';
const routes: Routes = <Routes>[
  {
    path: '',
    component: HistoryComponent
  }
];
export const routing = RouterModule.forChild(routes);
