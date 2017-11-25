import { NgModule } from '@angular/core';
import { ProductComponent }   from './product.component';
import { routing } from './product.routing';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailsComponent } from './details/details.component';
import { ModifyProductDetailsComponent } from './modifyDetails/modifyDetails.component';
import { ModifyProductConfComponent } from './modifyConf/modifyConf.component';
import { PublishProductComponent } from './publish/publish.component';
import { ProductService } from './product.service';
@NgModule({
    imports: [routing,SharedModule],
    declarations: [
      ProductComponent,
      ProductDetailsComponent,
      ModifyProductDetailsComponent,
      PublishProductComponent,
      ModifyProductConfComponent
    ],
    providers:[ProductService]
})
export class ProductModule { }
