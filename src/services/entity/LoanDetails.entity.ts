import { Loan} from './Loan.entity';
import { RepayPlan} from './RepayPlan.entity';
import { Contract} from './Contract.entity';
import { ProveData} from './ProveData.entity';
import { ReviewInfo} from './ReviewInfo.entity';
/**
 * 贷款详情
 */
export class LoanDetails{
  loan:Loan;//贷款单
  repayPlans:{//还款计划列表
    visible?:boolean,
    loading?:boolean,
    errors?:boolean,
    data?:RepayPlan[]
  };
  contracts:{
    visible?:boolean,
    loading?:boolean,
    errors?:boolean,
    data?:Contract[];//融资合同列表
  };
  proveData:{
    visible?:boolean,
    loading?:boolean,
    errors?:boolean,
    data?:ProveData[];//证明材料
  };
  firstReviewInfo:{
    visible?:boolean,
    loading?:boolean,
    errors?:boolean,
    data?:ReviewInfo;//一审信息
  };
  secondReviewInfo:{
    visible?:boolean,
    loading?:boolean,
    errors?:boolean,
    data?:ReviewInfo;//二审信息
  };
  constructor(){
    this.repayPlans={};
    this.repayPlans.visible=false;
    this.repayPlans.loading=false;
    this.repayPlans.errors=false;

    this.contracts={};
    this.contracts.visible=false;
    this.contracts.loading=false;
    this.contracts.errors=false;

    this.proveData={};
    this.proveData.visible=false;
    this.proveData.loading=false;
    this.proveData.errors=false;

    this.firstReviewInfo={};
    this.firstReviewInfo.visible=false;
    this.firstReviewInfo.loading=false;
    this.firstReviewInfo.errors=false;

    this.secondReviewInfo={};
    this.secondReviewInfo.visible=false;
    this.secondReviewInfo.loading=false;
    this.secondReviewInfo.errors=false;
  }

  init(obj?:any):LoanDetails{
    let instance=this;
    if(obj){

    }
    return instance;
  }

  static create(obj?:any):LoanDetails{
    return new LoanDetails().init(obj);
  }
}
