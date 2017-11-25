import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fadeInAnimation} from '../../../../../animations/index';
import {Loan} from '../../../../../services/entity/Loan.entity';
import {RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {OauthService} from '../../../../../services/oauth/oauth.service';
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
  private repaymentPlan: number;//还款期数

  loan: Loan = new Loan();
  repayPlans: RepayPlan[] = [];
  repayPlan: RepayPlan = new RepayPlan();

  //submitData
  submitData: {
    borrowApplyId: string,//贷款单号
    memberId: string,//会员Id
    repaymentPlan: number,//还款期数
    repaymentDate: string,//还款时间
    repaymentPrinciple: number,//本金
    repaymentInterest: number,//利息
    repaymentAmount: number//还款金额
    operator:string;//操作者
  } = {
    borrowApplyId: '',
    memberId: '',
    repaymentPlan: null,
    repaymentDate: '',
    repaymentPrinciple: null,
    repaymentInterest: null,
    repaymentAmount: null,
    operator: this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile
  };

  submitted: boolean = false;

  constructor(private repaySvc: RepayService,
              private actRoute: ActivatedRoute,
              private oauthSvc: OauthService,
              private pop: PopService) {
    this.borrowApplyId = this.actRoute.snapshot.params['borrowApplyId'];
    this.repaymentPlan = parseInt(this.actRoute.snapshot.params['repaymentPlan']);

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
      if (o.repaymentPlan == this.repaymentPlan) {
        this.repayPlan = o;
        this.submitData.borrowApplyId = o.borrowApplyId;
        this.submitData.repaymentPlan = o.repaymentPlan;
        this.submitData.repaymentDate = this.formatDateTime(o.repaymentPlanDate);
        this.submitData.repaymentPrinciple = o.repaymentPrinciple;
        this.submitData.repaymentInterest = o.repaymentInterest;
        this.submitData.repaymentAmount = o.repayRelAmount;
        break;
      }
    }
  }

  loadLoan(): Promise<Loan> {
    return this.repaySvc.getLoanById(this.borrowApplyId)
      .then((res)=> {
        this.loan = res;
        return Promise.resolve(this.loan);
      });
  }

  loadRepayPlans(): Promise<RepayPlan[]> {
    return this.repaySvc.getRepayPlanList(this.borrowApplyId)
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

  sum(items:number[]|string[]): number {
    let result=0;
    let regExp=/^\d+(\.\d+)?$/;
    for(let o of items){
      if(regExp.test(o+'')){
        result+=parseFloat(o+'');
      }
    }
    return result;
  }

  total(){

  }

  submit() {
    //验证
    let numRegExp = /^[0-9]+(\.[0-9]+)?$/;
    if (!this.submitData.repaymentDate) {
      this.pop.error({text: '请选择实际还款日！'});
    } else if (!this.submitData.repaymentPrinciple && this.submitData.repaymentPrinciple !== 0) {
      this.pop.error({text: '请输入本金！'});
    } else if (!numRegExp.test('' + this.submitData.repaymentPrinciple)) {
      this.pop.error({text: '本金输入有误！'});
    } else if (!this.submitData.repaymentInterest && this.submitData.repaymentInterest !== 0) {
      this.pop.error({text: '请输入利息'});
    } else if (!numRegExp.test('' + this.submitData.repaymentInterest)) {
      this.pop.error({text: '利息输入有误'});
    } else {
      this.submitData.repaymentAmount =
        this.sum([this.submitData.repaymentPrinciple, this.submitData.repaymentInterest,this.repayPlan.overdueInterest]);
      this.submitted = true;
      let body={
        borrowApplyId:this.submitData.borrowApplyId,
        memberId:this.submitData.memberId,
        repaymentDate:this.submitData.repaymentDate,
        repaymentAmount:this.submitData.repaymentAmount,
        repaymentPlan:this.submitData.repaymentPlan,
        operator:this.submitData.operator
      };
      this.repaySvc.createRepaymentNotify(body)
        .then((res)=> {
          this.submitted = false;
          if (res.status) {
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


}
