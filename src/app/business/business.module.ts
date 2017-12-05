import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {BusinessComponent}   from './business.component';
import {BusinessService} from './business.service';
import {routing} from './business.routing';


@NgModule({
  imports: [routing, SharedModule],
  declarations: [
    BusinessComponent
  ],
  providers: [
    BusinessService
  ],
})
export class BusinessModule {
}
