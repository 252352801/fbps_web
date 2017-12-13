import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService, Toaster} from 'dolphinng';
import {LoanService} from './loan.service';
import {Uploader} from 'dolphinng';
import {Loan} from '../../../../services/entity/Loan.entity';
import {Contract} from "../../../../services/entity/Contract.entity";
import {Resource} from '../../../../services/entity/Resource.entity';
import {fadeInAnimation} from '../../../../animations/index';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {BankCard} from '../../../../services/entity/BankCard.entity';
import {BankAccount} from '../../../../services/entity/BankAccount.entity';
import {RepayPlanPreview} from '../../../../services/entity/RepayPlanPreview.entity';
import {ProveData} from "../../../../services/entity/ProveData.entity";
import {ReviewInfo} from "../../../../services/entity/ReviewInfo.entity";
import {CommonService} from "../../../../services/common/common.service";
import {BusinessService} from "../../business.service";
import {LoanFlow} from '../../../../services/entity/LoanFlow.entity';
import {config} from '../../../../services/config/app.config';
import {SharedService} from '../../../shared/shared.service';
import {BorrowService} from '../borrow.service';
import {md5} from '../../../../services/encrypt/md5';
@Component({
  selector: 'loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.less'],
  providers: [PopService, LoanService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': 'pending'}
})
export class LoanComponent{
  type: string;//放款方式
  loan: Loan = new Loan();//贷款详情
  resources: Resource[] = [];
  contracts: Contract[] = [];
  bankCard: BankCard = new BankCard();
  bankAccount: BankAccount = new BankAccount();

  loanTime: string = '';//放款日期
  repayPlanPreview: RepayPlanPreview[] = [];
  modalConfirm = {
    visible: false,
    data: null,
    balance: null,
    auditPwd: '',
    submitted: false
  };
  auditOneBy: string = this.oauthSvc.user.employeeName || this.oauthSvc.user.mobile;
  opinion: string = '';
  submitted: boolean = false;

  proveData: ProveData[] = [];
  firstReviewInfo: ReviewInfo = new ReviewInfo();//一审信息
  secondReviewInfo: ReviewInfo = new ReviewInfo();//二审信息
  loanFlows: LoanFlow[] = [];//账户流水

  uploader: Uploader = new Uploader();

