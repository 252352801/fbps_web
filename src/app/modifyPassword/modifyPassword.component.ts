import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {OauthService} from '../core/services/oauth/oauth.service';
import {ModifyPasswordService} from './modifyPassword.service';
import {PopService} from 'dolphinng';
@Component({
  selector: 'modify-password',
  templateUrl: './modifyPassword.component.html',
  styleUrls: ['./modifyPassword.component.less'],
  providers: [ModifyPasswordService,PopService]
})
export class ModifyPasswordComponent {
  type:number=1;//类型  1:修改密码 2:修改审核口令
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
    //根据路由判定修改类型
    if(this.router.isActive('/modifyPassword',false)){
      this.type=1;
    }else if(this.router.isActive('/modifyReviewPassword',false)){
      this.type=2;
    }
  }

  successAction(){
    if(this.type===1) {
      this.oauth.removeToken();
      this.oauth.removeUser();
      this.router.navigate(['/signin']);
    }else if(this.type===2){
      history.back();
    }
  }

  submit(){
    this.submitted=true;
    let body={
      employeeId:this.employeeId,
      oldPwd:this.oldPassword,
      pwd:this.newPassword,
      type:this.type
    };
    this.modifyPWSvc.setPassword(body)
      .then((res)=>{
        this.submitted=false;
        if(res.ok){
          this.pop.info({text:'修改成功！'})
            .onConfirm(()=>{
              this.successAction();
            }).onClose(()=>{
            this.successAction();
          });
        }else{
          this.pop.error({text:res.message||'修改失败！'});
        }
      })
      .catch((err)=>{
        this.submitted=false;
        this.pop.error({text:'请求失败！'});
      })
  }

}
