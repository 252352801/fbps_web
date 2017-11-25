import {Routes, RouterModule} from '@angular/router';
import {DataComponent}   from './data.component';
import {OauthGuard} from '../../services/guard/oauth.guard';
const routes: Routes = <Routes>[{
  path: '',
  component: DataComponent
}, {
  path: 'contract',
  loadChildren: './contract/contract.module#ContractModule',
  data: {title: '融资合同库',fnRequire:'16'},
  canActivate: [OauthGuard]
}, {
  path: 'paymentJournal',
  loadChildren: './paymentJournal/paymentJournal.module#PaymentJournalModule'
}, {
  path: 'waybillJournal',
  loadChildren: './waybillJournal/waybillJournal.module#WaybillJournalModule'
}
];
export const routing = RouterModule.forChild(routes);
