import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
import {SharedService} from '../../app/shared/shared.service';
@Injectable()
export class PreviewOrDownloadButtonService {

  constructor(
    private myHttp: MyHttpClient,
    private sharedSvc: SharedService
  ) {

  }


}
