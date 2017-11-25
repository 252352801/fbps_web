import {Injectable} from '@angular/core';
import { Resource} from '../../../../services/entity/Resource.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ModifyProductConfService {

  constructor(private myHttp:MyHttpClient){
  }
  loadResources(query?: any): Promise<Resource[]> {
    return this.myHttp.get({
      api: this.myHttp.api.resource,
      query: query
    }).toPromise()
      .then((res)=> {
        let resources = [];
        let result = res;
        if (result.status === 200) {
          for(let o of result.body.records){
            let resource = new Resource();
            resource.resourceId=o.resourceId;
            resource.resourceName=o.resourceName;
            resources.push(resource);
          }
        }
        return Promise.resolve(resources);
      });
  }


  deleteProductConfig(id:string):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api: this.myHttp.api.deleteProductConfig,
      body: {
        id:id
      }
    }).toPromise()
      .then((res)=> {
        let data={
          status:false,
          message:'',
        };
        let result = res;
        data.status=(result.status == 200);
        data.message=result.message||'';
        return Promise.resolve(data);
      });
  }

  configProduct(body:{
    productId:string,
    appId:string,
    interestValue:number,
    interestType:number,
    paymentWay:number,
    rateCycle:string
  }):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api: this.myHttp.api.configProduct,
      body: body
    }).toPromise()
      .then((res)=> {
        let data={
          status:false,
          message:'',
        };
        let result = res;
        data.status=(result.status == 200);
        data.message=result.message||'';
        return Promise.resolve(data);
      });
  }
}
