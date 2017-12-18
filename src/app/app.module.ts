import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { SignInComponent } from './signin/signin.component';
import { IndexComponent } from './index/index.component';
import { ModifyPasswordComponent } from './modifyPassword/modifyPassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'rxjs/add/operator/toPromise';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    IndexComponent,
    ModifyPasswordComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CoreModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){

  }
}
