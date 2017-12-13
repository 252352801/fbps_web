import {Injectable} from '@angular/core';
import { Resource} from '../../../../services/entity/Resource.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
@Injectable()
export class ModifyProductConfService {

  constructor(private myHttp:MyHttpClient){
  }
  /**
   * 加载资方/渠道
   * @param query
   * @returns Promise<Resource[]>
   */
  loadResources(query?: any): Promise<Resource[]> {
    return this.myHttp.get({
      api: this.myHttp.api.resource,
      query: query
    }).toPromise()
      .then((res)=> {
        let resources = [];
        if (res.status === 200) {
          for(let o of res.body.records){
            let resource = new Resource();
            resource.resourceId=o.resourceId;
            resource.resourceName=o.resourceName;
            resources.push(resource);
          }
        }
        return Promise.resolve(resources);
      });
  }

  /**
   *删除产品配置
   * @param id
   * @returns Promise<{ok:boolean,message:string}>
   */
  deleteProductConfig(id:string):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api: this.myHttp.api.deleteProductConfig,
      body: {
        id:id
      }
    }).toPromise()
      .then((res)=> {
        let data={
          ok:false,
          message:'',
        };
        data.ok=(res.status == 200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }

  /**
   * 配置产品
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  configProduct(body:{
    productId:string,
    appId:string,
    interestValue:number,
    interestType:number,
    paymentWay:number,
    rateCycle:string
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api: this.myHttp.api.configProduct,
      body: body
    }).toPromise()
      .then((res)=> {
        let data={
          ok:false,
          message:'',
        };
        data.ok=(res.status == 200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }
}
