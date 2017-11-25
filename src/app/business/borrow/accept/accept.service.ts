import {Injectable} from '@angular/core';
import { Loan} from '../../../../services/entity/Loan.entity';
import { Product} from '../../../../services/entity/Product.entity';
import { ProductConfig} from '../../../../services/entity/ProductConfig.entity';
import { ProveData} from '../../../../services/entity/ProveData.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
import { AcceptBody} from './accept.interface';
@Injectable()
export class AcceptService{
  constructor(
    private myHttp:MyHttpClient,
    private borrowSvc:BorrowService
  ){

  }
  /**
   * 查询贷款申请列表
   */
  loadProducts(query?:any):Promise<Product[]>{

    return this.myHttp.post({
      api:this.myHttp.api.productList,
      query:query
    }).toPromise()
      .then((res)=>{
        let prods=[];
        let result=res;
        if(result.status===200){
          let prod=new Product();
          prods.push(prod);
        }
        return Promise.resolve(prods);
      });

  }

  loadProductConfigs(productId:string):Promise<ProductConfig[]>{
    return this.myHttp.get({
      api:this.myHttp.api.productConfigList,
      query:{
        productId:productId
      }
    }).toPromise()
      .then((res)=>{
        let configs=[];
        let result=res;
        if(result.status===200){
          for(let o of result.body.records){
            let config=new ProductConfig().initByObj(o);
            configs.push(config);
          }
        }
        return Promise.resolve(configs);
      });
  }

  getLoanById(id:number):Promise<Loan>{
    return this.borrowSvc.getLoanById(id);

  }
  /**
   * 获取产品融资证明材料列表
   * @param productId
   * @returns Promise<ProveData[]>
   */
  getProdProveData(productId:string):Promise<ProveData[]> {
    return this.myHttp.post({
      api: this.myHttp.api.getProveData,
      body: {
        productId: productId
      }
    }).toPromise()
      .then((res)=> {
        let proveData = [];
        let result = res;
        if (result.status === 200) {
          for (let o of result.body.records) {
            let pd = ProveData.create(o);
            proveData.push(pd);
          }
        }
        return Promise.resolve(proveData);
      });
  }
  approveLoan(body:AcceptBody):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.firstApprove,
      query:body
    }).toPromise()
        .then((res)=>{
          let data={
            status:false,
            message:''
          };
          let result=res;
          data.status=(result.status==200);
          data.message=result.message;
          return Promise.resolve(data);
        });
  }
}
