import {Injectable} from '@angular/core';
import {Resource} from '../../../core/entity/Resource.entity';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
@Injectable()
export class BorrowConfigureService {
  constructor(
    private myHttp: MyHttpClient,
    private borrowSvc:BorrowService
  ) {

  }

  /**
   *加载资方/渠道
   * @param resourceType
   * @returns {Promise<Resource[]>}
   */
  loadResources(resourceType:number): Promise<Resource[]> {
    return this.borrowSvc.loadResources(resourceType);
  }

  /**
   * 完成配置合同
   * @param body
   * @returns Promise<{ok: boolean,message: string}>
   */
  finishContract(body: any): Promise<{ok: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.finishContract,
      query: body
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          message: ''
        };
        let result = res;
        data.ok = (result.status == 200);
        data.message = result.message;
        return Promise.resolve(data);
      });
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
        let result = res;
        data.ok = (result.status == 200);
        data.message = result.message;
        return Promise.resolve(data);
      });
  }
}
