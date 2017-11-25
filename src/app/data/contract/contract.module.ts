import { NgModule } from '@angular/core';
import { ContractComponent }   from './contract.component';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './contract.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      ContractComponent
    ]
})
export class ContractModule { }
