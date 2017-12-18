import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DetailsService} from './details.service';
import {BusinessService} from '../business.service';
import {Loan} from '../../core/entity/Loan.entity';
import {RepayPlan} from '../../core/entity/RepayPlan.entity';
import {ProveData} from '../../core/entity/ProveData.entity';
import {LoanFlow} from '../../core/entity/LoanFlow.entity';
import {Contract} from '../../core/entity/Contract.entity';
import {fadeInAnimation} from 'app/shared/animations/index';
import {ReviewInfo} from "../../core/entity/ReviewInfo.entity";
import {CommonService} from "../../core/services/common/common.service";
@Component({
  selector: 'loan-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  providers: [DetailsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class LoanDetailsComponent {
  borrowApplyId: string = this.actRoute.snapshot.params['id'];
  loan: Loan = new Loan();//贷款详情
  repayPlanList: RepayPlan[] = [];//还款计划列表
  contracts: Contract[] = [];//合同列表
  proveData: ProveData[] = [];//证明材料
  firstReviewInfo: ReviewInfo = new ReviewInfo();//一审信息
  secondReviewInfo: ReviewInfo = new ReviewInfo();//二审信息
  loanFlows: LoanFlow[] = [];//账户流水



  progress={//进度
    isPlanList:false,
    isContracts:false,
    isProveData:false,
    isFirstReviewInfo:false,
    isSecondReviewInfo:false,
    isLoanFlows:false,
    isApproved:false//是否已经审批（放款）
  };
  constructor(private commonSvc: CommonService,
              private businessSvc: BusinessService,
              private detailsSvc: DetailsService,
              private actRoute: ActivatedRoute) {
    this.getLoanById(this.borrowApplyId)
      .then((loan)=> {
        if([8,9,10].indexOf(parseInt(loan.status+''))>=0){
          this.progress.isApproved=true;
          this.progress.isPlanList=true;
          this.loadRepayPlanList(this.borrowApplyId);
        }
        if([5,6,-6,7,8,9,10].indexOf(parseInt(loan.status+''))>=0){
          this.progress.isContracts=true;
          this.loadContracts();
        }
        if([0,1].indexOf(parseInt(loan.status+''))==-1){
          this.progress.isProveData=true;
          this.progress.isFirstReviewInfo=true;
          this.loadProveData();
          this.loadFirstReviewInfo();
        }
        if([7,8,9,10].indexOf(parseInt(loan.status+''))>=0){
          this.progress.isLoanFlows=true;
          this.loadLoanFlows();
        }
        if([0,1,2,-2].indexOf(parseInt(loan.status+''))==-1){
          this.progress.isSecondReviewInfo=true;
          this.loadSecondReviewInfo();
        }
      })
      .catch((err)=> {

      });
  }

  /**
   * 通过id加载贷款单
   * @param id
   * @returns {Promise<Loan>}
   */
  getLoanById(id: string): Promise<Loan> {
    return this.businessSvc.getLoanById(id)
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      });
  }


  /**
   * 加载还款计划
   * @param borrowApplyId
   */
  loadRepayPlanList(borrowApplyId: string) {
    this.businessSvc.getRepayPlans(borrowApplyId)
      .then((res)=> {
        this.repayPlanList = res;
      });
  }

  /**
   * 加载合同
   */
  loadContracts() {
    this.commonSvc.queryContracts({
      borrowApplyId: this.borrowApplyId,
      page: 1,
      rows: 100000
    })
      .then((res)=> {
        this.contracts = res.items;
      });
  }

  /**
   * 加载证明材料
   */
  loadProveData() {
    this.businessSvc.getLoanProveData(this.borrowApplyId)
      .then((res)=> {
        this.proveData = res;
      })
      .catch((err)=> {
      });
  }

  /**
   * 获取一审审核信息
   */
  loadFirstReviewInfo() {
    let status=(this.loan.status==-2?-2:2);
    let borrowApplyId = this.actRoute.snapshot.params['id'];
    let body1 = {//一审
      type: 0,
      id: borrowApplyId,
      status2: status
    };
    this.commonSvc.querySystemLog(body1)
      .then((res)=> {
        for (let o of res.items) {
          if (o.status == body1.status2) {
            this.firstReviewInfo.operator = o.createBy;
            this.firstReviewInfo.reviewTime = o.createTime;
            this.firstReviewInfo.opinion = o.remarks;
            break;
          }
        }
      })
      .catch((err)=> {
      });
  }

  /**
   * 获取二审审核信息
   */
  loadSecondReviewInfo() {
    let status=(this.loan.status==-3?-3:3);
    let borrowApplyId = this.actRoute.snapshot.params['id'];
    let body2 = {//二审
      type: 0,
      id: borrowApplyId,
      status2: status
    };
    this.commonSvc.querySystemLog(body2)
      .then((res)=> {
        for (let o of res.items) {
          if (o.status == body2.status2) {
            this.secondReviewInfo.operator = o.createBy;
            this.secondReviewInfo.reviewTime = o.createTime;
            this.secondReviewInfo.opinion = o.remarks;
            break;
          }
        }
      })
      .catch((err)=> {
      });

  }

  /**
   * 加载放款选择的电子账户流水
   */
  loadLoanFlows(){
      this.commonSvc.loanFlows({
        borrowApplyId:this.loan.borrowApplyId
      })
        .then((res)=>{
          this.loanFlows=res;
        })
        .catch((err)=>{
        })
  }
}
