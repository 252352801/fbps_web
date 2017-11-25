import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { RolloverDetailsService} from './details.service';
import { Rollover} from '../../../../../services/entity/Rollover.entity';
import { Loan} from '../../../../../services/entity/Loan.entity';
import {RolloverService} from '../rollover.service';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';

import { Product} from '../../../../../services/entity/Product.entity';
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
  product:Product=new Product();
  constructor(
    public rolloverSvc:RolloverService,
    private rolloverDt:RolloverDetailsService,
    private actRoute:ActivatedRoute
  ){
  }

  ngOnInit(){
    let id=this.actRoute.snapshot.params['id'];
    this.rolloverSvc.getRolloverById(id)
      .then((res)=>{
        this.rollover=res;
        return Promise.resolve(this.rolloverSvc.getLoanById(res.borrowApplyId));
      })
      .then((loan)=>{
        this.loan=loan;
        this.loadProduct(this.loan.productId);
        return this.rolloverSvc.getRepayPlans(this.loan.borrowApplyId);
      })
      .then((res)=>{
        this.repayPlans=res;
      })
      .catch((err)=>{
      })
  }

  loadProduct(prodId:string){
    this.rolloverSvc.getProductById(prodId)
      .then((res)=>{
        this.product=res;
      });
  }

  /**
   * 本期利息
   * @returns {any}
   */
  getRolloverInterest():number|string{
    if(this.rollover.repaymentPlan&&this.repayPlans.length){
      for(let o of this.repayPlans){
        if(o.repaymentPlan==this.rollover.repaymentPlan){
          return o.repaymentInterest;
        }
      }
    }
    return null;
  }
}
