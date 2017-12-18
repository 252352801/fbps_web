import {Injectable} from '@angular/core';
import {User} from '../core/entity/User.enity';
import {MyHttpClient} from '../core/services/myHttp/myhttpClient.service';

@Injectable()
export class SignInService {

  constructor(private myHttp: MyHttpClient) {
  }

  /**
   * 登录
   * @param body
   * @returns Promise<{ok: boolean,user: User,message: string}>
   */
  signIn(body: {
    loginName: string,//用户名
    loginPwd: string//密码
    loginSysCode: string
  }): Promise<{ok: boolean,user: User,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.signIn,
      body: body
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          user: new User(),
          message: ''
        };
        if (res && res.status == 200) {
          data.ok = true;
          data.user = data.user.init(res.body);
        }
        return Promise.resolve(data);
      });
  }
}
