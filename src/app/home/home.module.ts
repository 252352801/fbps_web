import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent }   from './home.component';
import { PendingComponent }   from './pending/pending.component';
import { routing } from './home.routing';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      HomeComponent,
      PendingComponent
    ]
})
export class HomeModule { }
