import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class RepayService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 生成还款通知单
   * @param body
   * @returns Promise<{ok: boolean,message: string}>
   */
  createRepaymentNotify(body: {
    borrowApplyId: string,//贷款单号
    memberId: string,//会员Id
    currentPeriod: number,//还款期数
    repaymentDate: string,//还款时间
    repaymentAmount: number//还款金额
  }): Promise<{ok: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.createRepaymentNotify,
      query: body
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          message: ''
        };
        let result = res;
        data.ok = (result.status == 200);
        data.message = result.message;
        return Promise.resolve(data);
      });
  }

}
