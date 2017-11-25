import {Injectable} from '@angular/core';
import { Loan} from '../../../services/entity/Loan.entity';
import { MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
@Injectable()
export class HistoryService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询贷款申请列表
   */
  queryLoans(query:QueryLoanBody):Promise<{count:number,items:Loan[]}>{

    return this.myHttp.get({
      api:this.myHttp.api.loanList,
      query:query
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        let result=res;
        if(result.status===200){
          data.count=result.body.paginator.totalCount;
          for(let l of result.body.records){
            let loan=new Loan().initByObj(l);
            data.items.push(loan);
          }
        }
        return Promise.resolve(data);
      });

  }

}

export interface QueryLoanBody{
  companyName?:string,
  status?:number|string,
  borrowApplyId?:string,
  limitDay?:number,
  page?:number,
  rows?:number,
  beginTime?:string,
  endTime?:string,
}
