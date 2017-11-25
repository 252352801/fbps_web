import {Injectable} from '@angular/core';
import {Rollover} from '../../../../services/entity/Rollover.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { Loan} from '../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../services/entity/RepayPlan.entity';
import { Product} from '../../../../services/entity/Product.entity';
@Injectable()
export class RolloverService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询展期申请列表
   */
  queryLoans(query:any):Promise<{count:number,items:Rollover[]}>{

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
            let rollover=new Rollover().initByObj(o);
            data.items.push(rollover);
          }
        }
        return Promise.resolve(data);
      });

  }

  getRolloverById(id:string):Promise<Rollover>{
    return this.myHttp.get({
      api:this.myHttp.api.rollover,
      query:{
        rolloverApplyId:id
      }
    }).toPromise()
      .then((res)=>{
        let rollover=new Rollover();
        let result=res;
        if(result.status===200){
          rollover.initByObj(result.body);
        }
        return Promise.resolve(rollover);
      });
  }
  getLoanById(id:string):Promise<Loan>{
    return this.myHttp.get({
      api:this.myHttp.api.loanDetail,
      query:{
        borrowApplyId:id
      }
    }).toPromise()
      .then((res)=>{
        let loan=new Loan();
        let result=res;
        if(result.status===200){
          loan.initByObj(result.body);
        }
        return Promise.resolve(loan);
      });

  }
  approve(body:{
    rolloverApplyId:string,
    status:number,
    remarks:string,
    auditOneBy:string
  }):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.approveRollover,
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

  /**
   * 还款计划
   * @param borrowApplyId
   * @returns {promise.Promise<R>|promise.Promise<any>|PromiseLike<Array>|Promise<Array>|promise.Promise<Promise<Array>>|Promise<Promise<Array>>|any}
   */
  getRepayPlans(borrowApplyId: string): Promise<RepayPlan[]> {
    let promise = (pageSize?: number)=> {
      return this.myHttp.get({
        api: this.myHttp.api.repayPlanList,
        query: {
          rows: pageSize || null,
          borrowApplyId: borrowApplyId
        }
      }).toPromise()
        .then((res)=> {
          let repayPlans = [];
          let result = res;
          if (result.status === 200) {
            for (let o of result.body.records) {
              let repayPlan = new RepayPlan().initByObj(o);
              repayPlans.push(repayPlan);
            }
          }
          return Promise.resolve(repayPlans);
        });
    };
    return promise();
  }


  /**
   * 查询产品详情
   */
  getProductById(id:string):Promise<Product>{

    return this.myHttp.post({
      api:this.myHttp.api.product,
      query:{
        productId:id
      }
    }).toPromise()
      .then((res)=>{
        let product=new Product();
        let result=res;
        if(result.status===200){
          product.initByObj(result.body);
        }
        return Promise.resolve(product);
      });
  }

  mul(a,b):number|string{
    if(a!==undefined&&b!==undefined){
      return a*b;
    }
    return '';
  }
}
