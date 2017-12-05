import {Routes, RouterModule} from '@angular/router';
import {LoanDetailsComponent}   from './details.component';
const routes: Routes = <Routes>[
  {
    path: '',
    component: LoanDetailsComponent
  }
];
export const routing = RouterModule.forChild(routes);
