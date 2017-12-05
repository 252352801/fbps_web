import {Injectable} from '@angular/core';
import {AcceptRepaymentBody} from './shared/AcceptRepaymentBody';
import {MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class AcceptService {
  constructor(private myHttp: MyHttpClient) {

  }
  acceptRepayment(body:AcceptRepaymentBody): Promise<{ok: boolean,message: string}> {
    return this.myHttp.post({
      api:this.myHttp.api.acceptRepayment,
      query:body
    }).toPromise()
      .then((res)=>{
        let result={ok:false,message:''};
        result.ok=(res.status==200);
        result.message=res.message;
        return Promise.resolve(result);
      });
  }
}
