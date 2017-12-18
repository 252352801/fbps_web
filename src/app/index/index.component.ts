import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import  {SettingService}  from '../core/services/setting/setting.service';
import {OauthService} from '../core/services/oauth/oauth.service';
import {User} from '../core/entity/User.enity';
import {AsideMenu} from '../core/entity/AsideMenu.entity';
import {PopService} from 'dolphinng';
import {CommonService} from '../core/services/common/common.service';


@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  providers: [SettingService, PopService]
})
export class IndexComponent implements OnInit {
  setting: SettingService;
  isFullScreen: boolean = false;
  messageCount: number = 0;
  user: User;

  asideMenus:AsideMenu[]=[];
  constructor(private settingService: SettingService,
              public oauth: OauthService,
              private pop: PopService,
              private commonSvc: CommonService,
              private router: Router) {
    this.setting = this.settingService.getSetting();
    this.setting.asideFolded=false;
    this.user = oauth.user;


  }


  ngOnInit() {
    let allMenus:AsideMenu[]= [{
      text: '待办事项',
      icon: 'glyphicon glyphicon-home',
      link: '/home/pending',
      render:this.oauth.fnIn(['02'])
    },{
      text: '业务中心',
      icon: 'glyphicon glyphicon-briefcase',
      render: this.oauth.fnIn(['04','06','07','08','09']),
      subMenus:[{
        text: '贷前管理',
        link: '/business/borrow',
        render: this.oauth.fnRequire('04'),
      },{
        text: '贷后管理',
        render: this.oauth.fnIn(['06','07','08']),
        subMenus:[{
          text: '在贷跟踪',
          link: '/business/loan/inProcess',
          render: this.oauth.fnRequire('06'),
        },{
          text: '展期管理',
          link: '/business/loan/rollover',
          render: this.oauth.fnRequire('07'),
        },{
          text: '还款管理',
          link: '/business/loan/repayment',
          render: this.oauth.fnRequire('08'),
        }]
      },{
        text: '贷款历史',
        link: '/business/history',
        render: this.oauth.fnRequire('09'),
      }]
    },{
      text: '管理中心',
      icon: 'fa fa-cogs',
      render: this.oauth.fnIn(['11','12']),
      subMenus:[{
        text: '产品管理',
        link: '/mgt/product',
        render: this.oauth.fnRequire('11'),
      },{
        text: '系统日志',
        link: '/mgt/systemLog',
        render: this.oauth.fnRequire('12'),
      }]
    },{
      text: '数据中心',
      icon: 'fa fa-database',
      render: this.oauth.fnIn(['16']),
      subMenus:[{
        text: '融资合同库',
        link: '/data/contract',
        render: this.oauth.fnRequire('16'),
      }]
    }];
    let menus=[];
    for(let fMenu of allMenus){
      if(fMenu.render){
        if(fMenu.subMenus instanceof Array) {
          let sMenus = [];
          for (let sMenu of fMenu.subMenus) {
            if (sMenu.render) {
              if(sMenu.subMenus instanceof Array) {
                let tMenus = [];
                for (let tMenu of sMenu.subMenus) {
                  if (tMenu.render) {
                    tMenus.push(tMenu);
                  }
                }
                sMenu.subMenus = tMenus;
              }
              sMenus.push(sMenu);
            }
          }
          fMenu.subMenus = sMenus;
        }
        menus.push(fMenu);
      }
    }
    this.asideMenus=menus;
    this.commonSvc.asideMenus=menus;
  }

  toggleAsideFolded() {
    this.setting.asideFolded = !this.setting.asideFolded;
  }

  toggleOffScreen() {
    this.setting.offScreen = !this.setting.offScreen;
  }

  openContent() {
    this.setting.offScreen = false;
  }

  fullScreen() {
    let docElm = document.documentElement;
    if (docElm.requestFullscreen) {//W3C
      docElm.requestFullscreen();
    } else if (docElm['mozRequestFullScreen']) {//FireFox
      docElm['mozRequestFullScreen']();
    } else if (docElm['webkitRequestFullScreen']) {//Chrome等
      docElm['webkitRequestFullScreen']();
    } else if (docElm['msRequestFullscreen']) {//IE11
      docElm['msRequestFullscreen']();
    }
    this.isFullScreen = true;
  }

  cancelFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    }
    else if (document['webkitCancelFullScreen']) {
      document['webkitCancelFullScreen']();
    }
    else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    }
    this.isFullScreen = false;
  }

  logout() {
    this.pop.confirm({
      text: '确定要退出登录吗？'
    }).onConfirm(()=> {
      this.commonSvc.signOut({
        employeeId:this.oauth.user.employeeId
      }).then((res)=>{
        if(res.ok) {
          this.oauth.removeToken();
          this.oauth.removeUser();
        }
        this.router.navigate(['/signin']);
      }).catch((err)=>{
        this.router.navigate(['/signin']);
      });

    });
  }
}
