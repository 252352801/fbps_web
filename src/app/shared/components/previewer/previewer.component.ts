import {Component,OnInit,OnChanges,SimpleChanges,ElementRef, Input, Output,ViewChild,EventEmitter} from '@angular/core';

@Component({
  selector: 'previewer',
  templateUrl: './previewer.component.html',
  styleUrls: ['./previewer.component.less'],
  providers: []
})
export class PreviewerComponent implements OnInit,OnChanges{
  visible:boolean=false;
  defaultTitle:string='文件预览';
  title:string='';
  url:string='';

  @Output() onOpen:EventEmitter<any>=new EventEmitter();
  @Output() onClose:EventEmitter<any>=new EventEmitter();
  @ViewChild('iframe') iframe:ElementRef;
  constructor(
  ) {

  }

  open(url:string,title?:string){
    this.url=url;
    this.title=title||this.defaultTitle;
    this.visible=true;
    setTimeout(()=>{
      this.iframe.nativeElement.setAttribute('src',this.url);
    });
    this.onOpen.emit(this.visible);
  }
  close(){
    this.visible=false;
    this.onClose.emit(this.visible);
  }
  ngOnInit(){

  }
  ngOnChanges(changes:SimpleChanges){

  }
}


