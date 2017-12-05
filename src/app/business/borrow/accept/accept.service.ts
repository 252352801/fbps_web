import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { AcceptBody} from './shared/AcceptBody';
@Injectable()
export class AcceptService{
  constructor(
    private myHttp:MyHttpClient
  ){
  }

  acceptLoan(body:{
    applyId:string,
    operator:string
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.acceptLoan,
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

  /**
   * 审批
   * @param body
   * @returns Promise<{status:boolean,message:string}>
   */
  approveLoan(body:AcceptBody):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.firstApprove,
      query:body
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

}
