import {Injectable} from '@angular/core';
import { Loan} from '../../core/entity/Loan.entity';
import { RepaymentNotify} from '../../core/entity/RepaymentNotify.entity';
import { MyHttpClient} from '../../core/services/myHttp/myhttpClient.service';
import { Rollover} from '../../core/entity/Rollover.entity';
@Injectable()
export class PendingService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询贷款申请列表
   */
  queryLoans(query:any):Promise<{count:number,items:Loan[]}>{
    return this.myHttp.get({
      api:this.myHttp.api.loanList,
      query:query
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        if(res.status===200){
          data.count=res.body.paginator.totalCount;
          for(let l of res.body.records){
            let loan=new Loan().init(l);
            data.items.push(loan);
          }
        }
        return Promise.resolve(data);
      }).catch((err)=>{
        return Promise.resolve({
          count:0,
          items:[]
        });
      });
  }

  /**
   * 查询还款通知列表
   */
  queryRepaymentNotifies(query:any):Promise<{count:number,items:RepaymentNotify[]}>{
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
      }).catch((err)=>{
        return Promise.resolve({
          count:0,
          items:[]
        });
      });
  }

  /**
   * 查询展期申请列表
   */
  queryRollovers(query?:any):Promise<{count:number,items:Rollover[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.rolloverList,
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
            let rollover=new Rollover().init(o);
            data.items.push(rollover);
          }
        }
        return Promise.resolve(data);
      }).catch((err)=>{
        return Promise.resolve({
          count:0,
          items:[]
        });
      });
  }
}
