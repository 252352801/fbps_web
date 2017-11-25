import {Injectable} from '@angular/core';
import { Loan} from '../../../../services/entity/Loan.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { RepayPlan} from '../../../../services/entity/RepayPlan.entity';
@Injectable()
export class InProcessService{
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
        let result=res;
        if(result.status===200){
          data.count=result.body.paginator.totalCount;
          for(let l of result.body.records){
            let loan=new Loan();
            loan.initByObj(l);
            data.items.push(loan);
          }
        }
        return Promise.resolve(data);
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


}
