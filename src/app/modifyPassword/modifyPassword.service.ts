import {Injectable} from '@angular/core';
import { MyHttpClient} from 'services/myHttp/myhttpClient.service';
import { host_oauth} from 'services/config/app.config';
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
      url:host_oauth+'iam/employee/setPwd',
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
