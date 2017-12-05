import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService,Toaster} from 'dolphinng';
import {AcceptService} from './accept.service';
import {RepaymentService} from '../repayment.service';
import {Loan} from '../../../../../services/entity/Loan.entity';
import {RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {ParameterService} from "services/parameter/parameter.service";
import {RepaymentNotify} from "services/entity/RepaymentNotify.entity";
import {BankAccount} from "services/entity/BankAccount.entity";
import {Paginator} from "services/entity/Paginator.entity";
import {BankAccountFlow} from "../../../../../services/entity/BankAccountFlow.entity";
import {api_file} from '../../../../../services/config/app.config';
import {Uploader} from 'dolphinng';
import {CommonService} from '../../../../../services/common/common.service';
import {BusinessService} from '../../../business.service';
import {AcceptRepaymentBody} from './shared/AcceptRepaymentBody';
@Component({
  selector: 'repayment-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.less'],
  providers: [PopService, AcceptService,RepaymentService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class AcceptComponent implements OnInit {
  id: string;
  borrowApplyId: string;
  isPassed: boolean = false;
  loan: Loan = new Loan();//贷款详情
  submitted: boolean = false;//是否在提交
  repaymentPlans: RepayPlan[]=[];//还款计划列表
  currentPeriod: number|string;//还款期数
  repaymentDate: string = '';//还款日期
  totalRelAmount: number = null;//实际还款
  errorAmountRemarks:string='';//
  curRepayment:RepayPlan;//当前还款计划
  bankAccount:BankAccount=new BankAccount();

  BAFPaginator:Paginator=new Paginator();
  repaymentNotify:RepaymentNotify=new RepaymentNotify();
  operator: string = this.oauthSvc.user.employeeName|| this.oauthSvc.user.mobile;//操作者
  modalConfirm = {
    visible: false,
    data: null,
    submitted: false
  };
  bankAccountFlows:BankAccountFlow[]=[];//账户流水

  uploader: Uploader = new Uploader();
  constructor(private oauthSvc: OauthService,
              private pop: PopService,
              private toaster: Toaster,
              private acceptSvc: AcceptService,
              private repaymentSvc: RepaymentService,
              private actRoute: ActivatedRoute,
              private commonSvc: CommonService,
              private businessSvc: BusinessService,
              private paramSvc: ParameterService
  ) {
    this.initUploader();
  }

  ngOnInit() {
    this.id = this.actRoute.snapshot.params['id'];
    let notify=this.paramSvc.get('/business/loan/repayment/accept');
    this.BAFPaginator.size=5;
    if(notify.repaymentNotifyId==this.id){
      this.repaymentNotify=this.repaymentNotify.init(notify);
      console.log(this.repaymentNotify);
      this.borrowApplyId =this.repaymentNotify.borrowApplyId;
      this.currentPeriod =this.repaymentNotify.currentPeriod;
      this.businessSvc.getLoanById(this.borrowApplyId)
        .then((res)=> {
          this.loan = res;
          return  this.commonSvc.bankAccount({
            memberId:this.loan.memberId
          });
        })
        .then((res)=>{
          if(res.ok){
            this.bankAccount=res.data;
          }
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



  successNavigate() {
    history.back();
  }

  submit() {
    let repayAmount=this.totalRelAmount;//实际还款金额
    let  numRegExp=/^[0-9]+(\.[0-9]+)?$/;
    if(!this.repaymentNotify.repaymentNotifyId){
      this.pop.info({text: '还款通知信息有误，无法受理！'});
    }else if (!this.curRepayment) {
      this.pop.info({text: '还款通知与还款计划不匹配，无法受理！'});
    }else if (this.repaymentDate === '') {
      this.pop.info({text: '请选择实际还款日期！'});
    }else if (!repayAmount&&repayAmount!==0) {
      this.pop.info({text: '请输入实际还款金额！'});
    }else if (!numRegExp.test(repayAmount+'')) {
      this.pop.info({text: '实际还款金额输入有误！'});
    } else if (this.getErrorAmount()&&this.errorAmountRemarks==='') {
      this.pop.info({text: '请输入误差原因！'});
    } else{
      let body :AcceptRepaymentBody= {
        repaymentNotifyId: this.repaymentNotify.repaymentNotifyId,
        borrowApplyId:this.loan.borrowApplyId,
        currentPeriod:this.repaymentNotify.currentPeriod,
        accountRepaymentWay: this.repaymentNotify.accountRepaymentWay + '',
        repaymentRelDate: this.repaymentDate+':01',
        operator: this.operator,
        totalRelAmount:parseFloat(repayAmount+'')
      };
      if(this.getErrorAmount()){
        body.errorRemark=this.errorAmountRemarks;
      }
      if (this.repaymentNotify.accountRepaymentWay ===0){//线上还款参数填充
        let ids=[];
        for(let o of this.bankAccountFlows){
          ids.push(o.flowId);
        }
        body.accountFlowIds=ids.join(',');
      }else if(this.repaymentNotify.accountRepaymentWay ===1){//线下还款参数填充
        body.fileLoadId=this.uploader.queue[0].customData['fileId'];
      }
      this.submitted = true;
      this.acceptSvc.acceptRepayment(body)
        .then((res)=> {
          this.submitted = false;
          if (res.ok) {
            this.pop.info({
              text: '受理成功！'
            }).onConfirm(()=>{
              this.successNavigate();
            }).onClose(()=>{
              this.successNavigate();
            });
          } else {
            this.pop.error({
              text: res.message || '受理失败！'
            });
          }
        })
        .catch((err)=> {
          this.submitted = false;
          this.pop.error({
            text: '请求失败，请重试！'
          });
        });
      }
  }

  private formatDate(date:Date){
    if(date instanceof  Date){
      let m=date.getMonth()+1;
      let d=date.getDate();
      return date.getFullYear()+'-'+(m>=10?m:'0'+m)+'-'+(d>=10?d:'0'+d);
    }
  }

  /**
   * 获取当期还款计划
   */
  getCurrentRepayPlan(){
    if(this.repaymentNotify&&this.repaymentNotify.currentPeriod){
      if(this.repaymentPlans.length){
        for(let o of this.repaymentPlans){
          if(this.repaymentNotify.currentPeriod==o.currentPeriod){
            return o;
          }
        }
      }
    }
  }


  /**
   * 获取误差金额
   */
  getErrorAmount(){
    if(this.curRepayment&&this.curRepayment.repaymentAmount){
      if(this.totalRelAmount||this.totalRelAmount===0){
        return this.totalRelAmount-this.curRepayment.repaymentAmount;
      }
    }
  }

  /**
   * 设置银行流水数据
   * @param val
   */
  setBankAccountFlows(val:BankAccountFlow[]){
    this.bankAccountFlows=val;
  }

  /**
   * 删除选择的银行流水
   * @param flowId
   */
  removeBankAccountFlow(flowId:string){
    console.log(flowId);
    let newArr=[];
    for(let i=0,len=this.bankAccountFlows.length;i<len;i++){
      if(flowId!==this.bankAccountFlows[i].flowId){
        newArr.push(this.bankAccountFlows[i]);
      }
    }
    this.bankAccountFlows=newArr;
  }

  initUploader() {
    // this.uploader=new Uploader();
    this.uploader.url = api_file.upload;

    this.uploader.onQueue((uploadFile)=> {
      console.log(uploadFile);
      uploadFile.addSubmitData('businessType', '0504');
      uploadFile.addSubmitData('fileName', uploadFile.fileName);
      uploadFile.addSubmitData('fileType', uploadFile.fileExtension);
      uploadFile.addSubmitData('fileSize', uploadFile.fileSize);
      uploadFile.addSubmitData('fileContent', uploadFile.getFile());
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = [uploadFile];
      }
      console.log(uploadFile);
    });
    this.uploader.onQueueAll(()=> {
      this.uploader.upload();
    });
    this.uploader.onSuccess((uploadFile, uploader, index)=> {//上传请求成功
      let response = JSON.parse(uploadFile.response);
      if (response.status == 200) {
        setTimeout(()=> {
          uploadFile.setSuccess();
        }, 1000);
        uploadFile.customData = {
          fileId: response.body.fileId
        };
      } else {
        uploadFile.setError();
      }
    });
    this.uploader.onError((uploadFile, uploader, index)=> {//上传请求失败
      uploadFile.setError();
    });
  }

  deleteUploadFile() {
    if (this.uploader.queue.length && this.uploader.queue[0].success) {
      this.commonSvc.deleteFile(this.uploader.queue[0].customData['fileId'])
        .then((res)=> {
          if (res.status) {
            this.uploader.queue[0].customData = null;
            this.uploader.queue = [];
          } else {
            this.toaster.error('', res.message || '删除失败！');
          }
        });
    } else {
      this.uploader.queue = [];
    }
  }

}
