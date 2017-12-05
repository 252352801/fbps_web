import {Injectable} from '@angular/core';
import {OauthService} from '../oauth/oauth.service';
import {Toaster} from 'dolphinng';
import {PopService} from 'dolphinng';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class OauthGuard implements CanActivate {
  constructor(private oauth: OauthService,
              private toaster: Toaster,
              private pop: PopService,
              private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>| boolean|Promise<boolean> {
    let canActivate = true;
    let data=route.routeConfig.data;
    if (data&&typeof data === 'object') {
      //功能判断
      if ((data['fnIn'] instanceof Array) || (typeof data['fnIn'] === 'string')) {
        canActivate = this.oauth.fnIn(data['fnIn']);
      } else if ((data['fnRequire'] instanceof Array) || (typeof data['fnRequire'] === 'string')) {
        canActivate = this.oauth.fnRequire(data['fnRequire']);
      }
      //角色判断
      if((data['roleIn'] instanceof Array) || (typeof data['roleIn'] === 'string')){
        canActivate = this.oauth.roleIn(data['roleIn']);
      }else if ((data['roleRequire'] instanceof Array) || (typeof data['roleRequire'] === 'string')) {
        canActivate = this.oauth.roleRequire(data['roleRequire']);
      }
    }
    if (!canActivate) {
      this.toaster.error('','您没有进入该页面的权限！')
    }
    return canActivate;
  }
}
