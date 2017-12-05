import { Component,Injectable} from '@angular/core';
import { Contract} from '../../services/entity/Contract.entity';
import { Signature} from '../../services/entity/Signature.entity';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
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
        console.log(data);
        return Promise.resolve(data);
      });
  }

}
