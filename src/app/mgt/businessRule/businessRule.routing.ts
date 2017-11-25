import { Routes, RouterModule } from '@angular/router';
import { BusinessRuleComponent }   from './businessRule.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: BusinessRuleComponent
    }


];
export const routing = RouterModule.forChild(routes);
