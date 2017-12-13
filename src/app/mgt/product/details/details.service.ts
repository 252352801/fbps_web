import {Injectable} from '@angular/core';
import { Product} from '../../../../services/entity/Product.entity';
import { ProductService} from '../product.service';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { Resource} from '../../../../services/entity/Resource.entity';
@Injectable()
export class ProductDetailsService{
  constructor(
    private myHttp:MyHttpClient,
    private prodSvc:ProductService,
  ){

  }
  /**
   * 查询产品详情
   */
  getProductById(id?:string):Promise<Product>{
    return this.prodSvc.getProductById(id);
  }

  /**
   * 加载资方/渠道
   * @param query
   * @returns Promise<Resource[]>
   */
  loadResources(query?: any): Promise<Resource[]> {
    return this.myHttp.get({
      api: this.myHttp.api.resource,
      query: query
    }).toPromise()
      .then((res)=> {
        let resources = [];
        let result = res;
        if (result.status === 200) {
          for(let o of result.body.records){
            let resource = new Resource();
            resource.resourceId=o.resourceId;
            resource.resourceName=o.resourceName;
            resources.push(resource);
          }
        }
        return Promise.resolve(resources);
      });
  }

}
