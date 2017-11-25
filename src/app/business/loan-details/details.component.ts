import {Component} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {DetailsService} from './details.service';
import {Loan} from '../../../services/entity/Loan.entity';
import {RepayPlan} from '../../../services/entity/RepayPlan.entity';
import {Contract} from '../../../services/entity/Contract.entity';
import {fadeInAnimation} from '../../../animations/index';
import {api_file} from '../../../services/config/app.config';
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


  isApproved:boolean=false;//是否已经审批（放款）

  constructor(
    private detailsSvc: DetailsService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.getLoanById(this.borrowApplyId);
    this.loadRepayPlanList(this.borrowApplyId);
    this.loadProducts();
    this.loadContracts();
  }

  getLoanById(id: string) {
    this.detailsSvc.getLoanById(id)
      .then((data: Loan)=> {
        this.loan = data;
        let lostApproveStatuses=[207,211,300,301,302,401,303];//[201,203,204,205,500,503,505];
        if(lostApproveStatuses.indexOf(this.loan.status)>=0){
          this.isApproved=true;
        }
      });
  }

  loadProducts() {
    this.detailsSvc.loadProducts()
      .then((res)=> {
      });
  }

  loadContracts() {
    this.detailsSvc.loadContracts({
      borrowApplyId: this.borrowApplyId,
      page: 1,
      rows: 100000
    })
      .then((res)=> {
        this.contracts = res.items;
      });
  }

  loadRepayPlanList(borrowApplyId: string) {
    this.detailsSvc.getRepayPlanList(borrowApplyId)
      .then((res)=> {
        this.repayPlanList = res;
      });
  }

}
