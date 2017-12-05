import {Routes, RouterModule} from '@angular/router';
import {RepaymentComponent}   from './repayment.component';
import {RepayComponent}   from './repay/repay.component';
import {AcceptComponent}   from './accept/accept.component';
import { CAVComponent }   from './cav/cav.component';
import {OauthGuard} from '../../../../services/guard/oauth.guard';
import {RepaymentDetailsComponent}   from './details/details.component';
const routes: Routes = <Routes>[
  {
    path: '',
    component: RepaymentComponent
  },
  {
    path: 'details/:id',
    component: RepaymentDetailsComponent,
    data: {title: '还款详情',fnRequire:'08'},
    canActivate: [OauthGuard]
  },
  {
    path: 'accept/:id',
    component: AcceptComponent,
    data: {title: '受理还款',roleIn:['001','010']},
    canActivate: [OauthGuard]
  },
  {
    path: 'repay/:borrowApplyId/:repaymentPlan',
    component: RepayComponent,
    data: {title: '还款',roleIn:['003','010']},
    canActivate: [OauthGuard]
  },
  {
    path: 'cav/:id',
    component: CAVComponent,
    data: {title: '还款核销',roleIn:['001','009','010']},
    canActivate: [OauthGuard]
  }
];
export const routing = RouterModule.forChild(routes);
