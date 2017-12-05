import {BankAccount} from '../../../../../../services/entity/BankAccount.entity';
import {CommonService} from '../../../../../../services/common/common.service';
import {myInjector} from '../../../../../shared/myInjector.service';
import {md5} from '../../../../../../services/encrypt/md5';
import {CapitalBankCardPicker} from './CapitalBankCardPicker';
import {SubmitBankCard} from './SubmitBankCard.interface';
import {CheckRepaymentBody} from './CheckRepaymentBody.interface';
import {MyHttpClient} from '../../../../../../services/myHttp/myhttpClient.service';
import {PopService,Toaster} from 'dolphinng';
export class ConfirmCheckModal{
  type:number=0;//还款方式  0:线上  1:线下
  memberId:string='';
  bankAccount:BankAccount=new BankAccount();
  bankCardPicker:CapitalBankCardPicker=new CapitalBankCardPicker();
  private commonSvc:CommonService=myInjector.get(CommonService);
  private myHttpClient:MyHttpClient=myInjector.get(MyHttpClient);
  private pop:PopService=myInjector.get(PopService);
  private toaster:Toaster=myInjector.get(Toaster);
  visible:boolean=false;
  submitted:boolean=false;

  submitData:CheckRepaymentBody;
  constructor(){

  }
  setSubmitData(data:CheckRepaymentBody){
    this.submitData=data;
  }
  loadBankAccount(memberId?:string){
    let id=memberId||this.memberId;
    if(id){
      this.commonSvc.bankAccount({memberId:id})
        .then((res)=>{
          if(res.ok){
            this.bankAccount=res.data;
          }
        })
        .catch((err)=>{

        });
    }
  }
  getSelectedBankCards():SubmitBankCard[]{
    return this.bankCardPicker.getSelectedBankCards();
  }
  open(type?:number){
    if(type!==undefined){
      this.type=type;
    }
    this.loadBankAccount();
    if(this.type===0){
      this.bankCardPicker.init();
    }
    this.submitted=false;
    this.visible=true;
  }
  close(){
    this.visible=false;
  }
  submit(){
    let body=this.submitData;
    if(this.type===0){//线上
      this.submitData.bankList=this.getSelectedBankCards();
    }
    this.submitted=true;
    body.auditPwd=md5(body.auditPwd);
    console.log(body);
    this.checkRepayment(body)
      .then((res)=>{
        this.submitted=false;
        if(res.ok){
          this.close();
          this.pop.info('核销成功！')
            .onConfirm(()=>{
              history.back();
            })
            .onClose(()=>{
              history.back();
            });
        }else{
          this.toaster.error('',res.message||'核销失败！');
        }
      })
      .catch((err)=>{
        this.submitted=false;
        this.toaster.error('','请求失败！');
      })
  }



  checkRepayment(body:CheckRepaymentBody): Promise<{ok: boolean,message: string}> {
    return this.myHttpClient.post({
      api:this.myHttpClient.api.checkRepayment,
      body:body
    }).toPromise()
      .then((res)=>{
        let result={ok:false,message:''};
        result.ok=(res.status==200);
        result.message=res.message;
        return Promise.resolve(result);
      });
  }

}
