import {Component,OnInit,OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService} from 'dolphinng';
import {ApplyLoanService} from './applyLoan.service';
import {Loan} from '../../../../services/entity/Loan.entity';
import {Contract} from "../../../../services/entity/Contract.entity";
import {Resource} from '../../../../services/entity/Resource.entity';
import {fadeInAnimation} from '../../../../animations/index';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {BankCard} from '../../../../services/entity/BankCard.entity';
import {RepayPlanPreview} from '../../../../services/entity/RepayPlanPreview.entity';
import {ProveData} from "../../../../services/entity/ProveData.entity";
import {ReviewInfo} from "../../../../services/entity/ReviewInfo.entity";
import {BankAccountFlow} from "../../../../services/entity/BankAccountFlow.entity";
import {CommonService} from "../../../../services/common/common.service";
import {BusinessService} from "../../business.service";
import {BorrowService} from "../borrow.service";
import {SharedService} from "../../../shared/shared.service";
@Component({
  selector: 'apply-loan',
  templateUrl: './applyLoan.component.html',
  styleUrls: ['./applyLoan.component.less'],
  providers: [PopService, ApplyLoanService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: { '[@fadeInAnimation]': 'pending' }
})
export class ApplyLoanComponent implements OnInit,OnDestroy{
  type:string;//放款方式
  loan: Loan = new Loan();//贷款详情
  resources: Resource[] = [];
  contracts:Contract[]=[];
  bankCard:BankCard=new BankCard();
  contractsGroup:{capitalId:string,contracts:Contract[]}[]=[];
  loanTime: string = '';//放款日期
  repayPlanPreview: RepayPlanPreview[] = [];
  auditOneBy: string = this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile;
  opinion:string='';
  submitted:boolean=false;

  proveData: ProveData[] = [];
  firstReviewInfo:ReviewInfo=new ReviewInfo();//一审信息
  secondReviewInfo:ReviewInfo=new ReviewInfo();//二审信息
  bankAccountFlows:BankAccountFlow[]=[];//账户流水
  constructor(private actRoute: ActivatedRoute,
              private oauthSvc: OauthService,
              private sharedSvc: SharedService,
              private businessSvc: BusinessService,
              private borrowSvc: BorrowService,
              private applyLoanSvc: ApplyLoanService,
              private commonSvc: CommonService,
              private pop: PopService) {
    this.getLoanById()
      .then((res)=>{
        this.getBankCard();
        if(this.loanTime){
          this.createRepayPlanPreview(this.loanTime);
        }
      });
    this.getProveData();
    this.getReviewInfo();
    this.getContracts();
    this.loadResources();
    this.type=this.actRoute.snapshot.params['type'];
  }

  ngOnInit(){
  }
  ngOnDestroy(){
  }
  getLoanById():Promise<any>{
    return this.businessSvc.getLoanById(this.actRoute.snapshot.params['id'])
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      })
      .catch((err)=> {

      });
  }
  /**
   * 获取贷款单证明材料
   */
  getProveData(){
    this.businessSvc.getLoanProveData(this.actRoute.snapshot.params['id'])
      .then((res)=> {
        this.proveData = res;
      })
      .catch((err)=> {
      });
  }

  /**
   * 获取审核信息
   */
  getReviewInfo(){
    let borrowApplyId=this.actRoute.snapshot.params['id'];
    let body1={//一审
      type:0,
      id:borrowApplyId,
      status2:2
    };
    this.commonSvc.querySystemLog(body1)
      .then((res)=>{
        for(let o of res.items){
          if(o.status==body1.status2){
            this.firstReviewInfo.operator=o.createBy;
            this.firstReviewInfo.reviewTime=o.createTime;
            this.firstReviewInfo.opinion=o.remarks;
            break;
          }
        }
      })
      .catch((err)=>{});
    let body2={//二审
      type:0,
      id:borrowApplyId,
      status2:3
    };
    this.commonSvc.querySystemLog(body2)
      .then((res)=>{
        for(let o of res.items){
          if(o.status==body2.status2){
            this.secondReviewInfo.operator=o.createBy;
            this.secondReviewInfo.reviewTime=o.createTime;
            this.secondReviewInfo.opinion=o.remarks;
            break;
          }
        }
      })
      .catch((err)=>{});

  }

  getContracts(){
    this.sharedSvc.queryContracts({
      borrowApplyId:this.actRoute.snapshot.params['id'],
      page:1,
      rows:100000
    })
      .then((res)=>{
        this.contracts=res.items;
        this.contractsGroup=this.applyLoanSvc.groupContractsByCapitalId(res.items);
      });
  }


  loadResources() {
    this.applyLoanSvc.loadResources(1)
      .then((data)=> {
        this.resources = data;
      })
  }

  submitOnline(){
    this.pop.confirm({
      text:'确定申请线上放款？',
      closeOnConfirm:false,
      showLoaderOnConfirm:true
    }).onConfirm(()=>{
      let accountFlowIds=[];
      for(let o of this.bankAccountFlows){
        accountFlowIds.push(o.flowId);
      }
      let body = {
        borrowApplyId: this.loan.borrowApplyId,
        accountFlowId:accountFlowIds.join(','),
        loanTime:this.loanTime,
        auditOneBy: this.auditOneBy
      };
      this.applyLoanSvc.applyPayOnline(body)
        .then((res)=> {
          if (res.ok) {
            this.pop.info({
              text: '已申请线上放款！'
            }).onClose(()=> {
              history.back();
            }).onConfirm(()=> {
              history.back();
            });
          } else {
            this.pop.error({
              text: res.message||'申请线上放款失败！'
            });
          }
        })
        .catch(()=> {
          this.pop.error({
            text: '请求失败，请重试！'
          })
        });
    });
  }
  submitOffline(){
    this.pop.confirm({
      text:'确定申请线下放款？',
      closeOnConfirm:false,
      showLoaderOnConfirm:true
    }).onConfirm(()=>{
      let body = {
        borrowApplyId: this.loan.borrowApplyId,
        loanTime:this.loanTime,
        auditOneBy: this.auditOneBy
      };
      this.applyLoanSvc.applyPayOffline(body)
        .then((res)=> {
          if (res.ok) {
            this.pop.info({
              text: '已申请线下放款！'
            }).onClose(()=> {
              history.back();
            }).onConfirm(()=> {
              history.back();
            });
          } else {
            this.pop.error({
              text: res.message||'申请线下放款失败！'
            });
          }
        })
        .catch(()=> {
          this.pop.error({
            text: '请求失败，请重试！'
          })
        });
    });
  }

  getBankCard(){
    this.applyLoanSvc.getBankCard({
      memberId:this.loan.memberId,
      type:0
    }).then((res)=>{
      if(res.ok){
        this.bankCard=res.data;
      }
    });
  }


  submit() {
    if(!this.loanTime) {
      this.pop.info({
        text: '请选择放款时间！'
      });
    }else{
      if(this.type==='online'){
        if(this.bankAccountFlows.length===0){
          this.pop.info({
            text: '请选择电子账户流水！'
          });
        }else{
          this.submitOnline();
        }
      }else if(this.type==='offline'){
        this.submitOffline();
      }
    }
  }
  matchResourceName(resourceId: string): string {
    let resourceName = '';
    for (let i in this.resources) {
      if (this.resources[i].resourceId === resourceId) {
        resourceName = this.resources[i].resourceName;
        break;
      }
    }
    return resourceName;
  }


  createRepayPlanPreview(date: string) {
    let body = {
      amount: this.loan.approveAmount,
      rate:this.loan.rate,//利率
      rateCycle: this.loan.ratedCycle,//借款周期
      paymentWay: this.loan.paymentWay,//用款类型/还款方式
      loanDate: date, //放款日期
      interestType:this.loan.rateType//计息类型
    };
    this.borrowSvc.createRepayPlanPreview(body)
      .then((res)=> {
        this.repayPlanPreview = res;
      })
      .catch((err)=> {
      });
  }

  setBankAccountFlows(val:BankAccountFlow[]){
    this.bankAccountFlows=val;
  }

  removeBankAccountFlow(flowId:string){
    let newArr=[];
    for(let i=0,len=this.bankAccountFlows.length;i<len;i++){
      if(flowId!==this.bankAccountFlows[i].flowId){
        newArr.push(this.bankAccountFlows[i]);
      }
    }
    this.bankAccountFlows=newArr;
  }


}
