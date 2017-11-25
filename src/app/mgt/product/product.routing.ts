import {Routes, RouterModule} from '@angular/router';
import {ProductComponent} from './product.component';
import { ProductDetailsComponent } from './details/details.component';
import { ModifyProductDetailsComponent } from './modifyDetails/modifyDetails.component';
import { ModifyProductConfComponent } from './modifyConf/modifyConf.component';
import { PublishProductComponent } from './publish/publish.component';
const routes: Routes = <Routes>[
  {
    path: '',
    component: ProductComponent
  },{
    path: 'details/:id',
    component: ProductDetailsComponent
  },{
    path: 'modifyDetails/:id',
    component: ModifyProductDetailsComponent
  },{
    path: 'modifyConf/:id',
    component: ModifyProductConfComponent
  },{
    path: 'publish',
    component: PublishProductComponent
  }
];
export const routing = RouterModule.forChild(routes);
