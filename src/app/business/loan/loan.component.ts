import { Component} from '@angular/core';
import { Router} from '@angular/router';
@Component({
    selector: 'loaning',
    templateUrl: './loan.component.html',
    styleUrls: ['./loan.component.less'],
})
export class LoanComponent {
  constructor(private router:Router){
  //  this.router.navigate(['/business/loan/inProcess']);
  }
}
