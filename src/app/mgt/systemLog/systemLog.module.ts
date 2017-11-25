import { NgModule } from '@angular/core';
import { SystemLogComponent }   from './systemLog.component';
import { SharedModule }   from '../../shared/shared.module';
import { routing } from './systemLog.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      SystemLogComponent
    ]
})
export class SystemLogModule { }
