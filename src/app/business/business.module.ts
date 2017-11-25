import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {BusinessComponent}   from './business.component';
import {LoanDetailsModule}   from './loan-details/details.module';
import {routing} from './business.routing';


@NgModule({
    imports: [routing, SharedModule,LoanDetailsModule],
    declarations: [
        BusinessComponent
    ]
})
export class BusinessModule {
}
