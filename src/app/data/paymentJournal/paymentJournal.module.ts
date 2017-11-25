import { NgModule } from '@angular/core';
import { PaymentJournalComponent }   from './paymentJournal.component';
import { routing } from './paymentJournal.routing';
@NgModule({
    imports: [routing],
    declarations: [
      PaymentJournalComponent
    ]
})
export class PaymentJournalModule { }
