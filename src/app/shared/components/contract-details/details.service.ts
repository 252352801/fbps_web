import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../core/entity/Contract.entity';
import { Signature} from '../../../core/entity/Signature.entity';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
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
        if(res.status==200){
          for(let o of res.body.records){
            let signature=Signature.create(o);
            data.push(signature);
          }
        }
        return Promise.resolve(data);
      });
  }

}
