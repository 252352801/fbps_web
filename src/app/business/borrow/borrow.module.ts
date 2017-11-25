import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {BorrowComponent}   from './borrow.component';
import {AcceptComponent}   from './accept/accept.component';
import {BorrowConfigureComponent}   from './configure/configure.component';
import {BorrowLoanComponent}   from './loan/borrowLoan.component';
import { BorrowService} from './borrow.service';
import {routing} from './borrow.routing';
@NgModule({
  imports: [routing, SharedModule],
  declarations: [
    BorrowComponent,
    AcceptComponent,
    BorrowConfigureComponent,
    BorrowLoanComponent
  ],
  providers: [BorrowService]
})
export class BorrowModule {
}
