import {Routes, RouterModule} from '@angular/router';
import {InProcessComponent}   from './inProcess.component';
const routes: Routes = <Routes>[
  {
    path: '',
    component: InProcessComponent
  }
];
export const routing = RouterModule.forChild(routes);
