import {Routes, RouterModule} from '@angular/router';
import {RolloverComponent}   from './rollover.component';
import {AcceptComponent}   from './accept/accept.component';
import {RolloverDetailsComponent}   from './details/details.component';
import { ConfigComponent }   from './config/config.component';
import {OauthGuard} from '../../../../services/guard/oauth.guard';
const routes: Routes = <Routes>[
  {
    path: '',
    component: RolloverComponent
  }, {
    path: 'details/:id',
    component: RolloverDetailsComponent,
    data: {title: '展期详情',fnRequire:'07'},
    canActivate: [OauthGuard]
  },{
    path: 'accept/:id',
    component: AcceptComponent,
    data: {title: '展期受理',roleIn:['003','010']},
    canActivate: [OauthGuard]
  }, {
    path: 'config/:id',
    component: ConfigComponent,
    data: {title: '配置展期合同',roleIn:['003','010']},
    canActivate: [OauthGuard]
  }
];
export const routing = RouterModule.forChild(routes);
