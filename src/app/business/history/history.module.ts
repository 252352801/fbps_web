import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HistoryComponent }   from './history.component';
import { routing } from './history.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      HistoryComponent
    ]
})
export class HistoryModule { }
