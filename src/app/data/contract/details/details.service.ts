import { Component,Injectable} from '@angular/core';
import { Contract} from '../../../core/entity/Contract.entity';
import { Signature} from '../../../core/entity/Signature.entity';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
@Injectable()
export class ContractDetailsService {

  constructor(private myHttp:MyHttpClient){
  }
}
