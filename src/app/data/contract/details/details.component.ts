import {Component,ViewChild} from '@angular/core';
import {ContractDetailsService} from './details.service';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {fadeInAnimation} from '../../../../animations/index';
import {api_file} from '../../../../services/config/app.config';
import {SharedService} from '../../../shared/shared.service';
import {Resource} from '../../../../services/entity/Resource.entity';
import { Contract} from '../../../../services/entity/Contract.entity';
import { Signature} from '../../../../services/entity/Signature.entity';
import { FileInfo} from '../../../../services/entity/FileInfo.entity';

import { ModalComponent} from 'dolphinng';
@Component({
  selector: 'contract-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  providers: [ContractDetailsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class ContractDetailsComponent {

  loading: boolean = false;//是否在加载
  loadingSignatures:boolean=false;//是否在查询签章信息
  loadingFileInfo:boolean=false;//是否在查询附件信息
  downloadFileAddr:string=api_file.download;
  capitals:Resource[]=[];

  contract:Contract=new Contract();
  signatures:Signature[]=[];
  fileInfo:FileInfo;//合同附件

  showingFileUrl:string='';

  @ViewChild('fileModal') fileModal:ModalComponent;
  constructor(
    private contractDtSvc:ContractDetailsService,
    private actRoute:ActivatedRoute,
    private sharedSvc:SharedService,
    private router:Router
  ) {
    this.init();
  }

  init(){
    try {
      let data=JSON.parse(this.actRoute.snapshot.params['data']);
      this.contract=this.contract.initByObj(data);
    }catch (err){
    }
    if(this.contract.id){
      this.loadingSignatures=true;
      this.contractDtSvc.queryContractSignatories({contractId:this.contract.id})
        .then((res)=>{
          this.signatures=res;
          this.loadingSignatures=false;
        })
        .catch((err)=>{
          this.loadingSignatures=false;
        });

    }

    if(this.contract.fileId){
      this.loadingFileInfo=true;
      this.sharedSvc.getFileInfo(this.contract.fileId)
        .then((res)=>{
          this.loadingFileInfo=false;
          if(res.ok){
            this.fileInfo=res.data;
          }
        })
        .catch((err)=>{
          this.loadingFileInfo=false;
        });
    }

    this.sharedSvc.getCapitals()
      .then((res)=>{
        this.capitals=res;
      });
  }

  matchCapitalName(capitalId:string):string{
    if(this.capitals instanceof Array){
      for(let o of this.capitals){
        if(capitalId===o.resourceId){
          return o.resourceName;
        }
      }
    }
    return '';
  }

  isImg(str:string):boolean{
    let fileType=this.fileType(str);
    let imgArr=['jpg','jpeg','png','gif','bmp'];
    return imgArr.indexOf(fileType)>=0;
  }

  fileType(str:string):string{
    let sStr=str.split('.');
    let type=sStr[sStr.length-1].toLowerCase();
    return type;
  }


  createDownloadFileUrl(fileId:String):string{
    return api_file.download+'?fileId='+fileId;
  }

  createPreviewFileUrl(fileId:String):string{
    return api_file.preview+'?fileId='+fileId;
  }

  previewFile(fileType:string,fileId:string){
    let type=fileType.toLowerCase().replace(/\./g,'');
    if(type==='pdf'){
      this.showingFileUrl=this.createPreviewFileUrl(fileId);
      this.fileModal.open();
    }
  }
}
