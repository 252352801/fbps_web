import {Injectable} from '@angular/core';
import {Loan} from '../../../../../services/entity/Loan.entity';
import {RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class CAVService {
  constructor(private myHttp: MyHttpClient) {

  }

  getLoanById(id: string): Promise<Loan> {
    return this.myHttp.get({
      api: this.myHttp.api.loanDetail,
      query: {
        borrowApplyId: id
      }
    }).toPromise()
      .then((res)=> {
        let loan = new Loan();
        let result = res;
        if (result.status === 200) {
          loan.initByObj(result.body);
        }
        return Promise.resolve(loan);
      });

  }

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

  checkRepayment(body:{
    status:number|string,
    repaymentNotifyId:string,
    repaymentId:string,
    accountRepaymentWay:number|string,
    toAccountId:string,
    toAccountName:string,
    operator:string
  }): Promise<{status: boolean,message: string}> {
    return this.myHttp.post({
      api:this.myHttp.api.checkRepayment,
      query:body
    }).toPromise()
      .then((res)=>{
        let data={status:false,message:''};
        let result=res;
        if(result.status==200){
          data.status=true;
        }else{
          data.message=result.message;
        }
        return Promise.resolve(data);
      });
  }
}
