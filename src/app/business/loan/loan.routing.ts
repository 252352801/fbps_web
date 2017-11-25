import {Routes, RouterModule} from '@angular/router';
import {OauthGuard} from '../../../services/guard/oauth.guard';
const routes: Routes = <Routes>[
  {
    path: '',
    //component: LoanComponent,
    children:[
      {
        path: 'inProcess',
        loadChildren: './inProcess/inProcess.module#InProcessModule',
        data: {title: '在贷跟踪',fnRequire:'06'},
        canActivate: [OauthGuard]
      },
      {
        path: 'repayment',
        loadChildren: './repayment/repayment.module#RepaymentModule',
        data: {title: '还款管理',fnRequire:'08'},
        canActivate: [OauthGuard]
      },
      {
        path: 'rollover',
        loadChildren: './rollover/rollover.module#RolloverModule',
        data: {title: '展期管理',fnRequire:'07'},
        canActivate: [OauthGuard]
      }
    ]
  }

];
export const routing = RouterModule.forChild(routes);
