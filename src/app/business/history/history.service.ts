import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../core/services/myHttp/myhttpClient.service';
@Injectable()
export class HistoryService{
  constructor(private myHttp:MyHttpClient){

  }
}

