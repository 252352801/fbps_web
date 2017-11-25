import {Injectable} from '@angular/core';
import { Loan} from '../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../services/entity/RepayPlan.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
import {Contract} from "../../../../services/entity/Contract.entity";
import {Resource} from '../../../../services/entity/Resource.entity';
import {BankCard} from '../../../../services/entity/BankCard.entity';
import {RepayPlanPreview} from '../../../../services/entity/RepayPlanPreview.entity';
@Injectable()
export class BorrowLoanService{
  constructor(
    private myHttp:MyHttpClient,
    private borrowSvc:BorrowService
  ){

  }
  getLoanById(id:number):Promise<Loan>{
    return this.borrowSvc.getLoanById(id);

  }

  loadContracts(body?:{
    companyName?:string,
    borrowApplyId?:string,
    page?:number,
    rows?:number
  }):Promise<{count:number,items:Contract[]}>{
    return this.borrowSvc.loadContracts(body)
  }

  /**
   * 放款
   * @param body
   * @returns {wdpromise.Promise<T>|Promise<Promise<{status: boolean, message: string}>>|wdpromise.Promise<any>|promise.Promise<any>|Promise<{status: boolean, message: string}>|IPromise<{status: boolean, message: string}>|any}
   */
  loan(body:any):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.loanPay,
      query:body
    }).toPromise()
        .then((res)=>{
          let data={
            status:false,
            message:''
          };
          let result=res;
          data.status=(result.status==200);
          data.message=result.message;
          return Promise.resolve(data);
        });
  }

  loadRepayPlans(borrowApplyId:string):Promise<RepayPlan[]>{
    return this.myHttp.get({
      api:this.myHttp.api.repayPlanList,
      query:{
        borrowApplyId:borrowApplyId
      }
    }).toPromise()
      .then((res)=>{
        let data=[];
        let result=res;
        if(result.status==200){
          for(let o of result.body.records){
            let rp=new RepayPlan().initByObj(o);
            data.push(rp);
          }
        }
        return Promise.resolve(data);
      });
  }

  loadResources(resourceType:number): Promise<Resource[]> {
    return this.borrowSvc.loadResources(resourceType);
  }

  groupContractsByCapitalId(contracts:Contract[]):{capitalId:string,contracts:Contract[]}[]{
    let map={};
    for(let o of contracts){
      if(!map[o.capitalId]){
        map[o.capitalId]={
          items:[]
        };
      }
      map[o.capitalId].items.push(o);
    }
    let result:{capitalId:string,contracts:Contract[]}[]=[];
    for(let o in map){
      result.push({
        capitalId:o,
        contracts:map[o].items
      });
    }
    return result;
  }

  approveLoan(body: any): Promise<{status: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.loanReview,
      query: body
    }).toPromise()
      .then((res)=> {
        let data = {
          status: false,
          message: ''
        };
        let result = res;
        data.status = (result.status == 200);
        data.message = result.message;
        return Promise.resolve(data);
      });
  }
  getBankCard(query:{
    memberId:string,
    type:number
  }):Promise<{ok: boolean,data: BankCard}>{
    return this.myHttp.get({
      api: this.myHttp.api.getBankCard,
      query: query
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          data:null
        };
        let result = res;
        let bk=new BankCard();
        data.ok = (result.status == 200);
        data.data = bk.initByObj(result.body);
        return Promise.resolve(data);
      });
  }
  createRepayPlanPreview(body: any): Promise<RepayPlanPreview[]>{
    return this.myHttp.post({
      api: this.myHttp.api.createRepayPlanPreview,
      query: body
    }).toPromise()
      .then((res)=> {
        let data =[];
        let result = res;
        if(result.status==200){
          for(let o of result.body.records){
            let repayPlanPreview=new RepayPlanPreview().initByObj(o);
            data.push(repayPlanPreview);
          }
        }
        return Promise.resolve(data);
      });
  }
}
