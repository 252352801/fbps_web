import { Component} from '@angular/core';
import {Uploader} from 'dolphinng'
@Component({
    selector: 'system-log',
    templateUrl: './systemLog.component.html',
    styleUrls: ['./systemLog.component.less'],
})
export class SystemLogComponent {

  uploader:Uploader=new Uploader();
  constructor(){
  }
}
