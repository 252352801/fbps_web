import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';
import {OauthGuard} from '../core/services/guard/oauth.guard';
const routes: Routes = <Routes>[{
  path: '',
  component: ManagementComponent
},{
  path: 'product',
  loadChildren: './product/product.module#ProductModule',
  data: {title: '产品管理',fnRequire:'11',roleIn:['010','013']},
  canActivate: [OauthGuard]
},{
  path: 'capitalContractTmpl',
  loadChildren: './capitalContractTmpl/capitalContractTmpl.module#CapitalContractTmplModule'
},{
  path: 'businessRule',
  loadChildren: './businessRule/businessRule.module#BusinessRuleModule'
},{
  path: 'systemLog',
  loadChildren: './systemLog/systemLog.module#SystemLogModule',
  data: {title:'系统日志',fnRequire:'12'},
  canActivate: [OauthGuard]
}


];
export const routing = RouterModule.forChild(routes);
