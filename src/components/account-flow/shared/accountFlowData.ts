import {BankAccountFlow} from '../../../services/entity/BankAccountFlow.entity';
export class AccountFlowData{
  selected:boolean;
  bankAccountFlow:BankAccountFlow;
  static create(bankAccountFlow:BankAccountFlow):AccountFlowData{
    let instance=new AccountFlowData();
    instance.selected=false;
    instance.bankAccountFlow=bankAccountFlow;
    return instance;
  }

}
