import {Component,ViewChild, Input, Output, EventEmitter, OnInit,ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {LineSwitchService} from './line-switch.service';
import {ModalComponent,Toaster} from 'dolphinng';
@Component({
  selector: 'line-switch',
  templateUrl: './line-switch.component.html',
  styleUrls: ['./line-switch.component.less'],
  providers: [LineSwitchService]
})
export class LineSwitchComponent implements OnInit{


  id:string='';
  memberId:string='';
  valid:boolean=false;
  @Input() type:number|string=0;//0:放款 1:还款
  @ViewChild('modal') modal:ModalComponent;
  loading:boolean=false;
  constructor(
    private lineSwitchSvc: LineSwitchService,
    private toaster: Toaster,
    public router: Router
  ) {

  }


  ngOnInit(){

  }
  reset(){
    this.valid=false;
    this.id='';
    this.memberId='';
    this.memberId='';
    this.loading=false;
  }
  open(...args){
    this.reset();
    if(args){
      if(args.length>0){
        this.id=args[0];
      }
      if(args.length>1){
        this.memberId=args[1];
      }
    }
    if(this.memberId){
      this.loading=true;
      this.lineSwitchSvc.checkExist(this.memberId)
        .then((res)=>{
          this.loading=false;
          this.valid=res;
        })
        .catch((err)=>{
          this.loading=false;
          this.valid=false;
        })
    }else{
      this.valid=true;
    }
    this.modal.open();
  }

  navigate(url:string){
    if(!this.loading){
      if(this.valid){
        this.router.navigate([url]);
      }else{
        let str='无法“线上'+(this.type==0?'放款':'还款')+'”';
        this.toaster.error('该会员未开通电子账户，'+str+'!');
      }
    }else{
      this.toaster.error('正在验证是否开户...');
    }
  }
}


