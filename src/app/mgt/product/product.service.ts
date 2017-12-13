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
  penaltyRate:string|number,
  status:string|number
}
@Injectable()
export class ProductService{
  constructor(private myHttp:MyHttpClient){

  }

  /**
   * 查询产品详情
   * @param id
   * @returns Promise<Product>
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
        if(res.status===200){
          product.init(res.body);
        }
        return Promise.resolve(product);
      });
  }

  /**
   * 查询产品列表
   * @param query
   * @returns Promise<{count:number,items:Product[]}>
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
        if(res.status===200){
          data.count=res.body.paginator.totalCount;
          for(let o of res.body.records){
            let product=new Product().init(o);
            data.items.push(product);
          }
        }
        return Promise.resolve(data);
      });
  }

  /**
   * 更新产品状态
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  updateProductsStatus(body:{productId:string,status:number}):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.updateProductsStatus,
      query:body
    }).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        data.ok=(res.status==200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }

  /**
   * 加载产品配置列表
   * @param productId
   * @returns  Promise<ProductConfig[]>
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
            let prodConf = new ProductConfig().init(o);
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
