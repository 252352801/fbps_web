import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { InProcessComponent }   from './inProcess.component';
import { routing } from './inProcess.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      InProcessComponent
    ]
})
export class InProcessModule { }
