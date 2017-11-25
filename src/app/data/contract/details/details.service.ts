import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../../services/entity/Contract.entity';
import { Signature} from '../../../../services/entity/Signature.entity';
import {MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ContractDetailsService {

  constructor(private myHttp:MyHttpClient){
  }

  queryContractSignatories(body: {
    contractId:string
  }): Promise<Signature[]> {
    return this.myHttp.post({
      api: this.myHttp.api.contractSignatories,
      query: body
    }).toPromise()
      .then((res)=>{
        let data=[];
        let result=res;
        if(result.status===200){
          for(let o of result.body.records){
            let signature=new Signature().initByObj(o);
            data.push(signature);
          }
        }
        return Promise.resolve(data);
      });
  }

}
