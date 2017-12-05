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
import {RepaymentService} from '../repayment.service';
import {BusinessService} from '../../../business.service';
import {BankAccountFlow} from "../../../../../services/entity/BankAccountFlow.entity";
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
  loan: Loan = new Loan();//贷款详情
  submitted: boolean = false;//是否在提交
  repaymentPlans: RepayPlan[]=[];//还款计划列表
  currentPeriod: number|string;//还款期数
  repaymentDate: string = '';//还款日期
  curRepayment:RepayPlan;//当前还款计划
  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  operator: string = this.oauthSvc.user.employeeName|| this.oauthSvc.user.mobile;//操作者

  bankAccountFlows:BankAccountFlow[]=[];//账户流水
  fileId:string='';

  progress={//进度
    isAccepted:false,
    isChecked:false
  };
  constructor(private oauthSvc: OauthService,
              private pop: PopService,
              private detailsSvc: RepaymentDetailsService,
              private businessSvc: BusinessService,
              private repaymentSvc: RepaymentService,
              private actRoute: ActivatedRoute,
              private paramSvc: ParameterService
  ) {

  }

  ngOnInit() {
    this.id = this.actRoute.snapshot.params['id'];
    let notify=this.paramSvc.get('/business/loan/repayment/details');
    if(notify.repaymentNotifyId==this.id){
      this.repaymentNotify=this.repaymentNotify.init(notify);
      this.borrowApplyId =this.repaymentNotify.borrowApplyId;
      this.currentPeriod =this.repaymentNotify.currentPeriod;
      {
        if(this.repaymentNotify.status==2||this.repaymentNotify.status==3){
          this.progress.isAccepted=true;
        }
        if(this.repaymentNotify.status==3){
          this.progress.isAccepted=true;
        }
      }
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
}
