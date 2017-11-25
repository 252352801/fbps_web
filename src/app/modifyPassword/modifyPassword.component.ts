import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {OauthService} from '../../services/oauth/oauth.service';
import {ModifyPasswordService} from './modifyPassword.service';
import {PopService} from 'dolphinng';
@Component({
  selector: 'modify-password',
  templateUrl: './modifyPassword.component.html',
  styleUrls: ['./modifyPassword.component.less'],
  providers: [ModifyPasswordService,PopService]
})
export class ModifyPasswordComponent {

  employeeId:string='';

  oldPassword:string='';
  newPassword:string='';
  newPasswordCopy:string='';

  submitted:boolean=false;
  constructor(
    private oauth: OauthService,
    private pop: PopService,
    private modifyPWSvc: ModifyPasswordService,
    private router: Router
  ) {
    this.employeeId=this.oauth.user.employeeId;
  }

  submit(){
    this.submitted=true;
    let body={
      employeeId:this.employeeId,
      oldPwd:this.oldPassword,
      pwd:this.newPassword,
      type:1
    };
    this.modifyPWSvc.setPassword(body)
      .then((res)=>{
        this.submitted=false;
        if(res.ok){
          this.pop.info({text:'修改成功！'})
            .onConfirm(()=>{
              // history.back();
              this.oauth.removeToken();
              this.oauth.removeUser();
              this.router.navigate(['/signin']);
            }).onClose(()=>{
            // history.back();
            this.oauth.removeToken();
            this.oauth.removeUser();
            this.router.navigate(['/signin']);
          });
        }else{
          this.pop.error({text:res.message||'修改密码失败！'});
        }
      })
      .catch((err)=>{
        this.submitted=false;
        this.pop.error({text:'请求失败！'});
      })
  }

}
