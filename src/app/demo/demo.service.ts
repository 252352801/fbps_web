import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';

@Injectable()
export class DemoService {

  constructor(private myHttp: MyHttpClient) {

  }

}
