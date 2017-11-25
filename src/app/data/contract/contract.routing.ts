import { Routes, RouterModule } from '@angular/router';
import { ContractComponent }   from './contract.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: ContractComponent
    }


];
export const routing = RouterModule.forChild(routes);
