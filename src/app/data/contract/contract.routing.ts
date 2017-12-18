import { Routes, RouterModule } from '@angular/router';
import { ContractComponent }   from './contract.component';
import { ContractDetailsPageComponent }   from './details/details.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: ContractComponent
    }, {
    path: 'details/:data',
    component: ContractDetailsPageComponent,
    data: {title: '合同详情'}
  },


];
export const routing = RouterModule.forChild(routes);
