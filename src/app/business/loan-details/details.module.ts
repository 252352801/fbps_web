import { NgModule } from '@angular/core';
import {LoanDetailsComponent}   from './details.component';
import {SharedModule}   from '../../shared/shared.module';
import {routing} from './details.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      LoanDetailsComponent
    ]
})
export class LoanDetailsModule { }
