import {Injectable} from '@angular/core';
import {Uploader} from "dolphinng";
import {config} from 'services/config/app.config';
import {myInjector} from '../../../../shared/myInjector.service';
import {ProveData} from 'services/entity/ProveData.entity';
import {SharedService} from '../../../../shared/shared.service';
import {CommonService} from '../../../../../services/common/common.service';
import {Toaster,PopService} from 'dolphinng';
@Injectable()
export class ProveDataUploader{
  fileId: string=null;
  uploader: Uploader;
  proveData: ProveData;
  private sharedSvc:SharedService;
  private commonSvc:CommonService;
  private toaster:Toaster;
  private pop:PopService;
  constructor(

  ) {
    this.sharedSvc=myInjector.get(SharedService);
    this.commonSvc=myInjector.get(CommonService);
    this.toaster=myInjector.get(Toaster);
    this.pop=myInjector.get(PopService);
    this.initUploader();
  }

  initUploader() {
    this.uploader=new Uploader();
    this.uploader.url=config.api.uploadFile.url;
    this.uploader.onQueue((uploadFile)=>{
      uploadFile.addSubmitData('businessType',this.proveData.fileType);
      uploadFile.addSubmitData('fileName',uploadFile.fileName);
      uploadFile.addSubmitData('fileType',uploadFile.fileExtension);
      uploadFile.addSubmitData('fileSize',uploadFile.fileSize);
      uploadFile.addSubmitData('fileContent',uploadFile.getFile());
      if(this.uploader.queue.length>1){
        this.uploader.queue=[uploadFile];
      }
      if(uploadFile.fileName.length>50){
        this.pop.info('文件名不能大于50个字符！');
        this.uploader.queue=[];
      }
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
      this.commonSvc.deleteFile(this.fileId)
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
