/**
 * （银行）账户信息
 */
export class BankAccount{
  bankAccount:string;//银行账户号
  accountName:string;//账户名
  availableBalance:number;//可用余额
  accountId:string;//账户ID
  lastTranTime:string;//最后交易时间

  init(obj?:any):BankAccount{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.bankAccount=obj.bankAccount;
      instance.accountName=obj.accountName;
      instance.availableBalance=parseFloat(obj.availableBalance);
      instance.accountId=obj.accountId;
      instance.lastTranTime=obj.lastTranTime;
      return instance;
    }
  }
  static create(obj?:any):BankAccount{
    return new BankAccount().init(obj);
  }
}
