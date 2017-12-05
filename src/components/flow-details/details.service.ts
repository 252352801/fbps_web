import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
@Injectable()
export class FlowDetailsService {

  constructor(private myHttp:MyHttpClient){
  }
}
