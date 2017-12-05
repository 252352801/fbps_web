import {Routes, RouterModule} from '@angular/router';
import {BorrowComponent}   from './borrow.component';
import {AcceptComponent}   from './accept/accept.component';
import {BorrowConfigureComponent}   from './configure/configure.component';
import { ApplyLoanComponent }   from './applyLoan/applyLoan.component';
import {LoanComponent}   from './loan/loan.component';
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
    path: 'applyLoan/:type/:id',
    component: ApplyLoanComponent,
    data: {title: '申请放款',roleIn:['001','010']},
    canActivate: [OauthGuard]
  },
  {
    path: 'loan/:id',
    component: LoanComponent,
    data: {title: '放款审批',roleIn:['009','010']},
    canActivate: [OauthGuard]
  }
];
export const routing = RouterModule.forChild(routes);
