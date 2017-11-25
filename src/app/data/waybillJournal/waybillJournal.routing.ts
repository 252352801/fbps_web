import { Routes, RouterModule } from '@angular/router';
import { WaybillJournalComponent }   from './waybillJournal.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: WaybillJournalComponent
    }


];
export const routing = RouterModule.forChild(routes);
