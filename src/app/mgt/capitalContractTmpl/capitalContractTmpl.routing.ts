import { Routes, RouterModule } from '@angular/router';
import { CapitalContractTmplComponent } from './capitalContractTmpl.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: CapitalContractTmplComponent
    }


];
export const routing = RouterModule.forChild(routes);
