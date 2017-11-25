import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService} from 'dolphinng';
import {AcceptService,AcceptRepaymentBody} from './accept.service';
import {RepaymentService} from '../repayment.service';
import {Loan} from '../../../../../services/entity/Loan.entity';
import {RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {ParameterService} from "services/parameter/parameter.service";
import {RepaymentNotify} from "services/entity/RepaymentNotify.entity";
import {BankAccount} from "services/entity/BankAccount.entity";
import {BankAccountFlow} from "services/entity/BankAccountFlow.entity";
import {Paginator} from "services/entity/Paginator.entity";
@Component({
  selector: 'repayment-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.less'],
  providers: [PopService, AcceptService,RepaymentService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class AcceptComponent implements OnInit {
  id: string;
  borrowApplyId: string;
  isPassed: boolean = false;
  loan: Loan = new Loan();//贷款详情
  checkedCertificate: boolean = false;//勾选凭证
  submitted: boolean = false;//是否在提交
  repaymentPlans: RepayPlan[]=[];//还款计划列表
  repaymentPlan: number|string;//还款期数
  repaymentDate: string = '';//还款日期
  payRelAmount: number = null;//实际还款
  errorAmountRemarks:string='';//
  curRepayment:RepayPlan;//当前还款计划
  bankAccount:BankAccount=new BankAccount();
  backAccountFlows:BankAccountFlow[]=[];
  BAFPaginator:Paginator=new Paginator();

  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  operator: string = this.oauthSvc.user.employeeName|| this.oauthSvc.user.mobile;//操作者
  modalConfirm = {
    visible: false,
    data: null,
    submitted: false
  };

  constructor(private oauthSvc: OauthService,
              private pop: PopService,
              private acceptSvc: AcceptService,
              private repaymentSvc: RepaymentService,
              private actRoute: ActivatedRoute,
              private paramSvc: ParameterService
  ) {

  }

  ngOnInit() {
    this.id = this.actRoute.snapshot.params['id'];
    let notify=this.paramSvc.get('/business/loan/repayment/accept');
    this.BAFPaginator.size=5;
    if(notify.repaymentNotifyId==this.id){
      this.repaymentNotify=this.repaymentNotify.initByObj(notify);
      this.borrowApplyId =this.repaymentNotify.borrowApplyId;
      this.repaymentPlan =this.repaymentNotify.repaymentPlan;
      this.acceptSvc.getLoanById(this.borrowApplyId)
        .then((res)=> {
          this.loan = res;
          //this.loan.memberId='000010000000001';
          return  this.repaymentSvc.accountInfo({
            memberId:this.loan.memberId
          });
        })
        .then((res)=>{
          this.bankAccount=res;
          this.queryBackAccountFlow();
        })
        .catch((err)=>{
        });
      this.acceptSvc.getRepayPlans(this.borrowApplyId)
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

  queryBackAccountFlow(){
    let today=new Date();
    let prevMonthDate=new Date();
    prevMonthDate.setMonth(today.getMonth()-1);
    let query={
      beginDate:this.formatDate(prevMonthDate),
      endDate:this.formatDate(today),//结束时间 格式：yyyy-MM-dd
      flowStatus:0,//交易状态：0：全部1:提交成功(未明)；2:交易成功;-2:交易失败
      tradeType:0,//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
      page:this.BAFPaginator.index+1,//页码
      rows:this.BAFPaginator.size,//每页大小
      memberId:this.loan.memberId,//会员Id
    };
    this.repaymentSvc.backAccountFlow(query)
      .then((res)=>{
        this.BAFPaginator.count=res.count;
        this.backAccountFlows=res.items;
      })
      .catch((err)=>{
      });
  }

  openConfirmModal() {
    this.modalConfirm.submitted = false;
    this.modalConfirm.visible = true;
  }

  closeConfirmModal() {
    this.modalConfirm.visible = false;
  }

  testData() {
    //校验

  }

  successNavigate() {
    history.back();
  }

  submit() {
    let repayAmount=this.payRelAmount;//实际还款金额
    let  numRegExp=/^[0-9]+(\.[0-9]+)?$/;
    if(!this.repaymentNotify.repaymentNotifyId){
      this.pop.info({text: '还款通知信息有误，无法受理！'});
    }else if (!this.curRepayment) {
      this.pop.info({text: '还款通知与还款计划不匹配，无法受理！'});
    }else if (this.repaymentDate === '') {
      this.pop.info({text: '请选择实际还款日期！'});
    }else if (!repayAmount&&repayAmount!==0) {
      this.pop.info({text: '请输入实际还款金额！'});
    }else if (!numRegExp.test(repayAmount+'')) {
      this.pop.info({text: '实际还款金额输入有误！'});
    } else if (this.getErrorAmount()&&this.errorAmountRemarks==='') {
      this.pop.info({text: '请输入误差原因！'});
    } else if (this.repaymentNotify.accountRepaymentWay === 1 && !this.checkedCertificate) {
      this.pop.info({
        text: '请确认是否已发送汇款凭证！'
      });
    } else if (this.repaymentNotify.accountRepaymentWay === 0 && !this.bankAccount.bankAccount) {
      this.pop.info({
        text: '无效的银行账户！'
      });
    } else if (this.repaymentNotify.accountRepaymentWay === 0 && this.bankAccount.availableBalance<repayAmount) {
      this.pop.info({text: '此账户余额不足！'});
    }else {
      let body :AcceptRepaymentBody= {
        repaymentNotifyId: this.id,
        repaymentId:this.curRepayment.repaymentId,
        repaymentDate: this.repaymentDate+':01',
        accountRepaymentWay: this.repaymentNotify.accountRepaymentWay + '',
        payRelAmount:parseFloat(repayAmount+''),
        operator: this.operator
      };
      if(this.getErrorAmount()){
        body.errorRemark=this.errorAmountRemarks;
      }
      this.submitted = true;
      this.acceptSvc.acceptRepayment(body)
        .then((res)=> {
          this.submitted = false;
          if (res.status) {
            this.pop.info({
              text: '受理成功！'
            }).onConfirm(()=>{
              this.successNavigate();
            }).onClose(()=>{
              this.successNavigate();
            });
          } else {
            this.pop.error({
              text: res.message || '提交失败！'
            });
          }
        })
        .catch((err)=> {
          this.submitted = false;
          this.pop.error({
            text: '请求失败，请重试！'
          });
        });
    }
  }

  private formatDate(date:Date){
    if(date instanceof  Date){
      let m=date.getMonth()+1;
      let d=date.getDate();
      return date.getFullYear()+'-'+(m>=10?m:'0'+m)+'-'+(d>=10?d:'0'+d);
    }
  }

  absoluteAmount(amount:number){
    return amount>=0?amount:-amount;
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

  /**
   * 获取误差金额
   */
  getErrorAmount(){
    if(this.curRepayment&&this.curRepayment.repayRelAmount){
        if(this.payRelAmount||this.payRelAmount===0){
          return this.payRelAmount-this.curRepayment.repayRelAmount;
        }
    }
  }

}
