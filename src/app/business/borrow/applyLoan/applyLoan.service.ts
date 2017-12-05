import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
import {Contract} from "../../../../services/entity/Contract.entity";
import {Resource} from '../../../../services/entity/Resource.entity';
import {BankCard} from '../../../../services/entity/BankCard.entity';
import {RepayPlanPreview} from '../../../../services/entity/RepayPlanPreview.entity';
@Injectable()
export class ApplyLoanService{
  constructor(
    private myHttp:MyHttpClient,
    private borrowSvc:BorrowService
  ){

  }
  applyPayOnline(body:any):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.applyPayOnline,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        let result=res;
        data.ok=(result.status==200);
        data.message=result.message;
        return Promise.resolve(data);
      });
  }
  applyPayOffline(body:any):Promise<{ok:boolean,message:string}>{

    return this.myHttp.post({
      api:this.myHttp.api.applyPayOffline,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        let result=res;
        data.ok=(result.status==200);
        data.message=result.message;
        return Promise.resolve(data);
      });
  }

  loadResources(resourceType:number): Promise<Resource[]> {
    return this.borrowSvc.loadResources(resourceType);
  }

  groupContractsByCapitalId(contracts:Contract[]):{capitalId:string,contracts:Contract[]}[]{
    let map={};
    for(let o of contracts){
      if(!map[o.resourceId]){
        map[o.resourceId]={
          items:[]
        };
      }
      map[o.resourceId].items.push(o);
    }
    let result:{capitalId:string,contracts:Contract[]}[]=[];
    for(let o in map){
      result.push({
        capitalId:o,
        contracts:map[o].items
      });
    }
    return result;
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
