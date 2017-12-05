import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
import {Loan} from '../../services/entity/Loan.entity';
import {Signatory} from '../../services/entity/Signatory.entity';
import {Signature} from '../../services/entity/Signature.entity';
import {Resource} from '../../services/entity/Resource.entity';
import {api_file} from '../../services/config/app.config';
import {Contract} from '../../services/entity/Contract.entity';
import {CreateContractBody} from './shared/CreateContractBody';
@Injectable()
export class ContractEditorService {

  constructor(
    private myHttp: MyHttpClient
  ) {

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
          for (let o of result.body.records) {
            let resource = new Resource().init(o);
            resources.push(resource);
          }
        }
        return Promise.resolve(resources);
      });
  }

  querySignatories(query?: any): Promise<{count: number,items: Signatory[]}> {
    return this.myHttp.post({
      api: this.myHttp.api.signatories,
      query: query
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
            let signatory=new Signatory();
            signatory.memberId=o.memberId;
            signatory.name=o.name;
            signatory.twUserId=o.twUserId;
            signatory.type=o.type;
            data.items.push(signatory);
          }
        }
        return Promise.resolve(data);
      });
  }

  getLoanById(id: string): Promise<Loan> {
    return this.myHttp.get({
      api: this.myHttp.api.loanDetail,
      query: {
        borrowApplyId: id
      }
    }).toPromise()
      .then((res)=> {
        let loan = new Loan();
        let result = res;
        if (result.status === 200) {
          loan=loan.init(result.body);
        }
        return Promise.resolve(loan);
      });

  }


  /*合同添加*/
  createContract(body:CreateContractBody):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      api: this.myHttp.api.createContract,
      body:body
    }).toPromise()
      .then((res)=> {
        let data = {
          status:false,
          message:''
        };
        let result = res
        data.status=(result.status==200);
        data.message=result.message||'';
        return Promise.resolve(data);
      });
  }

  deleteFile(fileId:string):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      url:api_file.delete,
      body:{
        fileId:fileId
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          status:false,
          message:''
        };
        let result = res;
        if (result.status === 200) {
        }
        data.status=(result.status==200);
        data.message=result.message||'';
        return Promise.resolve(data);
      });
  }



  queryContracts(query: {
    companyName?:string,
    borrowApplyId?: string,
    page?:number,
    rows?:number
  }): Promise<{count: number,items: Contract[]}> {
    return this.myHttp.post({
      api: this.myHttp.api.contractList,
      query: query
    }).toPromise()
      .then((res)=>{
        let data={
          count:0,
          items:[]
        };
        if(res.status===200){
          data.count=res.body.paginator.totalCount;
          for(let o of res.body.records){
            let contract=new Contract().init(o);
            data.items.push(contract);
          }
        }
        return Promise.resolve(data);
      });
  }

  queryContractSignatories(query: {
    contractId:string
  }): Promise<Signature[]> {
    return this.myHttp.post({
      api: this.myHttp.api.contractSignatories,
      query: query
    }).toPromise()
      .then((res)=>{
        let data=[];
        let result=res;
        if(result.status===200){
          for(let o of result.body.records){
            let signature=new Signature().init(o);
            data.push(signature);
          }
        }
        return Promise.resolve(data);
      });
  }

}
