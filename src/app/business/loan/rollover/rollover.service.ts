import {Injectable} from '@angular/core';
import {Rollover} from '../../../../services/entity/Rollover.entity';
import { MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { Loan} from '../../../../services/entity/Loan.entity';
import { RepayPlan} from '../../../../services/entity/RepayPlan.entity';
import { Product} from '../../../../services/entity/Product.entity';
@Injectable()
export class RolloverService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询展期申请列表
   */
  queryRollovers(query:any):Promise<{count:number,items:Rollover[]}>{

    return this.myHttp.post({
      api:this.myHttp.api.rolloverList,
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
            let rollover=new Rollover().init(o);
            data.items.push(rollover);
          }
        }
        return Promise.resolve(data);
      });

  }

  getRolloverById(id:string):Promise<Rollover>{
    return this.myHttp.get({
      api:this.myHttp.api.rollover,
      query:{
        rolloverApplyId:id
      }
    }).toPromise()
      .then((res)=>{
        let rollover=new Rollover();
        let result=res;
        if(result.status===200){
          rollover.init(result.body);
        }
        return Promise.resolve(rollover);
      });
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
          product.init(result.body);
        }
        return Promise.resolve(product);
      });
  }
}
