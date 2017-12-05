import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class RepaymentDetailsService  {
  constructor(private myHttp: MyHttpClient) {

  }
}