  constructor(private actRoute: ActivatedRoute,
              private oauthSvc: OauthService,
              private businessSvc: BusinessService,
              private BorrowSvc: BorrowService,
              private loanSvc: LoanService,
              private sharedSvc: SharedService,
              private commonSvc: CommonService,
              private toaster: Toaster,
              private pop: PopService) {
    this.getLoanById()
      .then((res)=> {
        this.loanTime = this.loan.loanTime || '';
        this.getBankCard();
        this.getBankAccount();
        if (this.loanTime) {
          this.createRepayPlanPreview(this.loanTime);
        }
        if (this.loan.toWhere == 1) {
          this.initUploader();
        } else if (this.loan.toWhere == 2) {
          this.getLoanFlows();
        }
      });
    this.getProveData();
    this.getReviewInfo();
    this.getContracts();
    this.loadResources();
    this.initUploader();

  }
  getLoanById(): Promise<any> {
    return this.businessSvc.getLoanById(this.actRoute.snapshot.params['id'])
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      })
      .catch((err)=> {

      });
  }

  getLoanFlows() {
    this.commonSvc.loanFlows({
      borrowApplyId:this.actRoute.snapshot.params['id']
    })
      .then((res)=> {
        this.loanFlows = res;
      })
      .catch((err)=> {
      });
  }

  getProveData() {
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
  getReviewInfo() {
    let borrowApplyId = this.actRoute.snapshot.params['id'];
    let body1 = {//一审
      type: 0,
      id: borrowApplyId,
      status2: 2
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
    let body2 = {//二审
      type: 0,
      id: borrowApplyId,
      status2: 3
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

  getContracts() {
    this.sharedSvc.queryContracts({
      borrowApplyId: this.actRoute.snapshot.params['id'],
      page: 1,
      rows: 100000
    })
      .then((res)=> {
        this.contracts = res.items;
      });
  }


  loadResources() {
    this.loanSvc.loadResources(1)
      .then((data)=> {
        this.resources = data;
      })
  }


  openConfirmModal() {
    this.modalConfirm.submitted = false;
    this.modalConfirm.visible = true;
  }

  closeConfirmModal() {
    this.modalConfirm.visible = false;
  }

  getBankCard() {
    this.loanSvc.getBankCard({
      memberId: this.loan.memberId,
      type: 0
    }).then((res)=> {
      if (res.ok) {
        this.bankCard = res.data;
      }
      //dev
      /*this.bankCard.cardNo = '00000000000000001';
      this.bankCard.cardName = '哈哈哈';
      this.bankCard.bankName = '工商银行';*/

    });
  }

  getBankAccount() {
    this.sharedSvc.bankAccount({
      memberId: this.loan.memberId
    })
      .then((res)=> {
        if (res.ok) {
          this.bankAccount = res.data;
        }
        //dev
        /*this.bankAccount.bankAccount = '00000000000000001';
        this.bankAccount.accountName = '溜溜溜';
        this.bankAccount.availableBalance = 100000;*/
      })
      .catch((res)=> {
      });
  }


  confirm() {
    if (!this.loanTime) {
      this.pop.info({
        text: '请选择放款时间！'
      });
    } else if (this.loan.toWhere == 1 && (this.uploader.queue.length === 0 || !this.uploader.queue[0].customData)) {
      this.pop.info({
        text: '请上传放款凭证！'
      });
    } else {
      this.openConfirmModal();
    }
  }

  submit() {
    if (this.loan.toWhere == 1) {//线下
      let body = {
        borrowApplyId: this.loan.borrowApplyId,
        loanTime: this.loanTime,
        auditOneBy: this.auditOneBy,
        fileLoadId: this.uploader.queue[0].customData['fileId']
      };
      this.modalConfirm.submitted = true;
      this.loanSvc.loanOffline(body)
        .then((res)=> {
          this.modalConfirm.submitted = false;
          this.closeConfirmModal();
          if (res.ok) {
            this.pop.info('线下放款成功！')
              .onConfirm(()=> {
                history.back();
              })
              .onClose(()=> {
                history.back();
              });
          } else {
            this.pop.error(res.message||'线下放款失败！');
          }
        })
        .catch((err)=> {
          this.modalConfirm.submitted = false;
          this.toaster.error('', '请求失败，请重试！');
        })
    } else if (this.loan.toWhere == 2) {//线上
      let body= {
        borrowApplyId: this.loan.borrowApplyId,
        loanTime: this.loanTime,
        auditOneBy: this.auditOneBy,
        toBankName: this.bankCard.bankName,
        toBankNo: this.bankCard.cardNo,
        toBankSub: this.bankCard.subbankName,
        toLineNo: this.bankCard.lineNo,
        toAccountName: this.bankAccount.accountName,
        employeeId: this.oauthSvc.user.employeeId,
        auditPwd: md5(this.modalConfirm.auditPwd)
      };
      this.modalConfirm.submitted = true;
      this.loanSvc.loanOnline(body)
        .then((res)=> {
          this.modalConfirm.submitted = false;
          this.closeConfirmModal();
          if (res.ok) {
            this.pop.info('线上放款成功！')
              .onConfirm(()=> {
                history.back();
              })
              .onClose(()=> {
                history.back();
              });
          } else {
            this.pop.error(res.message || '线上放款失败！');
          }
        })
        .catch((err)=> {
          this.modalConfirm.submitted = false;
          this.toaster.error('', '请求失败，请重试！');
        })
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
    this.BorrowSvc.createRepayPlanPreview(body)
      .then((res)=> {
        this.repayPlanPreview = res;
      })
      .catch((err)=> {

      });
  }

  initUploader() {
    this.uploader.url = config.api.uploadFile.url;
    this.uploader.onQueue((uploadFile)=> {
      uploadFile.addSubmitData('businessType', '0504');
      uploadFile.addSubmitData('fileName', uploadFile.fileName);
      uploadFile.addSubmitData('fileType', uploadFile.fileExtension);
      uploadFile.addSubmitData('fileSize', uploadFile.fileSize);
      uploadFile.addSubmitData('fileContent', uploadFile.getFile());
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = [uploadFile];
      }
      if(uploadFile.fileName.length>50){
        this.pop.info('文件名不能大于50个字符！');
        this.uploader.queue=[];
      }
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
