import {Component,OnInit,OnChanges,SimpleChanges,ElementRef, Input, Output,ViewChild} from '@angular/core';

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
  }
  close(){
    this.visible=false;
  }
  ngOnInit(){

  }
  ngOnChanges(changes:SimpleChanges){

  }
}


