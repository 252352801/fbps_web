import {Injectable} from '@angular/core';
import { Product} from '../../../core/entity/Product.entity';
import { ProductBody} from '../product.service';
import { MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
@Injectable()
export class PublishProductService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   *
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  createProduct(body:ProductBody):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.createProduct,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        data.ok=(res.status===200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }
}
