import { NgModule } from '@angular/core';
import {LoanDetailsComponent}   from './details.component';
import {SharedModule}   from '../../shared/shared.module';
@NgModule({
    imports: [SharedModule],
    declarations: [
      LoanDetailsComponent
    ]
})
export class LoanDetailsModule { }
