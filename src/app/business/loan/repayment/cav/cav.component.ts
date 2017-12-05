import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { CAVService} from './cav.service';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {ParameterService} from "services/parameter/parameter.service";
import {RepaymentNotify} from "services/entity/RepaymentNotify.entity";
import {CommonService} from '../../../../../services/common/common.service';
import {RepaymentService} from '../repayment.service';
import {BusinessService} from "../../../business.service";
import {RepaymentFlow} from "../../../../../services/entity/RepaymentFlow.entity";
import {ConfirmCheckModal} from './shared/ConfirmCheckModal'
import {CheckRepaymentBody} from './shared/CheckRepaymentBody.interface'

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
  id:string;
  borrowApplyId:string;
  loan:Loan=new Loan();//贷款详情
  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  totalRelAmount:number=null;//实际还款金额
  repaymentPlans:RepayPlan[]=[];//还款计划列表
  currentPeriod:number|string;//还款期数
  operator:string=this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile;//操作者
  repayPlan:RepayPlan=new RepayPlan();//当前还款计划
  repaymentFlows:RepaymentFlow[]=[];
  fileId:string='';//还款凭证文件ID
  confirmCheckModal:ConfirmCheckModal;
  constructor(
    private oauthSvc:OauthService,
    private commonSvc:CommonService,
    private businessSvc:BusinessService,
    private pop:PopService,
    private CAVSvc:CAVService,
    private repaymentSvc:RepaymentService,
    private actRoute:ActivatedRoute,
    private paramSvc:ParameterService
  ){
    this.confirmCheckModal=new ConfirmCheckModal();
  }

  ngOnInit(){
    this.id = this.actRoute.snapshot.params['id'];
    let notify=this.paramSvc.get('/business/loan/repayment/cav');
    if(notify.repaymentNotifyId==this.id){
      this.repaymentNotify=this.repaymentNotify.init(notify);
      this.borrowApplyId =this.repaymentNotify.borrowApplyId;
      this.currentPeriod = this.repaymentNotify.currentPeriod;
      this.businessSvc.getLoanById(this.borrowApplyId)
        .then((res)=> {
          this.loan = res;
        })
        .catch((err)=>{
        });
      this.businessSvc.getRepayPlans(this.borrowApplyId)
        .then((res)=> {
          this.repaymentPlans = res;
          for (let o of this.repaymentPlans) {
            if (o.currentPeriod === this.currentPeriod) {
              this.repayPlan = o;
              break;
            }
          }
        })
        .catch((err)=>{
        });

      this.loadRepaymentFlows()
        .then((data)=>{
          if(data&&data.length){
            this.fileId=data[0].fileLoadId;
          }
        });
    }else{

    }


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
    if(!this.repayPlan){
      this.pop.info({
        text:'还款通知与还款计划不匹配！'
      });
    }else if(!this.repaymentNotify){
      this.pop.info({
        text:'还款信息加载失败，请重试！'
      });
    }else{
      this.openConfirmModal(this.repaymentNotify.accountRepaymentWay);
    }
  }
  /**
   * 获取误差金额
   */
  getErrorAmount(){
    if(this.repayPlan&&this.repayPlan.repaymentAmount){
      if(this.totalRelAmount||this.totalRelAmount===0){
        return this.totalRelAmount-this.repayPlan.repaymentAmount;
      }
    }
  }
}
