import {Injectable} from '@angular/core';
import {Resource} from '../entity/Resource.entity';
import {MyHttpClient} from '../myHttp/myhttpClient.service';
import {FileInfo} from '../entity/FileInfo.entity';
import {BankAccountFlow} from '../entity/BankAccountFlow.entity';
import {SystemLog} from '../entity/SystemLog.entity';
import {LoanFlow} from '../entity/LoanFlow.entity';
import {RepaymentFlow} from '../entity/RepaymentFlow.entity';
import {Flow} from '../entity/Flow.entity';
import {BankAccount} from '../entity/BankAccount.entity';
import {BankCard} from '../entity/BankCard.entity';
import {config} from '../config/app.config';
import {LoanFlowQuery,RepaymentFlowQuery} from './common.interface';
@Injectable()
export class CommonService{
  constructor(
    private myHttp:MyHttpClient
  ){
  }

  /**
   * 根据文件ID获取文件信息
   * @param fileId
   * @returns {any}
   */
  getFileInfo(fileId:string):Promise<{ok:boolean,data:FileInfo}>{
    return this.myHttp.post({
      api:config.api.fileInfo,
      body:{
        fileId:fileId
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          ok:false,
          data:null
        };
        if (res.status === 200) {
          data.ok=true;
          data.data=new FileInfo().init(res.body);
        }
        return Promise.resolve(data);
      });
  }

  /**
   * 删除文件
   * @param fileId
   * @returns Promise<{status:boolean,message:string}
   */
  deleteFile(fileId:string):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:config.api.removeFile,
      body:{
        fileId:fileId
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          status:false,
          message:''
        };
        if (res.status === 200) {
        }
        data.status=(res.status==200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }

  /**
   * 查新系统日志列表
   * @param body
   * @returns Promise<{count:number,items:SystemLog[]}>
   */
  querySystemLog(body:SystemLogSearchParams):Promise<{count:number,items:SystemLog[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.systemLogs,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        if(res.status===200){
          data.count=res.body.paginator.totalCount;
          for(let o of res.body.records){
            let sysLog=new SystemLog().init(o);
            data.items.push(sysLog);
          }
        }
        return Promise.resolve(data);
      });
  }

  /**
   * 银行账户信息
   * @param query
   * @returns Promise<BankAccount>
   */
  bankAccount(query:{
    memberId:string
  }):Promise<{ok:boolean,data:BankAccount}>{
    return this.myHttp.get({
      api:this.myHttp.api.accountInfo,
      query:query
    }).toPromise()
      .then((res)=>{
        let result={
          ok:false,
          data:null
        };
        if(res.status===200){
          if(res.body&&res.body.records&&res.body.records[0]){
            result.ok=true;
            result.data=new BankAccount().init(res.body.records[0]);
          }
        }
        return Promise.resolve(result);
      });
  }

  /**
   * 银行账户流水
   */
  bankAccountFlow(body:BankAccountFlowBody):Promise<{count:number,items:BankAccountFlow[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.bankAccountFlow,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        if(res.status===200){
          data.count=res.body.paginator.totalCount;
          for(let o of res.body.records){
            let flow=new BankAccountFlow().init(o);
            data.items.push(flow);
          }
        }
        return Promise.resolve(data);
      });
  }

  /**
   * 借款单流水明细列表
   */
  loanFlows(query:LoanFlowQuery):Promise<LoanFlow[]>{
    return this.myHttp.get({
      api:this.myHttp.api.loanFlows,
      query:query
    }).toPromise()
      .then((res)=>{
        let items:LoanFlow[]=[];
        if(res.status===200){
          for(let o of res.body.records){
            let flow=LoanFlow.create(o);
            items.push(flow);
          }
        }
        return Promise.resolve(items);
      });
  }

  /**
   * 还款流水明细列表
   */
  repaymentFlows(query:RepaymentFlowQuery):Promise<RepaymentFlow[]>{
    return this.myHttp.get({
      api:this.myHttp.api.repaymentFlows,
      query:query
    }).toPromise()
      .then((res)=>{
        let items:RepaymentFlow[]=[];
        if(res.status===200){
          for(let o of res.body.records){
            let flow=RepaymentFlow.create(o);
            items.push(flow);
          }
        }
        return Promise.resolve(items);
      });
  }

  /**
   * 流水详情
   */
  flow(flowId:string):Promise<Flow>{
    return this.myHttp.get({
      api:this.myHttp.api.flow,
      query:{
        flowId:flowId
      }
    }).toPromise()
      .then((res)=>{
        let flow:Flow=new Flow();
        if(res.status===200){
          flow=flow.init(res.body);
        }
        return Promise.resolve(flow);
      });
  }
  resources(query?:{
    resourceType:number|string //0:渠道 1:资方
  }): Promise<Resource[]> {
    return this.myHttp.get({
      api: this.myHttp.api.resource,
      query: query
    }).toPromise()
      .then((res)=> {
        let resources = [];
        let result = res;
        if (result.status === 200) {
          for (let o of result.body.records) {
            let resource = new Resource().init(o);
            resources.push(resource);
          }
        }
        return Promise.resolve(resources);
      });
  }

  /**
   * 资方银行卡
   * @param body
   * @returns Promise<{count:number,items:BankCard[]}>
   */
  capitalBankCards(body:{
    resourceId:string,//资方Id
    page?:number,
    rows?:number,
  }):Promise<{count:number,items:BankCard[]}>{
    return this.myHttp.get({
      api: this.myHttp.api.capitalBankCards,
      query: body
    }).toPromise()
      .then((res)=> {
        let result= {
          count:0,
          items:[]
        };
        if (res.status === 200) {
          for (let o of res.body.records) {
            let bc = new BankCard().init(o);
            result.items.push(bc);
          }
          result.count=res.body.paginator.totalCount;
        }
        return Promise.resolve(result);
      });
  }

}


//interfaces
export  interface SystemLogSearchParams {
  type?:number|string;//0贷款类  1还款类  2展期类
  id?: string;
  page?: number;
  rows?: number;
  status2?: number;
}
export interface BankAccountFlowBody{
  accountId?:string,//三级账户ID
  beginDate:string,//开始时间 格式：yyyy-MM-dd
  endDate:string,//结束时间 格式：yyyy-MM-dd
  flowStatus:number|string,//交易状态：0：全部1:提交成功(未明)；2:交易成功;-2:交易失败
  tradeType:number|string,//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
  page?:number,//页码
  rows?:number,//每页大小
  memberId:string,//会员Id
}
