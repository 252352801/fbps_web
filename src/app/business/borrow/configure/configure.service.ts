import {Injectable} from '@angular/core';
import {Loan} from '../../../../services/entity/Loan.entity';
import {Product} from '../../../../services/entity/Product.entity';
import {Resource} from '../../../../services/entity/Resource.entity';
import {RepayPlanPreview} from '../../../../services/entity/RepayPlanPreview.entity';
import {MyHttpClient} from '../../../../services/myHttp/myhttpClient.service';
import { BorrowService} from '../borrow.service';
import {Contract} from "../../../../services/entity/Contract.entity";
@Injectable()
export class BorrowConfigureService {
  constructor(
    private myHttp: MyHttpClient,
    private borrowSvc:BorrowService
  ) {

  }
  getLoanById(id:number):Promise<Loan>{
    return this.borrowSvc.getLoanById(id);
  }

  loadContracts(body?:{
    companyName?:string,
    borrowApplyId?:string,
    page?:number,
    rows?:number
  }):Promise<{count:number,items:Contract[]}>{
    return this.borrowSvc.loadContracts(body)
  }

  loadResources(resourceType:number): Promise<Resource[]> {
    return this.borrowSvc.loadResources(resourceType);
  }

  approveLoan(body: any): Promise<{status: boolean,message: string}> {
    return this.myHttp.post({
      api: this.myHttp.api.loanReview,
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
        id:id
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

  createRepayPlanPreview(body: any): Promise<RepayPlanPreview[]>{
    return this.myHttp.post({
      api: this.myHttp.api.createRepayPlanPreview,
      query: body
    }).toPromise()
      .then((res)=> {
        let data =[];
        let result = res;
        if(result.status==200){
          for(let o of result.body.records){
            let repayPlanPreview=new RepayPlanPreview().initByObj(o);
            data.push(repayPlanPreview);
          }
        }
        return Promise.resolve(data);
      });
  }
}
