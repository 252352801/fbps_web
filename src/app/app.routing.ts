import {RouterModule, Routes, Data} from '@angular/router';
import {SignInComponent} from './signin/signin.component';
import {IndexComponent} from './index/index.component';
import {ModifyPasswordComponent} from './modifyPassword/modifyPassword.component';


import {LoginGuard} from './core/services/guard/login.guard';
import {OauthGuard} from './core/services/guard/oauth.guard';
const routes: Routes = [
  {path: '', redirectTo: 'signin', pathMatch: 'full', data: {title: '登录'}},
  {path: 'signin', component: SignInComponent, data: {title: '登录'}},
  {
    path: '', component: IndexComponent, data: {title: '控制台'}, canActivate: [LoginGuard],
    children: [{
      path: 'home',
      loadChildren: './home/home.module#HomeModule',
      data: {title: '首页'},
      canActivate: [OauthGuard]
    }, {
      path: 'modifyPassword',
      component:ModifyPasswordComponent,
      data:{title:'修改密码'}
    }, {
      path: 'modifyReviewPassword',
      component:ModifyPasswordComponent,
      data:{title:'修改审核密码'}
    },{
      path: 'business',
      loadChildren: './business/business.module#BusinessModule',
      data: {title: '业务中心',fnIn:['04','06','07','08','09']},
      canActivate: [OauthGuard]
    }, {
      path: 'mgt',
      loadChildren: './mgt/management.module#ManagementModule',
      data: {title: '管理中心',fnIn:['11','12']},
      canActivate: [OauthGuard]
    }, {
      path: 'data',
      loadChildren: './data/data.module#DataModule',
      data: {title: '数据中心',fnIn:['16']},
      canActivate: [OauthGuard]
    }]
  }
];
export const routing = RouterModule.forRoot(routes);
