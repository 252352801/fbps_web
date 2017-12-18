import { NgModule }            from '@angular/core';
//dolphinng
import {LayoutModule,NavModule,CommonModule as MyCommonModule,FormsModule as MyFormsModule} from 'dolphinng';
import {PopService,Toaster} from 'dolphinng';
//primeng

//local

import {DictionaryService} from './services/dictionary/dictionary.service';
import {OauthService} from './services/oauth/oauth.service';
import {ParameterService} from './services/parameter/parameter.service';
import {CommonService} from './services/common/common.service';
import {LoginGuard} from './services/guard/login.guard';
import {OauthGuard} from './services/guard/oauth.guard';
import {MyInjector} from './services/myInjector/myInjector.service';


import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MyHttpClientInterceptor} from './services/myHttp/myHttpClient.interceptor';
import {MyHttp} from './services/myHttp/myhttp.service';
import {MyHttpClient} from './services/myHttp/myhttpClient.service';
@NgModule({
  imports:[
    MyCommonModule,
    MyFormsModule,
    LayoutModule,
    NavModule,
    HttpClientModule
  ],
  declarations: [

  ],
  exports:      [
    MyCommonModule,
    MyFormsModule,
    LayoutModule,
    NavModule,
    HttpClientModule
  ],
  providers: [
    MyHttp,
    MyHttpClient,
    DictionaryService,
    OauthService,
    ParameterService,
    CommonService,
    PopService,
    Toaster,

    LoginGuard,
    OauthGuard,
    MyInjector,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpClientInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule { }
