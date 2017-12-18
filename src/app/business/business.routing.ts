import {Routes, RouterModule} from '@angular/router';
import {BusinessComponent} from './business.component';
import {OauthGuard} from '../core/services/guard/oauth.guard';
import {LoanDetailsComponent} from './loan-details/details.component';
const routes: Routes = <Routes>[
  {
    path: '',
    component: BusinessComponent
  },
  {
    path: 'borrow',
    loadChildren: './borrow/borrow.module#BorrowModule',
    data: {title: '贷前管理',fnRequire:'04'},
    canActivate: [OauthGuard]
  },
  {
    path: 'loan',
    loadChildren: './loan/loan.module#LoanModule',
    data: {title: '贷后管理',fnIn:['06','07','08']},
    canActivate: [OauthGuard]
  },
  {
    path: 'history',
    loadChildren: './history/history.module#HistoryModule',
    data: {title: '贷款历史',fnRequire:'09'},
    canActivate: [OauthGuard]
  },

  //贷款详情-----
  {
    path: 'borrow/details/:id',
    loadChildren: './loan-details/details.module#LoanDetailsModule',
    //component: LoanDetailsComponent,
    data: {title: '贷款详情'}
  },
  {
    path: 'loan/inProcess/details/:id',
    loadChildren: './loan-details/details.module#LoanDetailsModule',
    //component: LoanDetailsComponent,
    data: {title: '贷款详情'}
  },
  {
    path: 'history/details/:id',
    loadChildren: './loan-details/details.module#LoanDetailsModule',
    //component: LoanDetailsComponent,
    data: {title: '贷款详情'}
  }


];
export const routing = RouterModule.forChild(routes);
