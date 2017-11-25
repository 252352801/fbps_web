import {Directive, OnInit, ElementRef, Input, Output, EventEmitter} from '@angular/core';
@Directive({
  selector: '[contentModel]'
})
export class ContentModelDirective implements OnInit {
  @Input() contentModel: any;
  @Output() contentModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private elemRef: ElementRef) {

  }

  ngOnInit() {
    this.elemRef.nativeElement.innerHTML=this.contentModel;
    //this.elemRef.nativeElement.setAttribute('contentEditable',true);
    this.elemRef.nativeElement.addEventListener('keyup', (ev)=> {
      let e = ev || window.event;
      let target = e.target || e.srcElement;
      this.contentModelChange.emit(target.innerHTML);
    });
  }
}
