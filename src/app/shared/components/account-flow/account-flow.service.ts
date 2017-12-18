import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import {BankAccount} from '../../../core/entity/BankAccount.entity';
@Injectable()
export class AccountFlowService {

  constructor(private myHttp:MyHttpClient){
  }

  /**
   * 银行账户信息
   * @param memberId
   * @returns Promise<BankAccount>
   */
  accountInfo(memberId:string):Promise<BankAccount>{
    return this.myHttp.post({
      api:this.myHttp.api.accountInfo,
      body:{
        memberId:memberId
      }
    }).toPromise()
      .then((res)=>{
        let result=res;
        let bankAccount=new BankAccount()
        if(result.status===200){
          if(result.body&&result.body.records&&result.body.records[0]){
            bankAccount=bankAccount.init(result.body.records[0]);
          }
        }
        return Promise.resolve(bankAccount);
      });
  }

}
