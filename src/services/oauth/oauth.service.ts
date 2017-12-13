import {Injectable}     from '@angular/core';
import {User}   from '../entity/User.enity';
import {CookieService} from 'ng2-cookies';
import {MyHttp} from '../myHttp/myhttp.service';

@Injectable()
export class OauthService {

  user:User=new User();
  token:string='';

  public roles:string[]=[];
  public fns:string[]=[];
  private cookie:CookieService=new CookieService();
  private savePath:string='/';
  public refreshDelay=1800000;//刷新延时
  public tokenExpiry=3600000;//过期时间

  private storeName={
    token:'fbps_accessToken',
    user:'fbps_user',
  };
  constructor(
    private myHttp:MyHttp
  ){
    let savedToken=this.cookie.get(this.storeName.token);
    if(savedToken){
      this.token=savedToken;
    }
    try{
      let savedUser=JSON.parse(localStorage.getItem(this.storeName.user));
      if(savedUser&&savedUser.accessToken===this.token) {
        this.user = new User().init(savedUser);
        this.initRolesAndFns();
      }
    }catch (err){
    }
  }

  isSignIn():boolean{
    return this.token&&this.token===this.user.accessToken;
  }

  initRolesAndFns(){
    if(this.user&&this.user.subsysFuncs instanceof Array){
      this.fns=[];
      let systemCode='';
      if(this.user.subsystem){
        systemCode=this.user.subsystem.subsystemCode;
      }
      for(let o of this.user.subsysFuncs){
        if(o.subsystemCode===systemCode) {
          this.fns.push(o.functionPoint);
        }
      }
    }
    if(this.user&&this.user.roles instanceof Array){
      this.roles=[];
      for(let o of this.user.roles){
        this.roles.push(o.roleCode);
      }
    }
  }

  saveToken(token?:string){
    if(token){
      this.token=token;
    }
    this.cookie.set(this.storeName.token,this.token,this.tokenExpiry,this.savePath);
  }
  saveUser(user?:User){
    if(user){
      this.user=user;
    }
    localStorage.setItem(this.storeName.user,JSON.stringify(this.user));
    //this.cookie.set('user',JSON.stringify(this.user),this.tokenExpiry,this.savePath);
  }

  removeToken(){
    this.token='';
    this.cookie.set(this.storeName.token,'');
    this.cookie.delete(this.storeName.token);
  }
  removeUser(){
    this.user=null;
    localStorage.removeItem(this.storeName.user);
  }

  pollingRefreshToken(){
    setTimeout(()=>{
      let token=this.token;
      if(token){
        this.myHttp.get({
          api:this.myHttp.api.refreshToken,
          query:{
            accessToken:token
          }
        }).toPromise()
          .then((res)=>{
            let isSuccess=res.ok;
            if(isSuccess){
              let response=res.json();
              if(response.status==200){
                this.saveToken(response.body.accessToken);
                this.saveUser();
              }
            }
            this.pollingRefreshToken();
          });
      }
    },this.refreshDelay);
  }


  fnIn(param:string[]):boolean{
    for(let o of param){
      if(this.fns.indexOf(o)>=0){
        return true;
      }
    }
    return false;
  }

  fnRequire(param:string[]|string):boolean{
    if(param instanceof Array) {
      for (let o of param) {
        if (this.fns.indexOf(o) === -1) {
          return false;
        }
      }
    }else if(typeof param==='string'){
      if (this.fns.indexOf(param) === -1) {
        return false;
      }
    }
    return true;
  }

  roleIn(param:string[]):boolean{
    for(let o of param){
      if(this.roles.indexOf(o)>=0){
        return true;
      }
    }
    return false;
  }

  roleRequire(param:string[]|string):boolean{
    if(param instanceof Array) {
      for(let o of param){
        if(this.roles.indexOf(o)===-1){
          return false;
        }
      }
    }else if(typeof param==='string'){
      if (this.roles.indexOf(param) === -1) {
        return false;
      }
    }
    return true;
  }

}
