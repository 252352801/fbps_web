import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import {SystemLog} from '../../../core/entity/SystemLog.entity';
export  interface SystemLogSearchParams {
  type?:number|string;//1贷款类  2还款类  3展期类
  id?: string;
  page?: number;
  rows?: number;
  status2?: number;
}
@Injectable()
export class SystemLogsService {

  constructor(
    private myHttp: MyHttpClient
  ) {

  }
  query(body:SystemLogSearchParams):Promise<{count:number,items:SystemLog[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.systemLogs,
      body:body
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        let result=res;
        if(result.status===200){
          data.count=result.body.paginator.totalCount;
          for(let o of result.body.records){
            let sysLog=new SystemLog().init(o);
            data.items.push(sysLog);
          }
        }
        return Promise.resolve(data);
      });
  }

}
