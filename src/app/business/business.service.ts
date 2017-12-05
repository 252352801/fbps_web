import {Injectable} from '@angular/core';
import { Loan} from '../../services/entity/Loan.entity';
import { RepayPlan} from '../../services/entity/RepayPlan.entity';
import { ProveData} from '../../services/entity/ProveData.entity';
import { LoanFlow} from '../../services/entity/LoanFlow.entity';
import { MyHttpClient} from '../../services/myHttp/myhttpClient.service';
import { QueryLoansBody} from './shared/QueryLoansBody';

@Injectable()
export class BusinessService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 查询贷款申请列表
   */
  queryLoans(query:QueryLoansBody):Promise<{count:number,items:Loan[]}>{
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
            if(l) {
              let loan = new Loan().init(l);
              data.items.push(loan);
            }
          }
        }
        return Promise.resolve(data);
      });

  }

  /**
   * 通过id获取借款单
   * @param id
   * @returns Promise<Loan>
   */
  getLoanById(id:string):Promise<Loan>{
    return this.myHttp.get({
      api:this.myHttp.api.loanDetail,
      query:{
        borrowApplyId:id
      }
    }).toPromise()
      .then((res)=>{
        let loan=new Loan();
        if(res.status===200){
          loan.init(res.body);
        }
        return Promise.resolve(loan);
      });

  }

  /**
   * 通过借款单ID获取借款单证明材料
   * @param borrowApplyId
   * @returns Promise<ProveData[]
   */
  getLoanProveData(borrowApplyId:string):Promise<ProveData[]>{
    return this.myHttp.post({
      api:this.myHttp.api.loanProveData,
      body:{
        borrowApplyId:borrowApplyId
      }
    } ).toPromise()
      .then((res)=>{
        let items:ProveData[]=[];
        if(res.status==200){
          for(let o of res.body.records){
            let pd = ProveData.create(o);
            items.push(pd);
          }
        }
        return Promise.resolve(items);
      });
  }

  /**
   * 通过借款单ID获取还款计划
   * @param borrowApplyId
   * @returns  Promise<RepayPlan[]>
   */
  getRepayPlans(borrowApplyId: string): Promise<RepayPlan[]> {
    return this.myHttp.post({
      api: this.myHttp.api.repayPlanList,
      body: {
        borrowApplyId: borrowApplyId
      }
    }).toPromise()
      .then((res)=> {
        let repayPlans = [];
        if (res.status === 200) {
          for (let o of res.body.records) {
            let repayPlan = new RepayPlan().init(o);
            repayPlans.push(repayPlan);
          }
        }
        return Promise.resolve(repayPlans);
      });
  }

}
