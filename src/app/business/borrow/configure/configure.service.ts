import {Injectable} from '@angular/core';
import {Resource} from '../../../../services/entity/Resource.entity';
import {MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
@Injectable()
export class BorrowConfigureService {
  constructor(
    private myHttp: MyHttpClient,
    private borrowSvc:BorrowService
  ) {

  }
  loadResources(resourceType:number): Promise<Resource[]> {
    return this.borrowSvc.loadResources(resourceType);
  }

  finishContract(body: any): Promise<{status: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.finishContract,
      query: body
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
}
