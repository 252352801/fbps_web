import { Component } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {MyInjector} from "./core/services/myInjector/myInjector.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers:[]
})
export class AppComponent {
  constructor(
    private myInjector: MyInjector,
    private actRoute: ActivatedRoute,
    private titleSvc: Title,
    private router: Router
  ){
    this.subscribeRouterChange();
  }
  private subscribeRouterChange() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.actRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')  // 过滤出未命名的outlet，<router-outlet>
      //.mergeMap(route => route.data)                // 获取路由配置数据
      .subscribe((event) => {
        {
          if(document.documentElement){
            document.documentElement.scrollTop=0;
          }else if(document.body){
            document.body.scrollTop=0;
          }
        }
        let route = event;
        //this.titleSvc.setTitle(route.snapshot.data['title']);
      });
  }

}
