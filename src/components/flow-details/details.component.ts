import {Component,ViewChild,Input,OnInit,OnChanges,SimpleChanges} from '@angular/core';
import {FlowDetailsService} from './details.service';
import {fadeInAnimation} from '../../animations/index';
import {CommonService} from '../../services/common/common.service';
import { Flow} from '../../services/entity/Flow.entity';



import { ModalComponent} from 'dolphinng';
@Component({
  selector: 'flow-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  providers: [FlowDetailsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class FlowDetailsComponent implements OnInit,OnChanges{

  @Input() mode:number=0;//0 默认  1弹出框
  loading: boolean = false;//是否在加载
  flow:Flow=new Flow();
  @Input() data:any;
  @ViewChild('contentModal') contentModal:ModalComponent;
  constructor(
    private flowDetailsSvc:FlowDetailsService,
    private commonSvc:CommonService
  ) {
  }

  ngOnInit(){
   // this.init();
  }
  ngOnChanges(changes:SimpleChanges){
    if(this.mode==0) {
      let dataChg = changes['data'];
      if (dataChg && dataChg.currentValue !== dataChg.previousValue) {
        this.initByData(dataChg.currentValue);
      }
    }
  }

  open(data?:any){
    if(data){
      this.initByData(data);
    }
    this.contentModal.open();
  }

  initByData(data:any){
    if(data&&typeof data==='string'){
      this.loading=true;
      this.commonSvc.flow(data)
        .then((res)=>{
          this.loading=false;
          this.flow=res;
        })
        .catch((err)=>{
          this.loading=false;
        });
    }else if(data&&data==='object'){
      this.flow=Flow.create(data);
    }
  }

}
