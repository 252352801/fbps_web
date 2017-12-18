import {Component} from '@angular/core';
import {Contract} from '../../core/entity/Contract.entity';
import {Paginator} from '../../core/entity/Paginator.entity';
import {CommonService} from '../../core/services/common/common.service';
import {FinanceContractService} from './financeContract.service';
@Component({
  selector: 'finance-ontract',
  templateUrl: './financeContract.component.html',
  styleUrls: ['./financeContract.component.less'],
  providers:[FinanceContractService]
})
export class FinanceContractComponent {
  tableData: Contract[];
  loading: boolean = false;
  params: {
    companyName: string,
    borrowApplyId: string
  } = {
    companyName: '',
    borrowApplyId: ''
  };
  paginator: Paginator = new Paginator;

  constructor(
    private commonSvc: CommonService,
    private contractSvc: FinanceContractService
  ) {
  }

  resetParams() {
    this.params.companyName = '';
    this.params.borrowApplyId = '';
  }

  query() {
    let query = {
      companyName: this.params.companyName,
      borrowApplyId: this.params.borrowApplyId,
      page: this.paginator.index + 1,
      rows: this.paginator.size
    };
    this.loading = true;
    this.commonSvc.queryContracts(query)
      .then((data)=> {
        this.tableData = data.items;
        this.paginator.count = data.count;
        this.loading = false;
      })
      .catch((err)=> {
        this.loading = false;
      })

  }
  search() {
    this.paginator.reset();
    this.tableData = [];
    this.query();
  }
}


