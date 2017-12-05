import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ConfigService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 删除合同
   * @param id
   * @returns Promise<{status: boolean,message: string}>
   */
  removeContract(id:string): Promise<{status: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.deleteContract,
      body:{
        contractId:id
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          status: false,
          message: ''
        };
        let result = res;
        data.status = (result.status == 200);
        data.message = result.message;
        return Promise.resolve(data);
      });
  }

  finishContract(body:{
    rolloverApplyId:string,
    operator:string,
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.finishRolloverContract,
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
