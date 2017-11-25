import {Injectable} from '@angular/core';
import { Loan} from '../../../services/entity/Loan.entity';
import { MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
import {Contract} from "../../../services/entity/Contract.entity";
import {Resource} from '../../../services/entity/Resource.entity';
import {ProveData} from '../../../services/entity/ProveData.entity';
@Injectable()
export class BorrowService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 查询贷款申请列表
   */
  queryLoans(query:any):Promise<{count:number,items:Loan[]}>{

    return this.myHttp.get({
      api:this.myHttp.api.loanList,
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
          for(let l of result.body.records){
            if(l) {
              let loan = new Loan().initByObj(l);
              data.items.push(loan);
            }
          }
        }
        return Promise.resolve(data);
      });

  }
  getLoanById(id:number):Promise<Loan>{
    return this.myHttp.get({
      api:this.myHttp.api.loanDetail,
      query:{
        borrowApplyId:id
      }
    }).toPromise()
      .then((res)=>{
        let loan=new Loan();
        let result=res;
        if(result.status===200){
          loan.initByObj(result.body);
        }
        return Promise.resolve(loan);
      });

  }

  loadContracts(body?:{
    companyName?:string,
    borrowApplyId?:string,
    page?:number,
    rows?:number
  }):Promise<{count:number,items:Contract[]}>{
    return this.myHttp.post({
      api:this.myHttp.api.contractList,
      body:body
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
            let contract=new Contract().initByObj(o);
            data.items.push(contract);
          }
        }
        return Promise.resolve(data);
      });
  }

  /**
   * 渠道或资方列表
   * @param resourceType 0渠道 1资方
   * @returns {Promise<Promise<Array>>|IPromise<Array>|PromiseLike<Array>|promise.Promise<any>|promise.Promise<Promise<Array>>|Promise<Array>|any}
   */
  loadResources(resourceType:number): Promise<Resource[]> {
    return this.myHttp.get({
      api: this.myHttp.api.resource,
      query: {
        resourceType:resourceType
      }
    }).toPromise()
      .then((res)=> {
        let resources = [];
        let result = res;
        if (result.status === 200) {
          for (let o of result.body.records) {
            let resource = new Resource().initByObj(o);
            resources.push(resource);
          }
        }
        return Promise.resolve(resources);
      });
  }

  cancelLoan(body:{
    borrowApplyId:string,
    operator:string,//操作者
    remarks:string//备注
  }):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.cancelLoan,
      body:body}
    ).toPromise()
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

  getLoanProveData(borrowApplyId:string):Promise<ProveData[]>{
    return this.myHttp.post({
      api:this.myHttp.api.loanProveData,
      body:{
        borrowApplyId:borrowApplyId
      }
    } ).toPromise()
      .then((res)=>{
        let items:ProveData[]=[];
        let result=res;
        if(result.status==200){
          for(let o of result.body.records){
            let pd = ProveData.create(o);
            items.push(pd);
          }
        }
        return Promise.resolve(items);
      });
  }

}
