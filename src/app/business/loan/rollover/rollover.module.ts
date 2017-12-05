import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {RolloverComponent}   from './rollover.component';
import {ConfigComponent}   from './config/config.component';
import {RolloverUploadVoucherComponent}   from './upload-voucher/upload-voucher.component';
import {RolloverDetailsComponent}   from './details/details.component';
import {routing} from './rollover.routing';
import {RolloverService} from './rollover.service';
@NgModule({
  imports: [routing, SharedModule],
  declarations: [
    RolloverDetailsComponent,
    RolloverComponent,
    ConfigComponent,
    RolloverUploadVoucherComponent
  ],
  providers:[RolloverService]
})
export class RolloverModule {
}
