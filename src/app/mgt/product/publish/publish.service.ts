import {Injectable} from '@angular/core';
import { Product} from '../../../../services/entity/Product.entity';
import { ProductBody} from '../product.service';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class PublishProductService{
  constructor(private myHttp:MyHttpClient){

  }
  createProduct(body:ProductBody):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.createProduct,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          status:false,
          message:''
        };
        let result=res;
        if(result.status===200){
          data.status=true;
        }else{
          data.message=result.message||'';
        }
        return Promise.resolve(data);
      });
  }
}
