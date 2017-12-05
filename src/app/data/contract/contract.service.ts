import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ContractService {

  constructor(private myHttp:MyHttpClient){
  }
}
