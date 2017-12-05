import {Injectable} from '@angular/core';
import { RepaymentNotify} from '../../../../services/entity/RepaymentNotify.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BankAccount} from '../../../../services/entity/BankAccount.entity';
import { RepaymentFlow} from '../../../../services/entity/RepaymentFlow.entity';
@Injectable()
export class RepaymentService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询还款通知列表
   */
  queryRepaymentNotifies(query?:any):Promise<{count:number,items:RepaymentNotify[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.repaymentNotifyList,
      query:query
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        let result=res;
        if(result.status===200){
          data.count=result.body.paginator.totalCount;
          for(let o of result.body.records){
            let repayment=new RepaymentNotify().init(o);
            data.items.push(repayment);
          }
        }
        return Promise.resolve(data);
      });
  }
}
