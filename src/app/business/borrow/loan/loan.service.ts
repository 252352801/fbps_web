import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
import {Contract} from "../../../core/entity/Contract.entity";
import {Resource} from '../../../core/entity/Resource.entity';
import {BankCard} from '../../../core/entity/BankCard.entity';
@Injectable()
export class LoanService{
  constructor(
    private myHttp:MyHttpClient,
    private borrowSvc:BorrowService
  ){

  }

  /**
   * 线上放款
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  loanOnline(body:{
    borrowApplyId:string,
    loanTime:string,
    auditOneBy:string,
    toBankName:string,
    toBankNo:string,
    toBankSub:string,
    toLineNo:string,
    toAccountName:string,
    employeeId:string,
    auditPwd:string,
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.loanOnline,
      body:body
    }).toPromise()
      .then((res)=>{
        let result={
          ok:false,
          message:''
        };
        result.ok=(res.status==200);
        result.message=res.message;
        return Promise.resolve(result);
      });
  }

  /**
   * 线下放款
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  loanOffline(body:{
    borrowApplyId:string,
    loanTime:string,
    auditOneBy:string,
    fileLoadId:string
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.loanOffline,
      body:body
    }).toPromise()
      .then((res)=>{
        let result={
          ok:false,
          message:''
        };
        result.ok=(res.status==200);
        result.message=res.message;
        return Promise.resolve(result);
      });
  }

  loadResources(resourceType:number): Promise<Resource[]> {
    return this.borrowSvc.loadResources(resourceType);
  }

  getBankCard(query:{
    memberId:string,
    type:number
  }):Promise<{ok: boolean,data: BankCard}>{
    return this.myHttp.get({
      api: this.myHttp.api.getBankCard,
      query: query
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          data:null
        };
        let result = res;
        let bk=new BankCard();
        data.ok = (result.status == 200);
        data.data = bk.init(result.body);
        return Promise.resolve(data);
      });
  }
}
