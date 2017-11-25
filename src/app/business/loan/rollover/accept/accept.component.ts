import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { AcceptService} from './accept.service';
import { Rollover} from '../../../../../services/entity/Rollover.entity';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { OauthService} from '../../../../../services/oauth/oauth.service';
import {RolloverService} from '../rollover.service';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';

import { Product} from '../../../../../services/entity/Product.entity';
@Component({
    selector: 'rollover-accept',
    templateUrl: './accept.component.html',
    styleUrls: ['./accept.component.less'],
    providers:[PopService,AcceptService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class AcceptComponent implements OnInit{
  isPassed:boolean;
  rollover:Rollover=new Rollover();//展期详情
  loan:Loan=new Loan();//贷款详情
  repayPlans:RepayPlan[];//还款计划
  modalConfirm={
    visible:false,
    data:null,
    submitted:false
  };
  auditOneBy:string=this.oauth.user.employeeName||this.oauth.user.mobile;
  opinion:string='';
  submitted:boolean=false;
  product:Product=new Product();
  constructor(
    private pop:PopService,
    public rolloverSvc:RolloverService,
    private acceptSvc:AcceptService,
    private actRoute:ActivatedRoute,
    private oauth:OauthService
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

  openConfirmModal(){
    this.modalConfirm.submitted=false;
    this.modalConfirm.visible=true;
  }
  closeConfirmModal(){
    this.modalConfirm.visible=false;
  }
  testData(){
    let valid=false;
    //校验
    if(!(this.isPassed===true||this.isPassed===false)){
      this.pop.info({
        text:'请选择初审结果！'
      });
    }else if(this.opinion===''){
      this.pop.info({
        text:'请输入审批意见！'
      });
    }else{
      valid=true;
    }
    return valid;
  }
  successNavigate(){
    history.back();
  }
  submit(){
    if(!this.testData()){
      return;
    }
    this.modalConfirm.submitted=true;
    let body={
      rolloverApplyId:this.rollover.rolloverApplyId,
      status:this.isPassed?203:503,
      remarks:this.opinion,
      auditOneBy:this.auditOneBy,
    };
    this.rolloverSvc.approve(body)
        .then((res)=>{
          this.closeConfirmModal();
          if(res.status){
            this.pop.info({
              text:'受理成功！'
            }).onClose(()=>{
              this.successNavigate();
            }).onConfirm(()=>{
                  this.successNavigate();
            });
          }else{
            this.pop.error({
              text:res.message
            });
          }
        })
        .catch(()=>{
          this.closeConfirmModal();
          this.pop.error({
            text:'请求失败，请重试！'
          })
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
