import {Component,ViewChild,Input,OnInit,OnChanges,SimpleChanges} from '@angular/core';
import {RepayPlansService} from './repay-plans.service';
import {fadeInAnimation} from '../../animations/index';
import {CommonService} from '../../services/common/common.service';
import { OauthService} from '../../services/oauth/oauth.service';
import {RepayPlan} from '../../services/entity/RepayPlan.entity';


import { ModalComponent} from 'dolphinng';
@Component({
  selector: 'repay-plans',
  templateUrl: './repay-plans.component.html',
  styleUrls: ['./repay-plans.component.less'],
  providers: [RepayPlansService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RepayPlansComponent implements OnInit,OnChanges{

  @Input() mode:number=0;//0 默认  1弹出框
  loading: boolean = false;//是否在加载
  repayPlans:RepayPlan[]=[];
  @Input() data:any;

  @Input() isCurrentPeriod:boolean=true;//是否显示-还款期数
  @Input() isRepaymentDate:boolean=true;//是否显示-计划还款日期
  @Input() isRepaymentRelDate:boolean=false;//是否显示-实际还款日期
  @Input() isRepaymentCapital:boolean=true;//是否显示-还款本金
  @Input() isRepaymentInterest:boolean=true;//是否显示-还款利息
  @Input() isOverdueInterest:boolean=true;//是否显示-逾期罚息
  @Input() isRepaymentAmount:boolean=true;//是否显示-应还总额
  @Input() isTotalRelAmount:boolean=false;//是否显示-累计已还金额
  @Input() isStatus:boolean=true;//是否显示-状态
  @Input() isBtnDetail:boolean=false;//是否显示-详情按钮
  @Input() isBtnRepay:boolean=false;//是否显示-还款按钮
  @Input() isBtnRollover:boolean=false;//是否显示-展期
  @ViewChild('contentModal') contentModal:ModalComponent;
  constructor(
    private repayPlansSvc:RepayPlansService,
    private oauth:OauthService
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
      this.repayPlansSvc.repayPlans(data)
        .then((res)=>{
          this.loading=false;
          this.repayPlans=res;
        })
        .catch((err)=>{
          this.loading=false;
        });
    }else if(data&&data==='object'){
      this.repayPlans=data;
    }
  }

}
