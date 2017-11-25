import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoanComponent }   from './loan.component';
import { routing } from './loan.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      LoanComponent,
    //  LoanDetailsComponent
    ]
})
export class LoanModule { }
