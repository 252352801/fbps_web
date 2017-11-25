import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { RepaymentDetailsService} from './details.service';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {ParameterService} from "services/parameter/parameter.service";
import {RepaymentNotify} from "services/entity/RepaymentNotify.entity";
import {BankAccount} from "services/entity/BankAccount.entity";
import {RepaymentService} from '../repayment.service';
import {BankAccountFlow} from "services/entity/BankAccountFlow.entity";
import {Paginator} from "services/entity/Paginator.entity";

interface ToAccount{
  toAccountId:string;
  toAccountName:string;
}


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
  id: string;
  borrowApplyId: string;
  isPassed: boolean = false;
  loan: Loan = new Loan();//贷款详情
  submitted: boolean = false;//是否在提交
  repaymentPlans: RepayPlan[]=[];//还款计划列表
  repaymentPlan: number|string;//还款期数
  repaymentDate: string = '';//还款日期

  curRepayment:RepayPlan;//当前还款计划
  bankAccount:BankAccount=new BankAccount();
  backAccountFlows:BankAccountFlow[]=[];
  BAFPaginator:Paginator=new Paginator();

  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  operator: string = this.oauthSvc.user.employeeName|| this.oauthSvc.user.mobile;//操作者
  constructor(private oauthSvc: OauthService,
              private pop: PopService,
              private detailsSvc: RepaymentDetailsService,
              private repaymentSvc: RepaymentService,
              private actRoute: ActivatedRoute,
              private paramSvc: ParameterService
  ) {

  }

  ngOnInit() {
    this.id = this.actRoute.snapshot.params['id'];
    let notify=this.paramSvc.get('/business/loan/repayment/details');
    this.BAFPaginator.size=5;
    if(notify.repaymentNotifyId==this.id){
      this.repaymentNotify=this.repaymentNotify.initByObj(notify);
      this.borrowApplyId =this.repaymentNotify.borrowApplyId;
      this.repaymentPlan =this.repaymentNotify.repaymentPlan;
      this.detailsSvc.getLoanById(this.borrowApplyId)
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
      this.detailsSvc.getRepayPlans(this.borrowApplyId)
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
}
