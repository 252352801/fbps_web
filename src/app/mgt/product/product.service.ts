import {Injectable} from '@angular/core';
import { Product} from '../../../services/entity/Product.entity';
import { MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
import {ProductConfig} from '../../../services/entity/ProductConfig.entity';
import {ProveData} from '../../../services/entity/ProveData.entity';
export interface ProductBody{
  productId?:string,
  productName:string,
  productRemark:string,
  productCompany:string,
  expiryDate:string|number,
  productRequirement:string,
  productAppScope:string|number,
  productAreaScope:string|number,
  productType:string|number,
  valueLimit:string,
  interestType?:string|number,
  fileType?:string,
  borrowHowlong:string,
  rolloverHowlong:string|number,
  rolloverInterestValue:string|number,
  rolloverDeposit:string|number,
  overdueInterestValue:string|number,
  status:string|number
}
@Injectable()
export class ProductService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询产品详情
   */
  getProductById(id:string):Promise<Product>{

    return this.myHttp.post({
      api:this.myHttp.api.product,
      query:{
        productId:id
      }
    }).toPromise()
      .then((res)=>{
        let product=new Product();
        let result=res;
        if(result.status===200){
          product.initByObj(result.body);
        }
        return Promise.resolve(product);
      });
  }
  /**
   * 查询产品列表
   */
  queryProducts(query?:any):Promise<{count:number,items:Product[]}>{

    return this.myHttp.post({
      api:this.myHttp.api.productList,
      query:query
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
            let product=new Product().initByObj(o);
            data.items.push(product);
          }
        }
        return Promise.resolve(data);
      });
  }
  updateProductsStatus(body:{productId:string,status:number}):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.updateProductsStatus,
      query:body
    }).toPromise()
      .then((res)=>{
        let data={
          status:false,
          message:''
        };
        let result=res;
        data.status=(result.status==200);
        data.message=result.message||'';
        return Promise.resolve(data);
      });
  }

  /**
   * 加载产品配置列表
   * @param productId
   * @returns {promise.Promise<Promise<Array>>|Promise<Promise<Array>>|wdpromise.Promise<T>|PromiseLike<Array>|promise.Promise<R>|wdpromise.Promise<any>|any}
   */
  loadProductConfigs(productId:string): Promise<ProductConfig[]> {
    return this.myHttp.get({
      api: this.myHttp.api.productConfigList,
      query: {
        productId:productId
      }
    }).toPromise()
      .then((res)=> {
        let productConfigs = [];
        let result = res;
        if (result.status === 200) {
          for(let o of result.body.records){
            let prodConf = new ProductConfig().initByObj(o);
            productConfigs.push(prodConf);
          }
        }
        return Promise.resolve(productConfigs);
      });
  }

  /**
   * 获取产品融资证明材料列表
   * @param productId
   * @returns Promise<ProveData[]>
   */
  getProveData(productId:string):Promise<ProveData[]>{
    return this.myHttp.post({
      api: this.myHttp.api.getProveData,
      body: {
        productId:productId
      }
    }).toPromise()
      .then((res)=> {
        let proveData = [];
        let result = res;
        if (result.status === 200) {
          for(let o of result.body.records){
            let pd = ProveData.create(o);
            proveData.push(pd);
          }
        }
        return Promise.resolve(proveData);
      });
  }

}
