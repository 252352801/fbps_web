import {Injectable} from '@angular/core';
import { RepaymentNotify} from '../../../../../services/entity/RepaymentNotify.entity';
import { MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
@Injectable()
export class RepayService{
  constructor(private myHttp:MyHttpClient){

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

  createRepaymentNotify(body: {
    borrowApplyId: string,//贷款单号
    memberId: string,//会员Id
    repaymentPlan: number,//还款期数
    repaymentDate: string,//还款时间
    repaymentAmount: number//还款金额
  }): Promise<{status: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.createRepaymentNotify,
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

}
