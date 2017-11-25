import {Injectable} from '@angular/core';
import { Rollover} from '../../../../../services/entity/Rollover.entity';
import { MyHttpClient} from '../../../../../services/myHttp/myhttpClient.service';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { Contract} from '../../../../../services/entity/Contract.entity';
@Injectable()
export class ConfigService{
  constructor(private myHttp:MyHttpClient){

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
          rollover.initByObj(result.body);
        }
        return Promise.resolve(rollover);
      });
  }
  getLoanById(id:string):Promise<Loan>{
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
  approve(body:any):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.approveRollover,
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

}
