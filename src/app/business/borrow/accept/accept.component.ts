import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService,Toaster} from 'dolphinng';
import {AcceptService} from './accept.service';
import {BusinessService} from '../../business.service';
import {Loan} from '../../../../services/entity/Loan.entity';
import {SharedService} from '../../../shared/shared.service';
import {ProveData} from '../../../../services/entity/ProveData.entity';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {fadeInAnimation} from '../../../../animations/index';
import {AcceptBody} from './shared/AcceptBody';
import {ProveDataUploader} from './shared/ProveDataUploader';
@Component({
  selector: 'borrow-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.less'],
  providers: [PopService, AcceptService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': 'pending'}
})
export class AcceptComponent {
  isPassed: boolean;
  loan: Loan = new Loan();//贷款详情
  auditOneBy: string = this.oauthSvc.user.employeeName || this.oauthSvc.user.mobile;
  opinion: string = '';
  submitted: boolean = false;
  proveDataOptions: ProveDataUploader[] = [];//产品证明材料列表
  constructor(private pop: PopService,
              private sharedSvc: SharedService,
              private acceptSvc: AcceptService,
              protected businessSvc: BusinessService,
              private actRoute: ActivatedRoute,
              private oauthSvc: OauthService) {
    this.getLoanById()
      .then((data)=> {
        if(data.status==0){
          this.acceptSvc.acceptLoan({
            applyId:data.borrowApplyId,
            operator:this.oauthSvc.user.employeeName||this.oauthSvc.user.mobile
          });
        }
        this.getProdProveData();
      });
  }

  /**
   * 借款单详情
   * @returns {Promise<Loan>}
   */
  getLoanById():Promise<Loan> {
    return this.businessSvc.getLoanById(this.actRoute.snapshot.params['id'])
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      });
  }

  /**
   * 产品证明材料列表
   * @param productId
   */
  getProdProveData(productId?: string) {
    let prodId = productId || this.loan.productId;
    this.sharedSvc.prodProveData(prodId)
      .then((data: ProveData[])=> {
        if (data instanceof Array) {
          this.proveDataOptions = [];
          for (let pd of data) {
            let opt = new ProveDataUploader();
            opt.proveData=pd;
            this.proveDataOptions.push(opt);
          }
        }
      })
      .catch((err)=>{
      });
  }

  /**
   * 校验
   */
  validate() {
    //校验
    if (this.opinion === '') {
      this.pop.info({
        text: '请输入审批意见！'
      });
    } else {
      this.pop.confirm({
        text: this.isPassed ? '确认受理此贷款单？' : '确定拒绝此贷款单？',
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }).onConfirm(()=> {
        this.submit();
      });
    }
  }

  /**
   * 设置通过与否
   * @param val
   */
  setIsPass(val: boolean) {
    this.isPassed = val;
  }

  /**
   * 提交（一审)
   */
  submit() {
    let body:AcceptBody= {
      auditOneBy: this.auditOneBy,
      borrowApplyId: this.loan.borrowApplyId,
      remarks: this.opinion,
      status: this.isPassed ?2 : -2
    };
    if(body.status==2){
      body.financeProveDataVos=[];
      for(let o of this.proveDataOptions){
        if(o.fileId&&o.proveData&&o.uploader.queue.length&&o.uploader.queue[0].success){
          let fpv={
            fileType:o.proveData.fileType,
            fileLoadId:o.fileId
          };
          body.financeProveDataVos.push(fpv)
        }
      }
    }
    this.acceptSvc.approveLoan(body)
      .then((res)=> {
        if (res.ok) {
          this.pop.info({
            text: this.isPassed ? '受理成功！' : '已拒绝此贷款单！'
          }).onClose(()=> {
            history.back();
          }).onConfirm(()=> {
            history.back();
          });
        } else {
          this.pop.error({
            text: res.message || '受理失败！'
          });
        }
      })
      .catch(()=> {
        this.pop.error({
          text: '请求失败，请重试！'
        })
      });
  }
}

