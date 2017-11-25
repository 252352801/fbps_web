import {Injectable} from '@angular/core';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
import {Loan} from '../../services/entity/Loan.entity';
import {Signatory} from '../../services/entity/Signatory.entity';
import {Signature} from '../../services/entity/Signature.entity';
import {Resource} from '../../services/entity/Resource.entity';
import {api_file} from '../../services/config/app.config';
import {Contract} from '../../services/entity/Contract.entity';
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
            let resource = new Resource().initByObj(o);
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
          loan.borrowApplyId = result.body.borrowApplyId;
          loan.memberId = result.body.memberId;
          loan.companyName = result.body.companyName;
          loan.applyAmount = parseFloat(result.body.applyAmount);
          loan.approveAmount = parseFloat(result.body.approveAmount);
          loan.productId = result.body.productId;
          loan.borrowHowlong = result.body.borrowHowlong;
          loan.repaymentWay = result.body.repaymentWay;
          loan.cardId = result.body.cardId;
          loan.cardNo = result.body.cardNo;
          loan.isContract = !!parseFloat(result.body.isContract);
          loan.status = parseFloat(result.body.status);
          loan.createTime = result.body.createTime;
          loan.auditOneTime = result.body.auditOneTime;
          loan.auditOneBy = result.body.auditOneBy;
          loan.remarks = result.body.remarks;
        }
        return Promise.resolve(loan);
      });

  }


  /*合同添加*/
  createContract(body:any):Promise<{status:boolean,message:string}>{
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
        let result=res;
        if(result.status===200){
          data.count=result.body.paginator.totalCount;
          for(let o of result.body.records){
            let contract=new Contract().initByObj(o);
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
            let signature=new Signature().initByObj(o);
            data.push(signature);
          }
        }
        return Promise.resolve(data);
      });
  }

}
