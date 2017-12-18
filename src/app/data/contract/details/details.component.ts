import {Component,ViewChild} from '@angular/core';
import {ContractDetailsService} from './details.service';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {fadeInAnimation} from 'app/shared/animations/index';
import { Contract} from '../../../core/entity/Contract.entity';

import { ModalComponent} from 'dolphinng';
@Component({
  selector: 'contract-details-page',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  providers: [ContractDetailsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class ContractDetailsPageComponent {

  contract:Contract=new Contract();
  @ViewChild('fileModal') fileModal:ModalComponent;
  constructor(
    private actRoute:ActivatedRoute,
  ) {
    this.init();
  }

  init(){
    try {
      let data=JSON.parse(this.actRoute.snapshot.params['data']);
      this.contract=this.contract.init(data);
    }catch (err){
    }
  }
}
