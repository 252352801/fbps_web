import { NgModule } from '@angular/core';
import { FinanceContractComponent }   from './financeContract.component';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './financeContract.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      FinanceContractComponent
    ]
})
export class FinanceContractModule { }
