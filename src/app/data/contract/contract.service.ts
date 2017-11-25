import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../services/entity/Contract.entity';
import {MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ContractService {

  constructor(private myHttp:MyHttpClient){
  }

  query(query?:QueryContractBody):Promise<{items:Contract[],count:number}>{
    return this.myHttp.post({
      api:this.myHttp.api.contractList,
      query:query
    }).toPromise()
      .then((res)=>{
        let data={
          items:[],
          count:0
        };
        let result= res;
        if(result.status==200){
          data.count=result.body.paginator.totalCount;
          for(let o of result.body.records){
            let contract=new Contract().initByObj(o);
            data.items.push(contract);
          }
        }
        return Promise.resolve(data);
      });
  }

}


export interface QueryContractBody{
  docNum?:string;
  companyName?:string;
  borrowApplyId?:string;
  beginTime?:string;
  endTime?:string;
  status?:string;
  page?:number;
  rows?:number;
}
