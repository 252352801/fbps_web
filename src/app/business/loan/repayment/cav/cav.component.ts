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
import {BankAccount} from "services/entity/BankAccount.entity";
import {RepaymentService} from '../repayment.service';



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
  isPassed:boolean=false;
  loan:Loan=new Loan();//贷款详情
  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  checkedCertificate:boolean=false;//勾选凭证
  submitted:boolean=false;//是否在提交
  repaymentPlans:RepayPlan[]=[];//还款计划列表
  repaymentPlan:number|string;//还款期数
  resultStatus:number;//结果状态 3成功  -1失败
  operator:string=this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile;//操作者
  modalConfirm={
    visible:false,
    data:null,
    submitted:false
  };

  curRepayment:RepayPlan;//当前还款计划
  bankAccount:BankAccount=new BankAccount();

  toAccountId:string;//资金汇集账户Id;
  toAccountOptions:ToAccount[]=[{
    toAccountId:'',
    toAccountName:'请选择',
  },{
    toAccountId:'9550880200931712433',
    toAccountName:'芜湖海豚信息科技有限公司',
  }];
  constructor(
    private oauthSvc:OauthService,
    private pop:PopService,
    private CAVSvc:CAVService,
    private repaymentSvc:RepaymentService,
    private actRoute:ActivatedRoute,
    private paramSvc:ParameterService
  ){
    this.toAccountId=this.toAccountOptions[0].toAccountId;
  }

  ngOnInit(){

    this.id = this.actRoute.snapshot.params['id'];
    let notify=this.paramSvc.get('/business/loan/repayment/cav');
    if(notify.repaymentNotifyId==this.id){
      this.repaymentNotify=this.repaymentNotify.initByObj(notify);
      this.borrowApplyId =this.repaymentNotify.borrowApplyId;
      this.repaymentPlan = this.repaymentNotify.repaymentPlan;
      this.CAVSvc.getLoanById(this.borrowApplyId)
        .then((res)=> {
          this.loan = res;
       //   this.loan.memberId='000010000000001';
          return  this.repaymentSvc.accountInfo({
            memberId:this.loan.memberId
          });
        })
        .then((res)=>{
          this.bankAccount=res;
        })
        .catch((err)=>{
        });
      this.CAVSvc.getRepayPlans(this.borrowApplyId)
        .then((res)=> {
          this.repaymentPlans = res;
          for (let o of this.repaymentPlans) {
            if (o.repaymentPlan === this.repaymentPlan) {
              this.curRepayment = o;
              break;
            }
          }
        })
        .catch((err)=>{
        });
    }else{

    }


  }

  openConfirmModal(){
    this.modalConfirm.submitted=false;
    this.modalConfirm.visible=true;
  }
  closeConfirmModal(){
    this.modalConfirm.visible=false;
  }
  testData(){
    //校验

  }
  successNavigate(){
    history.back();
  }
  submit(){
    if(!this.curRepayment){
      this.pop.info({
        text:'还款通知与还款计划不匹配！'
      });
    }else if(this.repaymentNotify.accountRepaymentWay==0&&((!this.bankAccount.accountId)||(!this.bankAccount.accountName))){
      this.pop.info({
        text:'未找到有效的银行账户！'
      });
    }else if(!this.repaymentNotify){
      this.pop.info({
        text:'还款信息加载失败，请重试！'
      });
    }else if(this.repaymentNotify.accountRepaymentWay==0&&this.toAccountId==''){
      this.pop.info({
        text:'请选择资金汇集账户！'
      });
    }else if(!this.resultStatus){
      this.pop.info({
        text:'请选择核销结果！'
      });
    }else{
      let toAccount:ToAccount;
      for(let o of this.toAccountOptions){
        if(o.toAccountId==this.toAccountId){
          toAccount=o;
          break;
        }
      }
      let body={
        status:this.resultStatus,
        repaymentNotifyId:this.id,
        repaymentId:this.curRepayment.repaymentId,
        accountRepaymentWay:this.repaymentNotify.accountRepaymentWay+'',
        toAccountId:toAccount.toAccountId,
        toAccountName:toAccount.toAccountName,
        operator:this.operator
      };
      this.submitted=true;
      this.CAVSvc.checkRepayment(body)
        .then((res)=>{
          this.submitted=false;
          if(res.status){
            this.pop.info({
              text:'核销成功！'
            }).onConfirm(()=>{
              this.successNavigate();
            }).onClose(()=>{
              this.successNavigate();
            });
          }else{
            this.pop.error({
              text:res.message||'提交失败！'
            });
          }
        })
        .catch((err)=>{
          this.submitted=false;
          this.pop.error({
            text:'请求失败，请重试！'
          });
        });
    }
  }

  /**
   * 获取当期还款计划
   */
  getCurrentRepayPlan(){
    if(this.repaymentNotify&&this.repaymentNotify.repaymentPlan){
      if(this.repaymentPlans.length){
        for(let o of this.repaymentPlans){
          if(this.repaymentNotify.repaymentPlan==o.repaymentPlan){
            return o;
          }
        }
      }
    }
  }

  /**
   * 获取应还总额
   */
  getRepayAmount(){
    if(this.curRepayment){
      let overdueInterest=this.curRepayment.overdueInterest||0;
      return this.curRepayment.repaymentInterest+this.curRepayment.repaymentPrinciple+overdueInterest;
    }
    return null;
  }
}
