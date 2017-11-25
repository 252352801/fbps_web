import {Injectable} from '@angular/core';
import {OauthService} from '../oauth/oauth.service';
import {Toaster} from 'dolphinng';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class LoginGuard implements CanActivate{
  constructor(
    private oauth:OauthService,
    private toaster:Toaster,
    private router:Router
  ){

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>| boolean|Promise<boolean>{
    let isSigIn=this.oauth.isSignIn();
    if(!isSigIn){
      this.toaster.error('','请先登录！');
      this.router.navigate(['/signin']);
    }
     return isSigIn;
  }
}
