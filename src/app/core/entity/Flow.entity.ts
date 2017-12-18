/**
 * 流水
 */
export class Flow{
  dealTime:string;//交易时间
  amount:number;//交易金额
  availableBalance:number;//可用余额
  oppoAcctNo:string;//对方账户号
  oppoAcctName:string;//对方账户名
  tradeType:string|number;//交易类型
  createTime:string;//创建时间
  myAcctNo:string;//我方帐号
  myAcctName:string;//我方帐户名
  remark:string;//备注
  init(obj:any):Flow{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.dealTime=obj.dealTime;
      instance.amount=obj.amount;
      instance.availableBalance=obj.availableBalance;
      instance.oppoAcctNo=obj.oppoAcctNo;
      instance.oppoAcctName=obj.oppoAcctName;
      instance.tradeType=obj.tradeType;
      instance.createTime=obj.createTime;
      instance.myAcctNo=obj.myAcctNo;
      instance.myAcctName=obj.myAcctName;
      instance.remark=obj.remark;
    }
    return instance;
  }
  static create(obj:any):Flow{
    return new Flow().init(obj);
  }
}
