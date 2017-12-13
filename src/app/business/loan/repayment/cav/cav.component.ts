import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { CAVService} from './cav.service';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {RepaymentNotify} from "services/entity/RepaymentNotify.entity";
import {CommonService} from '../../../../../services/common/common.service';
import {RepaymentService} from '../repayment.service';
import {BusinessService} from "../../../business.service";
import {RepaymentFlow} from "../../../../../services/entity/RepaymentFlow.entity";
import {ConfirmCheckModal} from './shared/ConfirmCheckModal';
import {CheckRepaymentBody} from './shared/CheckRepaymentBody.interface';
import {patterns} from '../../../../../services/config/patterns.config';

interface ToAccount{
  toAccountId:string;
  toAccountName:string;
}

@Component({
  selector: 'repayment-cav',
  templateUrl: './cav.component.html',
  styleUrls: ['./cav.component.less'],
  providers:[PopService,CAVService,RepaymentService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class CAVComponent implements OnInit{
  patterns=patterns;
  loan:Loan=new Loan();//贷款详情
  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  repaymentPlans:RepayPlan[]=[];//还款计划列表
  operator:string=this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile;//操作者
  repayPlan:RepayPlan=new RepayPlan();//当前还款计划
  repaymentFlows:RepaymentFlow[]=[];
  confirmCheckModal:ConfirmCheckModal;
  constructor(
    private oauthSvc:OauthService,
    private commonSvc:CommonService,
    private businessSvc:BusinessService,
    private pop:PopService,
    private CAVSvc:CAVService,
    private repaymentSvc:RepaymentService,
    private actRoute:ActivatedRoute
  ){
    this.confirmCheckModal=new ConfirmCheckModal();
  }

  ngOnInit(){
    this.repaymentSvc.getRepaymentNotifyById((this.actRoute.snapshot.params['id']))
      .then((res)=>{
        this.repaymentNotify=res;
        if(this.repaymentNotify.accountRepaymentWay==0){
          this.loadRepaymentFlows();
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


  openConfirmModal(type?:number){
    let submitData:CheckRepaymentBody={
      repaymentNotifyId:this.repaymentNotify.repaymentNotifyId,
      borrowApplyId:this.repaymentNotify.borrowApplyId,
      currentPeriod:this.repaymentNotify.currentPeriod,
      operator:this.operator,
      employeeId:this.oauthSvc.user.employeeId,
      auditPwd:''
    };
    this.confirmCheckModal.setSubmitData(submitData);
    if(this.repaymentNotify.memberId){
      this.confirmCheckModal.memberId=this.repaymentNotify.memberId;
      this.confirmCheckModal.open(type);
    }else{
      this.pop.info({
        text:'会员ID为空，无法加载帐号信息！'
      });
    }
  }
  validate(){
    this.openConfirmModal(this.repaymentNotify.accountRepaymentWay);
  }
}
