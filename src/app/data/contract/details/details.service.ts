import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../../services/entity/Contract.entity';
import { Signature} from '../../../../services/entity/Signature.entity';
import {MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ContractDetailsService {

  constructor(private myHttp:MyHttpClient){
  }
}
