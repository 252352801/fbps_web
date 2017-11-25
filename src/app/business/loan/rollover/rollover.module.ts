import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {RolloverComponent}   from './rollover.component';
import {AcceptComponent}   from './accept/accept.component';
import {ConfigComponent}   from './config/config.component';
import {RolloverDetailsComponent}   from './details/details.component';
import {routing} from './rollover.routing';
import {RolloverService} from './rollover.service';
@NgModule({
  imports: [routing, SharedModule],
  declarations: [
    RolloverDetailsComponent,
    RolloverComponent,
    AcceptComponent,
    ConfigComponent
  ],
  providers:[RolloverService]
})
export class RolloverModule {
}
