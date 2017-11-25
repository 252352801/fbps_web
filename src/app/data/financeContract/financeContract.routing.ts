import { Routes, RouterModule } from '@angular/router';
import { FinanceContractComponent }   from './financeContract.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: FinanceContractComponent
    }


];
export const routing = RouterModule.forChild(routes);
