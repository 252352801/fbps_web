import { NgModule } from '@angular/core';
import { ContractComponent }   from './contract.component';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './contract.routing';
import { ContractDetailsPageComponent }   from './details/details.component';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      ContractComponent,
      ContractDetailsPageComponent
    ]
})
export class ContractModule { }
