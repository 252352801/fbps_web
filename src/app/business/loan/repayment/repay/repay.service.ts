import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class RepayService{
  constructor(private myHttp:MyHttpClient){

  }
  createRepaymentNotify(body: {
    borrowApplyId: string,//贷款单号
    memberId: string,//会员Id
    currentPeriod: number,//还款期数
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
