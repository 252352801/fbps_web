import {Injectable} from '@angular/core';
import { ProductBody} from '../product.service';
import { MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
@Injectable()
export class ModifyProductDetailsService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 更新产品
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  updateProduct(body:ProductBody):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.updateProduct,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        let result=res;
        if(result.status===200){
          data.ok=true;
        }else{
          data.message=result.message||'';
        }
        return Promise.resolve(data);
      });
  }
}
