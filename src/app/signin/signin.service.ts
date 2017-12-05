import {Injectable} from '@angular/core';
import {User} from '../../services/entity/User.enity';
import {host_oauth} from '../../services/config/app.config';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';

@Injectable()
export class SignInService {

  constructor(private myHttp: MyHttpClient) {

  }

  signIn(body: {
    loginName: string,//用户名
    loginPwd: string//密码
    loginSysCode: string
  }): Promise<{status: boolean,user: User,message: string}> {
    return this.myHttp.post({
      url: host_oauth + 'oauth/login',
      body: body
    }).toPromise()
      .then((res)=> {
        let data = {
          status: false,
          user: new User(),
          message: ''
        };
        let result = res || null;
        if (result && result.status == 200) {
          data.status = true;
          data.user = data.user.init(result.body);
        }
        return Promise.resolve(data);
      });
  }
}
