import {Injectable} from '@angular/core';
import { Loan} from '../../../services/entity/Loan.entity';
import { Product} from '../../../services/entity/Product.entity';
import { MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
import { RepayPlan} from '../../../services/entity/RepayPlan.entity';
import { Contract} from '../../../services/entity/Contract.entity';
@Injectable()
export class DetailsService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询贷款申请列表
   */
  loadProducts(query?:any):Promise<Product[]>{

    return this.myHttp.post({
      api:this.myHttp.api.productList,
      query:query
    }).toPromise()
      .then((res)=>{
        let prods=[];
        let result=res;
        if(result.status===200){
          let prod=new Product();
          prods.push(prod);
        }
        return Promise.resolve(prods);
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

  getRepayPlanList(borrowApplyId:string):Promise<RepayPlan[]>{
    return this.myHttp.get({
      api:this.myHttp.api.repayPlanList,
      query:{
        borrowApplyId:borrowApplyId
      }
    }).toPromise()
      .then((res)=>{
        let data=[];
        let result=res;
        if(result.status===200){
          for(let o of result.body.records){
            let rp=new RepayPlan().initByObj(o);
            data.push(rp);
          }
        }
        return Promise.resolve(data);
      });
  }

  loadContracts(body:{
    companyName?:string,
    borrowApplyId?:string,
    page?:number,
    rows?:number
  }):Promise<{count:number,items:Contract[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.contractList,
      body:body
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
