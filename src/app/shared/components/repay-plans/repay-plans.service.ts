import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import {RepayPlan} from '../../../core/entity/RepayPlan.entity';
@Injectable()
export class RepayPlansService {

  constructor(private myHttp:MyHttpClient){
  }

  /**
   * 通过借款单ID获取还款计划
   * @param borrowApplyId
   * @returns  Promise<RepayPlan[]>
   */
  repayPlans(borrowApplyId: string): Promise<RepayPlan[]> {
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
