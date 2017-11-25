import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {RepaymentComponent}   from './repayment.component';
import {RepayComponent}   from './repay/repay.component';
import {AcceptComponent}   from './accept/accept.component';
import {CAVComponent}   from './cav/cav.component';
import {RepaymentDetailsComponent}   from './details/details.component';
import {routing} from './repayment.routing';
@NgModule({
    imports: [routing, SharedModule],
    declarations: [
        RepaymentComponent,
        RepayComponent,
        AcceptComponent,
        CAVComponent,
      RepaymentDetailsComponent
    ]
})
export class RepaymentModule {
}
