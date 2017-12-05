import {Component,ViewChild,Input,OnInit,OnChanges,SimpleChanges} from '@angular/core';
import {ContractDetailsService} from './details.service';
import {fadeInAnimation} from '../../animations/index';
import {SharedService} from '../../app/shared/shared.service';
import {CommonService} from '../../services/common/common.service';
import {Resource} from '../../services/entity/Resource.entity';
import { Contract} from '../../services/entity/Contract.entity';
import { Signature} from '../../services/entity/Signature.entity';
import { FileInfo} from '../../services/entity/FileInfo.entity';


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
export class ContractDetailsComponent implements OnInit,OnChanges{

  @Input() mode:number=0;//0 默认  弹出框
  loading: boolean = false;//是否在加载
  loadingSignatures:boolean=false;//是否在查询签章信息
  loadingFileInfo:boolean=false;//是否在查询附件信息
  capitals:Resource[]=[];

  contract:Contract=new Contract();
  signatures:Signature[]=[];
  fileInfo:FileInfo;//合同附件
  @Input() data:any;
  @ViewChild('fileModal') fileModal:ModalComponent;
  @ViewChild('contentModal') contentModal:ModalComponent;
  constructor(
    private contractDtSvc:ContractDetailsService,
    private commonSvc:CommonService,
    private sharedSvc:SharedService,
  ) {
  }

  ngOnInit(){
   // this.init();
  }
  ngOnChanges(changes:SimpleChanges){
    let dataChg=changes['data'];
    if(dataChg&&dataChg.currentValue!==dataChg.previousValue){
      this.init();
    }
  }
  init(){
    try {
      let inputData=this.data;//JSON.parse(this.actRoute.snapshot.params['data']);
      let data;
      if(inputData&&typeof inputData==='string'){
        data=JSON.parse(inputData);
      }else if(inputData&&typeof inputData==='object'){
        data=inputData;
      }
      if(data){
        this.contract=this.contract.init(data);
      }
    }catch (err){
    }
    if(this.contract.contractId){
      this.loadingSignatures=true;
      this.contractDtSvc.queryContractSignatories({contractId:this.contract.contractId})
        .then((res)=>{
          this.signatures=res;
          this.loadingSignatures=false;
        })
       /* .catch((err)=>{
          console.log(err);
          this.loadingSignatures=false;
        });*/

    }

    if(this.contract.fileLoadId){
      this.loadingFileInfo=true;
      this.commonSvc.getFileInfo(this.contract.fileLoadId)
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

  open(data?:any){
    if(data){
      this.data=data;
      this.init();
    }
    this.contentModal.open();
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

}
