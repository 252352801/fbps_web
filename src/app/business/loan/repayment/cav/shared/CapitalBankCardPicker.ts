import {Injectable} from '@angular/core';
import {BankCard} from '../../../../../../services/entity/BankCard.entity';
import {Resource} from '../../../../../../services/entity/Resource.entity';
import {SubmitBankCard} from './SubmitBankCard.interface';
import {CommonService} from '../../../../../../services/common/common.service';
import {myInjector} from '../../../../../shared/myInjector.service';
import {Capital} from "../../../../../../services/entity/Capital.entity";
@Injectable()
export class CapitalBankCardPicker{
  capitalOptions:Resource[]=[];//资方选项
  selections:{
    amount:number,//金额
    bankCardId:string,//选中的银行卡id
    capitalId:string,//资方ID 默认空字符串
    bankCardOptions:BankCard[],//资方的银行卡列表
    timestamp?:number|string //唯一标识
  }[]=[];
  private commonSvc:CommonService=myInjector.get(CommonService);
  constructor(){
    this.init();
    this.loadCapitals()
      .then((data)=>{
        this.addDefaultCapitalOption();
      });
  }
  init(){
    this.selections=[];
    this.addSelection();
  }

  /**
   * 资方选项加默认项
   */
  addDefaultCapitalOption(){
    if(this.capitalOptions instanceof Array){
      let defaultCapital=new Resource();
      defaultCapital.resourceId='';
      defaultCapital.resourceName='请选择';
      this.capitalOptions=[defaultCapital].concat(this.capitalOptions);
    }
  }

  /**
   * 银行卡选项加默认项
   * @param index
   */
  private addDefaultBankCardOption(index:number){
    if(this.capitalOptions instanceof Array){
      let defaultBankCard=new BankCard();
      defaultBankCard.cardId='';
      defaultBankCard.cardName='请选择';
      this.selections[index].bankCardOptions=[defaultBankCard].concat(this.selections[index].bankCardOptions);
    }
  }


  /**
   * 获取资方列表
   * @returns {Promise<Resource[]>}
   */
  loadCapitals():Promise<Resource[]>{
    return this.commonSvc.resources({
      resourceType:1
    })
      .then((res)=>{
        let opts=[];
        for(let o of res) {
          opts.push(o);
        }
        this.capitalOptions=opts;
        return Promise.resolve(this.capitalOptions);
      })
      .catch((err)=>{});
  }

  addSelection(){
    let opt={
      amount:null,
      bankCardId:'',//选中的银行卡Id
      capitalId:'',//资方ID
      bankCardOptions:[],//资方的银行卡列表
      timestamp:new Date().getTime()
    };
    this.selections.push(opt);
    this.addDefaultBankCardOption(this.selections.length-1);
  }

  removeSelection(index:number){
    this.selections.splice(index,1);
  }

  loadBankCard(index:number,pageSize?:number){
    this.selections[index].bankCardOptions=[];
    this.addDefaultBankCardOption(index);
    let capitalId=this.selections[index].capitalId;
    let body:{
      resourceId:string,
      page?:number,
      rows?:number
    }={
      resourceId:capitalId,
    };
    if(pageSize){
      body.rows=pageSize;
    }
    this.commonSvc.capitalBankCards(body)
      .then((res)=>{
        if(res.count>res.items.length){
          this.loadBankCard(index,res.count);
        }else{
          this.selections[index].bankCardOptions=res.items;
          this.addDefaultBankCardOption(index);
        }


        //dev
 /*       let arr=[];
        for(var i=0;i<6;i++){
          let bc=new BankCard();
          bc.cardId=new Date().getTime()+''+i;
          bc.cardName='银行卡'+(i+1);
          bc.cardNo='00000000000000'+(i+1);
          bc.bankName='工商银行';
          bc.lineNo='银联';
          bc.subbankName='工商银行广州支行';
          bc.type=0;
          arr.push(bc);
        }
        this.selections[index].bankCardOptions=arr;
        this.addDefaultBankCardOption(index);*/
        //dev--end
      });
  }

  getSelectedBankCards():SubmitBankCard[]{
    let cards:SubmitBankCard[]=[];
    for(let o of this.selections){
      if(o.amount||o.amount===0){
        if(o.bankCardId){
          let bankCard:BankCard;
          loopInner:
          for(let bk of o.bankCardOptions){
            if(bk.cardId===o.bankCardId){
              bankCard=bk;
              break loopInner;
            }
          }
          if(bankCard){
            let card:SubmitBankCard={
              amount:o.amount,
              toBankName:bankCard.bankName,
              toBankNo:bankCard.cardNo,
              toBankSub:bankCard.subbankName,
              toLineNo:bankCard.lineNo,
              toAccountName:bankCard.cardName,
              toAccountId:bankCard.cardId
            };
            cards.push(card);
          }
        }
      }
    }
    return cards;
  }
}
