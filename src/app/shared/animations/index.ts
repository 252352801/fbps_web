//从angular animations module 导入需要的动画方法
import {trigger,state,animate,transition,style} from '@angular/animations';
export const fadeInAnimation=
  //触发器名称，附加这个动画到元素上使用[@triggerName]语法
  trigger('fadeInAnimation',[
    transition('void => *', [
      style({opacity: 0,transform:'translate(-0px,-0px)'}),
      animate('.3s linear',style({opacity: 1,transform:'translate(0,0)'}))
    ])
  ]);
