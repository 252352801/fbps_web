import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {SignInService} from './signin.service';
import {OauthService} from '../../services/oauth/oauth.service';
import {config} from '../../services/config/app.config';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.less'],
  providers: [SignInService]
})
export class SignInComponent {

  msg: string = '';
  submitted: boolean = false;
  username: string = '';//dev
  password: string = '';//123456

  systems=config.systems;
  constructor(private router: Router, private signInService: SignInService,private oauth:OauthService) {
    console.log(config.systems);
  }
  /**
   * 登录
   */
  signIn() {
    this.submitted = false;
    this.msg = '';
    if (this.username === '') {
      this.msg = '请输入用户名';
    } else if (this.password === '') {
      this.msg = '请输入密码';
    } else {
      this.submitted = true;
      let body={
        loginName: this.username,
        loginPwd: this.password,
        loginSysCode:'02'
      };
      this.signInService.signIn(body)
        .then((res)=> {
          this.submitted = false;
          if (res.ok) {
            this.oauth.saveToken(res.user.accessToken);
            this.oauth.saveUser(res.user);
            this.oauth.initRolesAndFns();
            if(res.user.expiresIn){
              this.oauth.tokenExpiry=res.user.expiresIn;
              this.oauth.refreshDelay=this.oauth.tokenExpiry/2;
            }
            this.oauth.pollingRefreshToken();
            this.router.navigate(['/home']);
          } else {
            this.msg = res.message || '用户名/密码错误!';
          }
        })
        .catch((err)=>{
          this.submitted = false;
          this.msg =  '请求失败，请重试！';
        });

    }
  }
}
