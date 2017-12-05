import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../services/entity/Contract.entity';
import {MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
@Injectable()
export class FinanceContractService {

  constructor(private myHttp:MyHttpClient){
  }

}
