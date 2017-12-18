import { Component,OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { CommonService} from '../core/services/common/common.service';
import { Toaster} from 'dolphinng';
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit{

  constructor(
    private commonSvc:CommonService,
    private toaster:Toaster,
    private router:Router
  ){

  }

  ngOnInit(){
    let permission=false;
    loop:
      for(let fMenu of this.commonSvc.asideMenus){
        if(fMenu.link){
          permission=true;
          this.router.navigate([fMenu.link]);
          break;
        }else{
          if(fMenu.subMenus instanceof Array){
            for(let sMenu of fMenu.subMenus){
              if(sMenu.link){
                permission=true;
                this.router.navigate([sMenu.link]);
                break loop;
              }else{
                if(sMenu.subMenus instanceof Array){
                  for(let tMenu of sMenu.subMenus){
                    if(tMenu.link){
                      permission=true;
                      this.router.navigate([tMenu.link]);
                      break loop;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if(!permission){
        this.toaster.error('','您没有使用此系统的权限！');
        this.router.navigate(['/signin']);
      }

  }
}
