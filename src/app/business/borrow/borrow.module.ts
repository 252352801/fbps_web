import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {BorrowComponent}   from './borrow.component';
import {AcceptComponent}   from './accept/accept.component';
import {BorrowConfigureComponent}   from './configure/configure.component';
import {ApplyLoanComponent}   from './applyLoan/applyLoan.component';
import {LoanComponent}   from './loan/loan.component';
import { BorrowService} from './borrow.service';
import {routing} from './borrow.routing';
@NgModule({
  imports: [routing, SharedModule],
  declarations: [
    BorrowComponent,
    AcceptComponent,
    BorrowConfigureComponent,
    ApplyLoanComponent,
    LoanComponent
  ],
  providers: [BorrowService]
})
export class BorrowModule {
}
