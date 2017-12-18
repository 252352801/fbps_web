import {Component, Input, Output, EventEmitter, OnInit,ElementRef,OnChanges,SimpleChanges} from '@angular/core';
import {FileButtonsService} from './file-btns.service';
import {config} from '../../../core/config/app.config';
import {CommonService} from '../../../core/services/common/common.service';
@Component({
  selector: 'file-buttons',
  templateUrl: './file-btns.component.html',
  styleUrls: ['./file-btns.component.less'],
  providers: [FileButtonsService]
})
export class FileButtonsComponent implements OnInit,OnChanges{

  @Output() preview:EventEmitter<any>=new EventEmitter();
  @Output() previewImage:EventEmitter<any>=new EventEmitter();
  @Input() fileId:string;
  @Input() fileName:string;
  @Input() styleClass:string;

  @Input() isPreview:boolean=true;
  @Input() isDownload:boolean=true;
  @Input() isDelete:boolean=false;
  @Input() isLoadFile:any;

  canPreview:boolean=false;
  downloadUrl:string='';
  constructor(
    private commonSvc: CommonService,
    private fileBtnsSvc: FileButtonsService,
    private elemRef: ElementRef
  ) {

  }

  ngOnInit(){
    this.elemRef.nativeElement.style.verticalAlign='middle';
  }
  ngOnChanges(changes:SimpleChanges){
    //name
    let fileNameChg=changes['fileName'];
    if(fileNameChg&&fileNameChg.currentValue&&fileNameChg.currentValue!=fileNameChg.previousValue){
      let fileName=fileNameChg.currentValue;
      if(fileName.indexOf('.')>=0) {
        this.canPreview = !!(this.isImg(fileName) || this.fileType(fileName) == 'pdf');
      }
    }
    //
    let fileIdChg=changes['fileId'];
    if(fileIdChg&&fileIdChg.currentValue&&fileIdChg.currentValue!=fileIdChg.previousValue){
      this.downloadUrl=config.api.downloadFile.url+'?fileId='+fileIdChg.currentValue;
      if(this.isLoadFile){
        //this.PODBSvc.
        this.commonSvc.getFileInfo(fileIdChg.currentValue)
          .then((res)=>{
            if(res.ok){
              this.fileName=res.data.fileName;
              this.canPreview = !!(this.isImg(this.fileName) || this.fileType(this.fileName) == 'pdf');
            }
          }).catch((res)=>{});
      }
    }
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

  triggerPreview(){
    if(this.isImg(this.fileName)){
      this.triggerPreviewImage();
    }else{
      this.preview.emit(config.api.previewFile.url+'?fileId='+this.fileId);
    }
  }
  triggerPreviewImage(){
    this.previewImage.emit(config.api.previewFile.url+'?fileId='+this.fileId);
  }
}


