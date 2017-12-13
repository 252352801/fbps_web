import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import {LayoutModule} from 'dolphinng';
import {NavModule} from 'dolphinng';

import {ContractDetailsPageComponent} from './data/contract/details/details.component';//合同详情

import {SharedModule} from './shared/shared.module';
import {SharedService} from './shared/shared.service';
import {CommonService} from '../services/common/common.service';
import {MyInjector} from './shared/myInjector.service';

import { AppComponent } from './app.component';
import { SignInComponent } from './signin/signin.component';
import { IndexComponent } from './index/index.component';
import { DemoComponent } from './demo/demo.component';
import { ModifyPasswordComponent } from './modifyPassword/modifyPassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyHttp} from '../services/myHttp/myhttp.service';
import { GlobalService} from '../services/global/global.service';
import { OauthService} from '../services/oauth/oauth.service';
import { ParameterService} from '../services/parameter/parameter.service';

import { LoginGuard } from '../services/guard/login.guard';
import { OauthGuard } from '../services/guard/oauth.guard';

import { PopService,Toaster } from 'dolphinng';

import { DictionaryService} from '../services/dictionary/dictionary.service';
import 'rxjs/add/operator/toPromise';


import {HttpClientModule} from '@angular/common/http';
import { MyHttpClient} from '../services/myHttp/myhttpClient.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MyHttpClientInterceptor} from '../services/myHttp/myHttpClient.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    IndexComponent,
    DemoComponent,
    ModifyPasswordComponent,
    ContractDetailsPageComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    NavModule
  ],
  providers: [
    MyHttp,
    MyHttpClient,
    DictionaryService,
    GlobalService,
    OauthService,
    ParameterService,
    SharedService,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){

  }
}
