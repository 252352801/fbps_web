import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../core/services/myHttp/myhttpClient.service';
@Injectable()
export class RolloverUploadVoucherService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 上传凭证
   * @param body
   * @returns  Promise<{ok:boolean,message:string}>
   */
  addProveData(body:{
    rolloverApplyId:string,
    fileLoadId:string,
    rolloverDeposit:string|number,
    repaymentInterest:string|number,
    operator?:string,
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.addProveData,
      body:body
    }).toPromise()
      .then((res)=>{
        let result={ok:false,message:''};
        result.ok=(res.status==200);
        result.message=res.message;
        return Promise.resolve(result);
      });
  }

}
