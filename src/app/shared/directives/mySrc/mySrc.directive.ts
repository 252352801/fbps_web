import {Directive, OnInit, ElementRef, Input, Output, EventEmitter,OnChanges,SimpleChanges} from '@angular/core';
@Directive({
  selector: '[mySrc]'
})
export class MySrcDirective implements OnInit,OnChanges {
  @Input() mySrc:any;
  constructor(private elemRef: ElementRef) {

  }

  ngOnInit() {

  }
  ngOnChanges(changes:SimpleChanges) {
    let chg=changes['mySrc'];
    if((chg&&chg.currentValue!==chg.previousValue)){
      if(typeof this.mySrc==='string'){
        this.elemRef.nativeElement.setAttribute('src',this.mySrc);
      }
    }
  }


}
