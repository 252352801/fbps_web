import {Injectable} from '@angular/core';
import { MyHttpClient} from '../core/services/myHttp/myhttpClient.service';
@Injectable()
export class ModifyPasswordService{
  constructor(private myHttp:MyHttpClient){

  }

  setPassword(body:{
    employeeId:string,
    oldPwd:string,
    pwd:string,
    type:number|string
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.setPassword,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        let response=res;
        data.ok=(response.status==200);
        data.message=response.message;
        return Promise.resolve(data);
      });
  }
}
