/**
 * （银行）账户流水
 */
export class BankAccountFlow{
  flowId:string;//流水id
  dealTime:string;//交易时间
  amount:number;//交易金额
  availableBalance:number;//可用余额
  oppoAcctNo:string;//对方账户号
  oppoAcctName:string;//对方账户名
  tradeType:number;//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
  tradeTypeName:string;
  createTime:string;//创建时间
  myAcctNo:string;//我方帐号
  myAcctName:string;//我方帐户名
  remark:string;//备注

  init(obj?:any):BankAccountFlow{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.flowId=obj.flowId;
      instance.dealTime=obj.dealTime;
      instance.amount=parseFloat(obj.amount);
      instance.availableBalance=parseFloat(obj.availableBalance);
      instance.oppoAcctNo=obj.oppoAcctNo;
      instance.oppoAcctName=obj.oppoAcctName;
      instance.tradeType=parseInt(obj.tradeType);
      instance.createTime=obj.createTime;
      instance.myAcctNo=obj.myAcctNo;
      instance.myAcctName=obj.myAcctName;
      instance.remark=obj.remark;
      return instance;
    }
  }
  static create(obj?:any):BankAccountFlow{
    return new BankAccountFlow().init(obj);
  }
}
