import {Injectable} from '@angular/core';
import { ProductBody} from '../product.service';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ModifyProductDetailsService{
  constructor(private myHttp:MyHttpClient){

  }
  updateProduct(body:ProductBody):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.updateProduct,
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
