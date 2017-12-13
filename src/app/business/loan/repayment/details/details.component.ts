import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { RepaymentDetailsService} from './details.service';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {RepaymentNotify} from "services/entity/RepaymentNotify.entity";
import {RepaymentService} from '../repayment.service';
import {BusinessService} from '../../../business.service';
import {RepaymentFlow} from "../../../../../services/entity/RepaymentFlow.entity";
import {CommonService} from '../../../../../services/common/common.service';
@Component({
  selector: 'repayment-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  providers:[PopService,RepaymentDetailsService,RepaymentService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RepaymentDetailsComponent implements OnInit{
  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  loan: Loan = new Loan();//贷款详情
  submitted: boolean = false;//是否在提交
  repaymentPlans: RepayPlan[]=[];//还款计划列表
  repayPlan:RepayPlan;//当前还款计划
  operator: string = this.oauthSvc.user.employeeName|| this.oauthSvc.user.mobile;//操作者

  repaymentFlows:RepaymentFlow[]=[];
  fileId:string='';

  progress={//进度
    isAccepted:false,
    isChecked:false
  };
  constructor(private oauthSvc: OauthService,
              private pop: PopService,
              private commonSvc: CommonService,
              private detailsSvc: RepaymentDetailsService,
              private businessSvc: BusinessService,
              private repaymentSvc: RepaymentService,
              private actRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.repaymentSvc.getRepaymentNotifyById((this.actRoute.snapshot.params['id']))
      .then((res)=>{
        this.repaymentNotify=res;
        this.fileId =this.repaymentNotify.fileLoadId;
        if(this.repaymentNotify.accountRepaymentWay==0){
          this.loadRepaymentFlows();
        }
        {
          if(this.repaymentNotify.status==2||this.repaymentNotify.status==3){
            this.progress.isAccepted=true;
          }
          if(this.repaymentNotify.status==3){
            this.progress.isAccepted=true;
          }
        }
        this.businessSvc.getLoanById(this.repaymentNotify.borrowApplyId)
          .then((res)=> {
            this.loan = res;
          })

          .catch((err)=>{});
        this.repaymentSvc.getRepayPlan({//还款计划详情
          borrowApplyId:this.repaymentNotify.borrowApplyId,
          currentPeriod:this.repaymentNotify.currentPeriod
        })
          .then((res)=> {
            this.repayPlan = res;
          })
          .catch((err)=>{});
        this.businessSvc.getRepayPlans(this.repaymentNotify.borrowApplyId)
          .then((res)=> {
            this.repaymentPlans = res;
          })
          .catch((err)=>{});
      })
      .catch((err)=>{});
  }

  loadRepaymentFlows():Promise<RepaymentFlow[]>{
    return this.commonSvc.repaymentFlows({
      borrowApplyId:this.repaymentNotify.borrowApplyId,
      repaymentPlan:this.repaymentNotify.currentPeriod
    })
      .then((res)=>{
        this.repaymentFlows=res;
        return Promise.resolve(this.repaymentFlows);
      })
      .catch((err)=>{

      })
  }
}
