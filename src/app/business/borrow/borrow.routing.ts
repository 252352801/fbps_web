import {Routes, RouterModule} from '@angular/router';
import {BorrowComponent}   from './borrow.component';
import {AcceptComponent}   from './accept/accept.component';
import {BorrowConfigureComponent}   from './configure/configure.component';
import { BorrowLoanComponent }   from './loan/borrowLoan.component';
import {OauthGuard} from '../../../services/guard/oauth.guard';
const routes: Routes = <Routes>[
  {
    path: '',
    component: BorrowComponent
  },
  {
    path: 'accept/:id',
    component: AcceptComponent,
    data: {title: '受理贷款',roleIn:['003','010']},
    canActivate: [OauthGuard]
  },
  {
    path: 'configure/:id',
    component: BorrowConfigureComponent,
    data: {title: '配置合同',roleIn:['001','010']},
    canActivate: [OauthGuard]
  },
  {
    path: 'loan/:id',
    component: BorrowLoanComponent,
    data: {title: '放款',roleIn:['009','010']},
    canActivate: [OauthGuard]
  }
];
export const routing = RouterModule.forChild(routes);
