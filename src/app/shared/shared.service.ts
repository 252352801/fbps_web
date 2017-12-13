import {Injectable} from '@angular/core';
import {AsideMenu} from '../../services/entity/AsideMenu.entity';
import {Resource} from '../../services/entity/Resource.entity';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
import {QueryContractBody} from './shared.interfaces';
import {ProveData} from '../../services/entity/ProveData.entity';
import {BankAccount} from '../../services/entity/BankAccount.entity';
import {Contract} from '../../services/entity/Contract.entity';
@Injectable()
export class SharedService{
  asideMenus:AsideMenu[]=[];//左侧菜单
  capitals:Resource[]=[];//资方
  constructor(
    private myHttp:MyHttpClient
  ){

  }

  /**
   * 获取资方列表
   * @returns {any}
   */
  getCapitals(): Promise<Resource[]> {
    if(this.capitals.length>0){
      return Promise.resolve(this.capitals);
    }else{
      return this.myHttp.get({
        api: this.myHttp.api.resource,
        query: {
          resourceType:1
        }
      }).toPromise()
        .then((res)=> {
          let resources = [];
          let result = res;
          if (result.status === 200) {
            for (let o of result.body.records) {
              let resource = new Resource().init(o);
              resources.push(resource);
            }
          }
          return Promise.resolve(resources);
        });
    }
  }

  /**
   * 退出登录
   * @param body
   * @returns {Promise<Promise<{ok: boolean, message: string}>>|PromiseLike<{ok: boolean, message: string}>|wdpromise.Promise<T>|promise.Promise<Promise<{ok: boolean, message: string}>>|Promise<{ok: boolean, message: string}>|IPromise<{ok: boolean, message: string}>|any}
   */
  signOut(body: {
    employeeId: string
  }): Promise<{ok: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.signOut,
      body: body
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          message: ''
        };
        let response = res;
        data.ok = (response.status == 200);
        data.message = response.message;
        return Promise.resolve(data);
      });
  }

  /**
   * 银行账户信息
   * @param query
   * @returns Promise<BankAccount>
   */
  bankAccount(query:{
    memberId:string
  }):Promise<{ok:boolean,data:BankAccount}>{
    return this.myHttp.get({
      api:this.myHttp.api.accountInfo,
      query:query
    }).toPromise()
      .then((res)=>{
        let result={
          ok:false,
          data:null
        };
        if(res.status===200){
          if(res.body&&res.body.records&&res.body.records[0]){
            result.ok=true;
            result.data=new BankAccount().init(res.body.records[0]);
          }
        }
        return Promise.resolve(result);
      });
  }

  /**
   * 获取产品融资证明材料列表
   * @param productId
   * @returns Promise<ProveData[]>
   */
  prodProveData(productId:string):Promise<ProveData[]>{
    return this.myHttp.post({
      api: this.myHttp.api.getProveData,
      body: {
        productId:productId
      }
    }).toPromise()
      .then((res)=> {
        let proveData = [];
        if (res.status === 200) {
          for(let o of res.body.records){
            let pd = ProveData.create(o);
            proveData.push(pd);
          }
        }
        return Promise.resolve(proveData);
      });
  }

  /**
   * 查询合同
   * @param query
   * @returns {PromiseLike<{items: Array, count: number}>|IPromise<{items: Array, count: number}>|Promise<{items: Array, count: number}>|wdpromise.Promise<any>|promise.Promise<Promise<{items: Array, count: number}>>|promise.Promise<any>|any}
   */
  queryContracts(query?:QueryContractBody):Promise<{items:Contract[],count:number}>{
    return this.myHttp.post({
      api:this.myHttp.api.contractList,
      query:query
    }).toPromise()
      .then((res)=>{
        let data={
          items:[],
          count:0
        };
        let result= res;
        if(result.status==200){
          data.count=result.body.paginator.totalCount;
          for(let o of result.body.records){
            let contract=new Contract().init(o);
            data.items.push(contract);
          }
        }
        return Promise.resolve(data);
      });
  }

}
