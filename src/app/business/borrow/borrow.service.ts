import {Injectable} from '@angular/core';
import { MyHttpClient} from '../../../services/myHttp/myhttpClient.service';
import {Resource} from '../../../services/entity/Resource.entity';
import {RepayPlanPreview} from '../../../services/entity/RepayPlanPreview.entity';
@Injectable()
export class BorrowService{
  constructor(private myHttp:MyHttpClient){

  }
  /**
   * 渠道或资方列表
   * @param resourceType 0渠道 1资方
   * @returns Promise<Resource[]>
   */
  loadResources(resourceType:number): Promise<Resource[]> {
    return this.myHttp.get({
      api: this.myHttp.api.resource,
      query: {
        resourceType:resourceType
      }
    }).toPromise()
      .then((res)=> {
        let resources:Resource[] = [];
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

  /**
   * 取消
   * @param body
   * @returns Promise<{ok:boolean,message:string}>
   */
  cancelLoan(body:{
    borrowApplyId:string,
    operator:string,//操作者
    remarks:string//备注
  }):Promise<{ok:boolean,message:string}>{
    return this.myHttp.post({
      api:this.myHttp.api.cancelLoan,
      body:body}
    ).toPromise()
      .then((res)=>{
        let data={
          ok:false,
          message:''
        };
        data.ok=(res.status==200);
        data.message=res.message;
        return Promise.resolve(data);
      });
  }

  /**
   * 还款计划预览
   * @param body
   * @returns Promise<RepayPlanPreview[]>
   */
  createRepayPlanPreview(body:{
    amount: number,
    rate:number,//利率
    rateCycle: string,//借款周期
    paymentWay: number|string,//用款类型/还款方式
    loanDate: string, //放款日期
    interestType:number|string//计息类型
  }): Promise<RepayPlanPreview[]>{
    return this.myHttp.post({
      api: this.myHttp.api.createRepayPlanPreview,
      query: body
    }).toPromise()
      .then((res)=> {
        let data =[];
        if(res.status==200){
          for(let o of res.body.records){
            let repayPlanPreview=new RepayPlanPreview().init(o);
            data.push(repayPlanPreview);
          }
        }
        return Promise.resolve(data);
      });
  }
}
