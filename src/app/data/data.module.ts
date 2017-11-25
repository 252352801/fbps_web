import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DataComponent }   from './data.component';
import { routing } from './data.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      DataComponent
    ]
})
export class DataModule { }
