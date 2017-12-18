import {Injectable} from '@angular/core';
import { RepaymentNotify} from '../../../core/entity/RepaymentNotify.entity';
import { RepayPlan} from '../../../core/entity/RepayPlan.entity';
import { MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import { BankAccount} from '../../../core/entity/BankAccount.entity';
import { RepaymentFlow} from '../../../core/entity/RepaymentFlow.entity';
@Injectable()
export class RepaymentService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 查询还款通知列表
   * @param query
   * @returns Promise<{count:number,items:RepaymentNotify[]}>
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

  /**
   * 通过id获取还款通知单
   * @param repaymentNotifyId
   * @returns Promise<RepaymentNotify>
   */
  getRepaymentNotifyById(repaymentNotifyId:string):Promise<RepaymentNotify>{
    return this.myHttp.post({
      api:this.myHttp.api.repaymentNotify,
      query:{
        repaymentNotifyId:repaymentNotifyId
      }
    }).toPromise()
      .then((res)=>{
        let notify=new RepaymentNotify();
        if(res.status===200){
          notify.init(res.body);
        }
        return Promise.resolve(notify);
      });
  }

  /**
   * 还款计划详情
   * @param body
   * @returns Promise<RepayPlan>
   */
  getRepayPlan(body:{
    borrowApplyId:string,
    currentPeriod:string|number
  }):Promise<RepayPlan>{
    return this.myHttp.post({
      api:this.myHttp.api.repayPlan,
      body:body
    }).toPromise()
      .then((res)=>{
        let repayPlan=new RepayPlan();
        if(res.status===200){
          repayPlan.init(res.body);
        }
        return Promise.resolve(repayPlan);
      });
  }
  /**
   * 还款计划详情预览
   * @param body
   * @returns Promise<RepayPlan>
   */
  getRepayPlanPreview(body:{
    borrowApplyId:string,
    repayDate:string,//还款时间
    currentPeriod:string|number
  }):Promise<RepayPlan>{
    return this.myHttp.post({
      api:this.myHttp.api.repayPlanPreview,
      body:body
    }).toPromise()
      .then((res)=>{
        let repayPlan=new RepayPlan();
        if(res.status===200){
          repayPlan.init(res.body);
        }
        return Promise.resolve(repayPlan);
      });
  }
}
