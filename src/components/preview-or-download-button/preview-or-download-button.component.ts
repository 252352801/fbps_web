import {Component, Input, Output, EventEmitter, OnInit,ElementRef,OnChanges,SimpleChanges} from '@angular/core';
import {PreviewOrDownloadButtonService} from './preview-or-download-button.service';
import {api_file} from '../../services/config/app.config';
import {SharedService} from '../../app/shared/shared.service';
@Component({
  selector: 'preview-or-download-button',
  templateUrl: './preview-or-download-button.component.html',
  styleUrls: ['./preview-or-download-button.component.less'],
  providers: [PreviewOrDownloadButtonService]
})
export class PreviewOrDownloadButtonComponent implements OnInit,OnChanges{

  @Output() preview:EventEmitter<any>=new EventEmitter();
  @Output() previewImage:EventEmitter<any>=new EventEmitter();
  @Input() fileId:string;
  @Input() fileName:string;
  @Input() loadFile:any;
  @Input() styleClass:string;
  canPreview:boolean=false;
  downloadUrl:string='';
  constructor(
    private PODBSvc: PreviewOrDownloadButtonService,
    private sharedSvc: SharedService,
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
      this.downloadUrl=api_file.download+'?fileId='+fileIdChg.currentValue;
      if(this.loadFile){
        //this.PODBSvc.
        this.sharedSvc.getFileInfo(fileIdChg.currentValue)
          .then((res)=>{
            if(res.ok){
              this.fileName=res.data.fileName;
              this.canPreview = !!(this.isImg(this.fileName) || this.fileType(this.fileName) == 'pdf');
            }
          });
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
      this.preview.emit(api_file.preview+'?fileId='+this.fileId);
    }
  }
  triggerPreviewImage(){
    this.previewImage.emit(api_file.preview+'?fileId='+this.fileId);
  }
}


