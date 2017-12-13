import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fadeInAnimation} from '../../../../../animations/index';
import {Loan} from '../../../../../services/entity/Loan.entity';
import {RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {BusinessService} from '../../../business.service';
import {RepayService} from './repay.service';
import {PopService} from 'dolphinng';
@Component({
  selector: 'repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.less'],
  providers: [RepayService, PopService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RepayComponent {

  //参数
  private borrowApplyId: string;
  private currentPeriod: number;//还款期数

  loan: Loan = new Loan();
  repayPlans: RepayPlan[] = [];
  repayPlan: RepayPlan = new RepayPlan();

  //submitData
  submitData: {
    borrowApplyId: string,//贷款单号
    memberId: string,//会员Id
    operator:string;//操作者
    currentPeriod: number,//还款期数
    repaymentRelDate: string,//还款时间
    repaymentAmount: number//还款金额
  } = {
    borrowApplyId: '',
    memberId: '',
    operator: this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile,
    currentPeriod: null,
    repaymentRelDate: '',
    repaymentAmount: null
  };

  submitted: boolean = false;

  constructor(private repaySvc: RepayService,
              private businessSvc: BusinessService,
              private actRoute: ActivatedRoute,
              private oauthSvc: OauthService,
              private pop: PopService) {
    this.borrowApplyId = this.actRoute.snapshot.params['borrowApplyId'];
    this.currentPeriod = parseInt(this.actRoute.snapshot.params['currentPeriod']);

    this.loadLoan()
      .then((res)=> {
        this.submitData.memberId = res.memberId;
      });
    this.loadRepayPlans()
      .then((data)=> {
        this.repayPlans = data;
        this.matRepayPlan();
      });
  }

  matRepayPlan() {
    for (let o of this.repayPlans) {
      if (o.currentPeriod == this.currentPeriod) {
        this.repayPlan = o;
        this.submitData.borrowApplyId = o.borrowApplyId;
        this.submitData.currentPeriod = o.currentPeriod;
        this.submitData.repaymentRelDate = this.formatDateTime(o.repaymentDate);
        this.submitData.repaymentAmount = o.repaymentAmount;
        break;
      }
    }
  }

  loadLoan(): Promise<Loan> {
    return this.businessSvc.getLoanById(this.borrowApplyId)
      .then((res)=> {
        this.loan = res;
        return Promise.resolve(this.loan);
      });
  }

  loadRepayPlans(): Promise<RepayPlan[]> {
    return this.businessSvc.getRepayPlans(this.borrowApplyId)
      .then((res)=> {
        this.repayPlans = res;
        return Promise.resolve(this.repayPlans);
      });
  }

  formatDateTime(date: string) {
    let datetime = new Date(date);
    let year = datetime.getFullYear();
    let mon = datetime.getMonth() + 1;
    let day = datetime.getDate();
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let seconds = datetime.getSeconds();
    return year + '-' + (mon >= 10 ? mon : '0' + mon) + '-' + (day >= 10 ? day : '0' + day)+
      ' '+(hours >= 10 ? hours : '0' + hours)+':'+(minutes >= 10 ? minutes : '0' + minutes)+':'+
      (seconds >= 10 ? seconds : '0' + seconds);
  }

  submit() {
    this.submitted = true;
    let body={
      borrowApplyId:this.submitData.borrowApplyId,
      memberId:this.submitData.memberId,
      repaymentDate:this.submitData.repaymentRelDate,
      repaymentAmount:this.submitData.repaymentAmount,
      currentPeriod:this.submitData.currentPeriod,
      operator:this.submitData.operator
    };
    this.repaySvc.createRepaymentNotify(body)
      .then((res)=> {
        this.submitted = false;
        if (res.ok) {
          this.pop.info({text: '提交还款成功！'})
            .onConfirm(()=>{
              history.back();
            })
            .onClose(()=>{
              history.back();
            });
        } else {
          this.pop.error({text:res.message|| '提交还款失败，请重试！'});
        }
      })
      .catch((err)=> {
        this.submitted = false;
        this.pop.error({text: '请求失败，请重试！'});
      });
  }


}
