import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../../core/services/myHttp/myhttpClient.service';
import {Loan} from '../../../core/entity/Loan.entity';
import {Signatory} from '../../../core/entity/Signatory.entity';
import {Signature} from '../../../core/entity/Signature.entity';
import {Resource} from '../../../core/entity/Resource.entity';
import {config} from '../../../core/config/app.config';
import {Contract} from '../../../core/entity/Contract.entity';
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
        if (res.status === 200) {
          loan=loan.init(res.body);
        }
        return Promise.resolve(loan);
      });

  }


  /*合同添加*/
  createContract(body:CreateContractBody):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api: this.myHttp.api.createContract,
      body:body
    }).toPromise()
      .then((res)=> {
        let data = {
          ok:false,
          message:''
        };
        data.ok=(res.status==200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }

  deleteFile(fileId:string):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:config.api.removeFile,
      body:{
        fileId:fileId
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          ok:false,
          message:''
        };
        data.ok=(res.status==200);
        data.message=res.message||'';
        return Promise.resolve(data);
      });
  }

  /**
   *
   * @param query
   * @returns Promise<{count: number,items: Contract[]}>
   */
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
