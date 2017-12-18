import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {PendingComponent}   from './pending/pending.component';
import {OauthGuard} from '../core/services/guard/oauth.guard';
const routes: Routes = <Routes>[
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'pending',
    component: PendingComponent,
    data: {title: '待办事项',fnRequire:'02'},
    canActivate:[OauthGuard]
  }
];
export const routing = RouterModule.forChild(routes);
