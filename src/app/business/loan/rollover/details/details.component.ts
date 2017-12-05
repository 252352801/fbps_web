import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { RolloverDetailsService} from './details.service';
import { Rollover} from '../../../../../services/entity/Rollover.entity';
import { Loan} from '../../../../../services/entity/Loan.entity';
import {BusinessService} from '../../../business.service';
import {RolloverService} from '../rollover.service';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import { Contract} from '../../../../../services/entity/Contract.entity';
import { SharedService} from '../../../../shared/shared.service';
@Component({
    selector: 'rollover-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.less'],
    providers:[PopService,RolloverDetailsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RolloverDetailsComponent implements OnInit{
  rollover:Rollover=new Rollover();//展期详情
  loan:Loan=new Loan();//贷款详情
  repayPlans:RepayPlan[]=[];//还款计划
  contracts:Contract[]=[];//合同


  progress={//进度
    isUploadedVoucher:false,//是否显示凭证
    isConfiguredContract:false,//是否已配置合同
    isFirstReview:false,//是否已一审
    isSecondReview:false//是否已二审
  };
  constructor(
    public rolloverSvc:RolloverService,
    private sharedSvc:SharedService,
    private rolloverDtSvc:RolloverDetailsService,
    private businessSvc:BusinessService,
    private actRoute:ActivatedRoute
  ){
  }

  ngOnInit(){
    let id=this.actRoute.snapshot.params['id'];
    this.rolloverSvc.getRolloverById(id)
      .then((res)=>{
        this.rollover=res;
        if([2,3,-3,4,5,6,-6,7,-7,-8].indexOf(parseInt(res.status+''))>=0){
          this.progress.isFirstReview=true;
        }
        if([3,4,5,6,-6,7,-7,-8].indexOf(parseInt(res.status+''))>=0){
          this.progress.isSecondReview=true;
        }
        if([4,5,6,-6,7,-7,-8].indexOf(parseInt(res.status+''))>=0){
          this.progress.isUploadedVoucher=true;
        }
        if([5,6,-6,7,-7,-8].indexOf(parseInt(res.status+''))>=0){
          this.progress.isConfiguredContract=true;
        }

        return Promise.resolve(this.businessSvc.getLoanById(res.borrowApplyId));
      })
      .then((loan)=>{
        this.loan=loan;
        return this.businessSvc.getRepayPlans(this.loan.borrowApplyId);
      })
      .then((res)=>{
        this.repayPlans=res;
      })
      .catch((err)=>{
      });
    this.loadContracts();
  }


  /**
   * 加载合同
   */
  loadContracts(){
    this.sharedSvc.queryContracts({
      borrowApplyId:this.actRoute.snapshot.params['id'],
      page:1,
      rows:100000
    }).then((res)=>{
      this.contracts=res.items;
      //this.contractsPaginator.count=res.count;
    })
  }
}
