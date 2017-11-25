import {Injectable} from '@angular/core';
import { RepaymentNotify} from '../../../../services/entity/RepaymentNotify.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BankAccount} from '../../../../services/entity/BankAccount.entity';
import { BankAccountFlow} from '../../../../services/entity/BankAccountFlow.entity';
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
            let repayment=new RepaymentNotify().initByObj(o);
            data.items.push(repayment);
          }
        }
        return Promise.resolve(data);
      });
  }


  /**
   * 银行账户信息
   * @param query
   * @returns {Promise<U>|wdpromise.Promise<any>|promise.Promise<any>|promise.Promise<Promise<BankAccount>|Promise<void>|Promise<T>>|wdpromise.Promise<T>|PromiseLike<TResult>|any}
   */
  accountInfo(query:{
    memberId:string
  }):Promise<BankAccount>{
    return this.myHttp.post({
      api:this.myHttp.api.accountInfo,
      query:query
    }).toPromise()
      .then((res)=>{
        let result=res;
        if(result.status===200){
          if(result.body&&result.body.records&&result.body.records[0]){
            let bankAccount=new BankAccount().initByObj(result.body.records[0]);
            return Promise.resolve(bankAccount);
          }
        }
        return Promise.reject('');
      });
  }

  /**
   * 银行账户流水
   */
  backAccountFlow(query:{
    accountId?:string,//三级账户ID
    beginDate:string,//开始时间 格式：yyyy-MM-dd
    endDate:string,//结束时间 格式：yyyy-MM-dd
    flowStatus:number,//交易状态：0：全部1:提交成功(未明)；2:交易成功;-2:交易失败
    tradeType:number,//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
    page?:number,//页码
    rows?:number,//每页大小
    memberId:string,//会员Id
  }):Promise<{count:number,items:BankAccountFlow[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.bankAccountFlow,
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
            let flow=new BankAccountFlow().initByObj(o);
            data.items.push(flow);
          }
        }
        return Promise.resolve(data);
      });
  }
}
