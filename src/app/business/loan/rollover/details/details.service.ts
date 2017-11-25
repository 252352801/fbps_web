import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class RolloverDetailsService{
  constructor(private myHttp:MyHttpClient){

  }
}
