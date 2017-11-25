import { Routes, RouterModule } from '@angular/router';
import { PaymentJournalComponent }   from './paymentJournal.component';
const routes: Routes = <Routes>[
    {
        path: '',
        component: PaymentJournalComponent
    }


];
export const routing = RouterModule.forChild(routes);
