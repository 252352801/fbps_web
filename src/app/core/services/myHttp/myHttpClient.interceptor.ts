import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {OauthService} from '../oauth/oauth.service';
import {Toaster} from 'dolphinng';
import {serializeURLParams} from './myhttpClient.service';

import {HttpResponse}     from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
@Injectable()
export class MyHttpClientInterceptor implements HttpInterceptor {
  private toaster: Toaster = new Toaster();

  constructor(
    private oauth: OauthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = this.oauth.token;
    const authReq = req.clone({
      headers: req.headers
        .set('accessToken', authHeader)
        .set('Content-Type', 'application/x-www-form-urlencoded'),
      body: serializeURLParams(req.body)
    });
    return next.handle(authReq)
      .do(event => {
        if (event instanceof HttpResponse) {
          if (event.ok) {
            let body = event.body;
            if (typeof body === 'object') {
              if (body.status == '411') {
                if(!this.router.isActive('/signin',false)){
                  this.toaster.error('', '您的操作已超时，请重新登录！');
                  this.router.navigate(['/signin']);
                }
              }
            }
          }
        }
      })/*.filter(event => {
        if (event instanceof HttpResponse) {
          if (event.ok) {
            let body = event.body;
            if (typeof body === 'object') {
              if (body.status == '411') {
                return false;
              }
            }
          }
        }
        return true;
      })*/;
  }
}
