import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../../core/services/myHttp/myhttpClient.service';
@Injectable()
export class ConfigService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 删除合同
   * @param id
   * @returns Promise<{ok: boolean,message: string}>
   */
  removeContract(id:string): Promise<{ok: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.deleteContract,
      body:{
        contractId:id
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          message: ''
        };
        data.ok = (res.status == 200);
        data.message = res.message;
        return Promise.resolve(data);
      });
  }

  /**
   * 完成配置合同
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
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
