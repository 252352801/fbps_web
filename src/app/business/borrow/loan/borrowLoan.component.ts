import {Component,OnInit,OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService} from 'dolphinng';
import {BorrowLoanService} from './borrowLoan.service';
import {Loan} from '../../../../services/entity/Loan.entity';
import {Contract} from "../../../../services/entity/Contract.entity";
import {Resource} from '../../../../services/entity/Resource.entity';
import {fadeInAnimation} from '../../../../animations/index';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {BankCard} from '../../../../services/entity/BankCard.entity';
import {RepayPlanPreview} from '../../../../services/entity/RepayPlanPreview.entity';

import {SystemLogSearchParams,SystemLogsService} from '../../../../components/system-logs/system-logs.service';
@Component({
  selector: 'borrow-loan',
  templateUrl: './borrowLoan.component.html',
  styleUrls: ['./borrowLoan.component.less'],
  providers: [PopService, BorrowLoanService,SystemLogsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: { '[@fadeInAnimation]': 'pending' }
})
export class BorrowLoanComponent implements OnInit,OnDestroy{
  isPassed: boolean;
  loan: Loan = new Loan();//贷款详情
  resources: Resource[] = [];
  contracts:Contract[]=[];
  bankCard:BankCard=new BankCard();
  contractsGroup:{capitalId:string,contracts:Contract[]}[]=[];

  reviewInfo:{
    operator:string,
    reviewTime:string,
    opinion:string
  }={
    operator:'',
    reviewTime:'',
    opinion:'',
  };

  loanTime: string = '';//放款日期
  repayPlanPreview: RepayPlanPreview[] = [];
  modalContract = {
    visible: false,
    data: null,
    submitted: false
  };
  modalConfirm = {
    visible: false,
    data: null,
    submitted: false
  };
  auditOneBy: string = this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile;
  opinion:string='';
  submitted:boolean=false;

  constructor(private actRoute: ActivatedRoute,
              private oauthSvc: OauthService,
              private borrowLoanSvc: BorrowLoanService,
              private sysLogsSvc: SystemLogsService,
              private pop: PopService) {
    this.getLoanById()
      .then((res)=>{
        this.getBankCard();
        if(this.loanTime){
          this.createRepayPlanPreview(this.loanTime);
        }
        this.getReviewInfo();
      });
    this.getContracts();
    this.loadResources();
  }

  ngOnInit(){
    let loanData=sessionStorage.getItem('borrowLoanData');
    if(loanData){
      let input=JSON.parse(loanData);
      if(input['borrowApplyId']==this.actRoute.snapshot.params['id']){
        this.loanTime=input['loanTime'];
      }
    }
  }
  ngOnDestroy(){
    if(this.loanTime){
      let input={
        borrowApplyId:this.loan.borrowApplyId,
        loanTime:this.loanTime
      };
      sessionStorage.setItem('borrowLoanData',JSON.stringify(input));
    }
  }

  getLoanById():Promise<any>{
    return this.borrowLoanSvc.getLoanById(parseInt(this.actRoute.snapshot.params['id']))
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      })
      .catch((err)=> {

      });
  }

  getReviewInfo(){
    let body={
      type:0,
      id:this.loan.borrowApplyId,
      status2:204
    };
    this.sysLogsSvc.query(body)
      .then((res)=>{
        console.log(res);
        for(let o of res.items){
          if(o.status==204){
            this.reviewInfo.operator=o.createBy;
            this.reviewInfo.reviewTime=o.createTime;
            this.reviewInfo.opinion=o.remarks;
            break;
          }
        }
      });
  }

  getContracts(){
    this.borrowLoanSvc.loadContracts({
      borrowApplyId:this.actRoute.snapshot.params['id'],
      page:1,
      rows:100000
    })
      .then((res)=>{
        this.contracts=res.items;
        this.contractsGroup=this.borrowLoanSvc.groupContractsByCapitalId(res.items);
      });
  }


  loadResources() {
    this.borrowLoanSvc.loadResources(1)
      .then((data)=> {
        this.resources = data;
      })
  }

  openContractModal() {
    this.modalContract.visible = true;
  }

  closeContractModal() {
    this.modalContract.visible = false;
  }

  openConfirmModal() {
    this.modalConfirm.submitted = false;
    this.modalConfirm.visible = true;
  }

  closeConfirmModal() {
    this.modalConfirm.visible = false;
  }

  private successNavigate() {
    history.back();
  }

  submitPass(){
    if(this.isPassed) {
      this.modalConfirm.submitted = true;
      let body = {
        auditOneBy: this.auditOneBy,
        loanTime:this.loanTime,
        status:207,
        borrowApplyId: this.loan.borrowApplyId
      };
      this.borrowLoanSvc.loan(body)
        .then((res)=> {
          this.modalConfirm.submitted = false;
          this.closeConfirmModal();
          if (res.status) {
            this.pop.info({
              text: '已放款！'
            }).onClose(()=> {
              this.successNavigate();
            }).onConfirm(()=> {
              this.successNavigate();
            });
          } else {
            this.pop.error({
              text: res.message||'放款失败！'
            });
          }
        })
        .catch(()=> {
          this.modalConfirm.submitted = false;
          this.closeConfirmModal();
          this.pop.error({
            text: '请求失败，请重试！'
          })
        });
    }
  }
  submitUnPass(){
    let body = {
      auditOneBy: this.auditOneBy,
      borrowApplyId: this.loan.borrowApplyId,
      status:503,
      remarks:this.opinion
    };
    this.submitted = true;
    this.borrowLoanSvc.loan(body)
      .then((res)=> {
        this.submitted = false;
        if (res.status) {
          this.pop.info({
            text: '已审批不通过！'
          }).onClose(()=> {
            this.successNavigate();
          }).onConfirm(()=> {
            this.successNavigate();
          });
        } else {
          this.pop.error({
            text:  res.message||'放款审核失败！'
          });
        }
      })
      .catch(()=> {
        this.submitted = false;
        this.closeConfirmModal();
        this.pop.error({
          text: '请求失败，请重试！'
        })
      });
  }

  getBankCard(){
    this.borrowLoanSvc.getBankCard({
      memberId:this.loan.memberId,
      type:0
    }).then((res)=>{
      if(res.ok){
        this.bankCard=res.data;
      }
    });
  }


  submit() {
    if(!(this.isPassed===true||this.isPassed===false)){
      this.pop.info({
        text: '请选择审批结果！'
      });
    }else if(this.isPassed){
      if(!this.loanTime){
        this.pop.info({
          text: '请选择放款日期！'
        });
      }else{
        this.openConfirmModal();
      }
    }else{
      if(this.opinion===''){
        this.pop.info({
          text: '请输入审批意见！'
        });
      }else{
        this.submitUnPass();
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
    let query = {
      amount: this.loan.approveAmount,
      productId: this.loan.productId,
      rateCycle: this.loan.borrowHowlong,
      paymentWay: this.loan.repaymentWay,
      loanDate: date
    };
    this.borrowLoanSvc.createRepayPlanPreview(query)
      .then((res)=> {
        this.repayPlanPreview = res;
      })
      .catch((err)=> {

      });
  }


}
