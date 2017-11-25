import {Component, Injectable,Injector,Host} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopService,Toaster} from 'dolphinng';
import {AcceptService} from './accept.service';
import {SharedService} from '../../../shared/shared.service';
import {Loan} from '../../../../services/entity/Loan.entity';
import {ProveData} from '../../../../services/entity/ProveData.entity';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {fadeInAnimation} from '../../../../animations/index';
import {Uploader} from "dolphinng/modules/uploader/Uploader";
import {api_file} from '../../../../services/config/app.config';
import {myInjector,injector} from '../../../shared/myInjector.service';
import {AcceptBody} from './accept.interface';
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
  //defaultOpinion:string='审批无误，予以通过';
  submitted: boolean = false;

  proveDataOptions: ProveDataUploader[] = [];//产品证明材料列表
  constructor(private pop: PopService,
              private acceptSvc: AcceptService,
              protected sharedSvc: SharedService,
              private actRoute: ActivatedRoute,
              private oauthSvc: OauthService) {
    this.getLoanById()
      .then((data)=> {
        this.getProdProveData();
      });
    this.loadProducts();
  }

  getLoanById() {
    return this.acceptSvc.getLoanById(parseInt(this.actRoute.params['value']['id']))
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      });
  }

  getProdProveData(productId?: string) {
    let prodId = productId || this.loan.productId;
    this.acceptSvc.getProdProveData(prodId)
      .then((data: ProveData[])=> {
        if (data instanceof Array) {
          this.proveDataOptions = [];
          for (let pd of data) {
            let opt = new ProveDataUploader();
            opt.proveData=pd;
            this.proveDataOptions.push(opt);
          }
        }
/*
        this.proveDataOptions = [];
        for (let i=0;i<6;i++) {
          let pd=new ProveData();
          pd.fileType='0409';
          pd.fileTypeName=`证明材料`+(i+1);
          let opt = new ProveDataUploader();
          opt.proveData=pd;
          this.proveDataOptions.push(opt);
        }
        console.log(this.proveDataOptions);*/
      })
      .catch((err)=>{
      });
  }


  loadProducts() {
    this.acceptSvc.loadProducts()
      .then((res)=> {

      });
  }

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

  setIsPass(val: boolean) {
    this.isPassed = val;
  }

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
    console.log(body);
    this.acceptSvc.approveLoan(body)
      .then((res)=> {
        if (res.status) {
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
//----------------------------------------
@Injectable()
class ProveDataUploader{
  fileId: string=null;
  uploader: Uploader;
  proveData: ProveData;
  private sharedSvc:SharedService;
  private toaster:Toaster;
  constructor(

  ) {
    this.sharedSvc=myInjector.get(SharedService);
    this.toaster=injector([{provide:Toaster,useClass:Toaster}]).get(Toaster);
    this.initUploader();
  }

  initUploader() {
    this.uploader=new Uploader();
    this.uploader.url=api_file.upload;
    this.uploader.onQueue((uploadFile)=>{
      uploadFile.addSubmitData('businessType',this.proveData.fileType);
      uploadFile.addSubmitData('fileName',uploadFile.fileName);
      uploadFile.addSubmitData('fileType',uploadFile.fileExtension);
      uploadFile.addSubmitData('fileSize',uploadFile.fileSize);
      uploadFile.addSubmitData('fileContent',uploadFile.getFile());
      if(this.uploader.queue.length>1){
        this.uploader.queue=[uploadFile];
      }
      console.log(uploadFile);
    });
    this.uploader.onQueueAll(()=>{
      this.uploader.upload();
    });
    this.uploader.onSuccess((uploadFile,uploader,index)=>{//上传请求成功
      let response=JSON.parse(uploadFile.response);
      if(response.status==200){
        setTimeout(()=>{
          uploadFile.setSuccess();
        },1000);
        uploadFile.customData={
          fileId:response.body.fileId
        };
        this.fileId=response.body.fileId;
      }else{
        uploadFile.setError();
      }
    });
    this.uploader.onError((uploadFile,uploader,index)=>{//上传请求失败
      uploadFile.setError();
    });
  }

  deleteUploadFile(){
    if(this.uploader.queue.length&&this.uploader.queue[0].success&&this.fileId){
      this.sharedSvc.deleteFile(this.fileId)
        .then((res)=>{
          if(res.status){
            this.fileId=null;
            this.uploader.queue=[];
          }else{
            this.toaster.error('',res.message||'删除失败！');
          }
        });
    }else{
      this.uploader.queue=[];
    }
  }
}
