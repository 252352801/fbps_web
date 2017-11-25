import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ManagementComponent }   from './management.component';
import { routing } from './management.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      ManagementComponent
    ]
})
export class ManagementModule { }
