/**
 * （银行）账户信息
 */
export class BankAccount{
  bankAccount:string;//银行账户号
  accountName:string;//账户名
  availableBalance:number;//可用余额
  accountId:string;//账户ID
  lastTranTime:string;//最后交易时间

  initByObj(obj:any):BankAccount{
    if(obj&&typeof obj==='object'){
      this.bankAccount=obj.bankAccount;
      this.accountName=obj.accountName;
      this.availableBalance=parseFloat(obj.availableBalance);
      this.accountId=obj.accountId;
      this.lastTranTime=obj.lastTranTime;
    }
    return this;

  }
}
