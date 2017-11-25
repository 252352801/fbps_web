import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../services/entity/Contract.entity';
import {MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
@Injectable()
export class FinanceContractService {

  constructor(private myHttp:MyHttpClient){
  }

  query(query?:any):Promise<{items:Contract[],count:number}>{
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
            let contract=new Contract();
            contract.id=o.id;
            contract.twId=o.twId;
            contract.borrowApplyId=o.borrowApplyId;
            contract.companyName=o.companyName;
            contract.docNum=o.docNum;
            contract.title=o.title;
            contract.isSign=o.isSign;
            contract.createTime=o.createTime;
            contract.updateTime=o.updateTime;
            contract.capitalId=o.capitalId;
            contract.rrl=o.rrl;
            data.items.push(contract);
          }
        }
        return Promise.resolve(data);
      });
  }

}
