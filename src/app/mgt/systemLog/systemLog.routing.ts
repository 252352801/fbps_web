import { Routes, RouterModule } from '@angular/router';
import { SystemLogComponent }   from './systemLog.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: SystemLogComponent
    }


];
export const routing = RouterModule.forChild(routes);
