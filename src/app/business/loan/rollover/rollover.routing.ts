import {Routes, RouterModule} from '@angular/router';
import {RolloverComponent}   from './rollover.component';
import {RolloverDetailsComponent}   from './details/details.component';
import { ConfigComponent }   from './config/config.component';
import {OauthGuard} from '../../../core/services/guard/oauth.guard';
import {RolloverUploadVoucherComponent}   from './upload-voucher/upload-voucher.component';
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
    path: 'uploadVoucher/:id',
    component: RolloverUploadVoucherComponent,
    data: {title: '上传凭证',roleIn:['001','003','010']},
    canActivate: [OauthGuard]
  },{
    path: 'config/:id',
    component: ConfigComponent,
    data: {title: '配置展期合同',roleIn:['001','010']},
    canActivate: [OauthGuard]
  }
];
export const routing = RouterModule.forChild(routes);
