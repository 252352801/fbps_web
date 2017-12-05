import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RolloverUploadVoucherService} from './upload-voucher.service';
import {Rollover} from '../../../../../services/entity/Rollover.entity';
import {Loan} from '../../../../../services/entity/Loan.entity';
import {RolloverService} from '../rollover.service';
import {RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import {OauthService} from '../../../../../services/oauth/oauth.service';
import {fadeInAnimation} from '../../../../../animations/index';
import {ReviewInfo} from "../../../../../services/entity/ReviewInfo.entity";
import {CommonService} from '../../../../../services/common/common.service';
import {BusinessService} from '../../../business.service';
import {api_file} from '../../../../../services/config/app.config';
import {patterns} from '../../../../../services/config/patterns.config';
import {SharedService} from '../../../../shared/shared.service';
import {Uploader, Toaster, PopService} from 'dolphinng';
@Component({
  selector: 'rollover-upload-voucher',
  templateUrl: './upload-voucher.component.html',
  styleUrls: ['./upload-voucher.component.less'],
  providers: [RolloverUploadVoucherService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RolloverUploadVoucherComponent implements OnInit {
  rollover: Rollover = new Rollover();//展期详情
  loan: Loan = new Loan();//贷款详情
  repayPlans: RepayPlan[] = [];//还款计划
  submitted: boolean;//是否在提交
  //firstReviewInfo: ReviewInfo = new ReviewInfo();//一审信息
  //secondReviewInfo: ReviewInfo = new ReviewInfo();//二审信息
  fileId: string;//上传的文件的ID
  uploader: Uploader = new Uploader();

  patterns=patterns;
  constructor(public toaster: Toaster,
              public pop: PopService,
              public RUVSvc: RolloverUploadVoucherService,
              public rolloverSvc: RolloverService,
              private commonSvc: CommonService,
              private businessSvc: BusinessService,
              private oauth: OauthService,
              private sharedSvc: SharedService,
              private actRoute: ActivatedRoute) {
    this.initUploader();
  }

  ngOnInit() {
    let id = this.actRoute.snapshot.params['id'];
    this.rolloverSvc.getRolloverById(id)
      .then((res)=> {
        this.rollover = res;
        return Promise.resolve(this.businessSvc.getLoanById(res.borrowApplyId));
      })
      .then((loan)=> {
        this.loan = loan;
        return this.businessSvc.getRepayPlans(this.loan.borrowApplyId);
      })
      .then((res)=> {
        this.repayPlans = res;
      })
      .catch((err)=> {
      });
    //this.getReviewInfo();
  }

  /**
   * 获取审核信息
   */
/*  getReviewInfo() {
    let applyId = this.actRoute.snapshot.params['id'];
    let body1 = {//一审
      type: 2,
      id: applyId,
      status2: 2
    };
    this.commonSvc.querySystemLog(body1)
      .then((res)=> {
        console.log(res);
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
      type: 2,
      id: applyId,
      status2: 3
    };
    this.commonSvc.querySystemLog(body2)
      .then((res)=> {
        console.log(res);
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

  }*/


  initUploader() {
    this.uploader.url = api_file.upload;
    this.uploader.onQueue((uploadFile)=> {
      uploadFile.addSubmitData('businessType', '0504');
      uploadFile.addSubmitData('fileName', uploadFile.fileName);
      uploadFile.addSubmitData('fileType', uploadFile.fileExtension);
      uploadFile.addSubmitData('fileSize', uploadFile.fileSize);
      uploadFile.addSubmitData('fileContent', uploadFile.getFile());
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = [uploadFile];
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
        this.fileId = response.body.fileId;
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
            this.fileId = '';
          } else {
            this.toaster.error('', res.message || '删除失败！');
          }
        });
    } else {
      this.uploader.queue = [];
      this.fileId = '';
    }
  }

  submit() {
    let body = {
      rolloverApplyId:this.rollover.rolloverApplyId,
      fileLoadId:this.fileId,
      rolloverDeposit:this.rollover.rolloverDeposit,
      repaymentInterest:this.rollover.repaymentInterest/100,
      operator:this.oauth.user.employeeName||this.oauth.user.mobile
    };
    this.submitted=true;
    this.RUVSvc.addProveData(body)
      .then((res)=> {
        this.submitted=false;
        if (res.ok) {
          this.pop.info('已添加缴费凭证！')
            .onConfirm(()=>{
              history.back();
            })
            .onClose(()=>{
              history.back();
            });
        } else {
          this.pop.info(res.message||'添加缴费凭证失败！');
        }
      })
      .catch((err)=> {
        this.submitted=false;
        this.pop.info('请求失败！');
      })
  }
}
