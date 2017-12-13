import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
@Injectable()
export class LineSwitchService {

  constructor(
    private myHttp: MyHttpClient
  ) {

  }

  /**
   * 验证是否开户
   * @param memberId
   * @returns Promise<boolean>
   */
  checkExist(memberId:string):Promise<boolean>{
    return this.myHttp.get({
      api:this.myHttp.api.checkIsUserSignUp,
      query:{
        memberId:memberId
      }
    }).toPromise()
      .then((res)=>{
        return res&&res.status==200&&res.body.isExist&&res.body.isExist!='false';
      })
  }

}
